import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

import { useState } from 'react';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react'

// For potetntial employers: if you need an API KEY to test out my App, do contact me!
const API_KEY = "INSERT_API_KEY_HERE"; 

// A system message for OpenAI that sets the context for the chatbot's responses.
const systemMessage = {
  role: "system",
  content: "Please provide explanations that are straightforward and easy to understand, using everyday language. Aim for a tone that's friendly and engaging, as if you're talking to a friend who's knowledgeable but approachable. Keep the explanations accurate and grounded in facts."
}

function App() {
  // Tracking whether the bot is typing, its for typing indicator use
  const [typing, isTyping] = useState(false);

  // contains the array of message objects, containing messages, sender and direction of message (for chatscope use)
  const [messages, updateMessages] = useState([
    {
      message: "Hey! I'm your Virtual Pal, ask me anything!",
      sender: "ChatGPT",
      direction: "incoming"
    }
  ])

  // when message is send, this event will be triggered, to store the messages into the array and process it
  const sentEvent = async (message) => {

    // creating a new message object with the message sent by the user
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    }
    // appending the new message to the existing messages array
    const newMessages = [...messages, newMessage];

    // updating the messages state with the new array of messages
    updateMessages(newMessages);

    isTyping(true);

    // process messsage to openai, to generate a response 
    // await is used here because of the async function
    await processMsgToOpenAI(newMessages);
  }

  // function to process messages and send them to the OpenAI API
  async function processMsgToOpenAI(chatMessages) {
    // Mapping the chatMessages to the format expected by the OpenAI API
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      }
      else {
        role = "user";
      }
      return { role: role, content: messageObject.message }
    });

    // the template of the request required by OpenAI API
    const apiRequestMsg = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages
      ]
    }

    // making an asynchronous POST request to the OpenAI API
    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestMsg)
    }).then((data) => {
      if (!data.ok) {
        throw new Error(`Error! status: ${data.status}`);
      }
      return data.json();
    }).then((data) => {
      if (!data.ok) {
        throw new Error(`Error! status: ${data.status}`);
      }
      // creating a new message object for the response from OpenAI
      const chatGPTResponse = {
        message: data.choices[0].message.content,
        sender: "ChatGPT",
        direction: "incoming" 
      };
      // updating the messages state with the new OpenAI response
      updateMessages([...chatMessages, chatGPTResponse]);
      isTyping(false);
    }).catch((error) => {
      console.error("Error fetching data: ", error);
    });
  }

  // Rendering the chat interface via chatscope API
  return (
    <div className="App">
       <div className="header" style={{ 
          backgroundColor: '#dad0ff', 
          padding: '6px', 
          textAlign: 'center', 
          fontSize: '28px', 
          fontFamily: 'Lucida Console',
          borderBottom: '1px solid #e1e1e1', 
        }}>
        Virtual Pal
      </div>
      <div style={{ position: "relative", height: "800px", width: "700px" }}>
        <MainContainer>
          <ChatContainer className='my-chat-container'> 
            <MessageList autoScrollToBottom={true} scrollBehavior="auto" typingIndicator={typing ? <TypingIndicator content="ChatGPT is typing" /> : null} >
              {
                messages.map((message, i) => {
                  const position = message.sender === "ChatGPT" ? "incoming" : "outgoing";
                  return <Message key={i} model={{ ...message, position: position }} />;
                })
              }
            </MessageList>
            <MessageInput placeholder='Type Message Here' onSend={sentEvent} attachButton={false} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default App
