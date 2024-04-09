import { useState } from 'react';
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react'

const API_KEY = "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";

const systemMessage = {
  role: "system",
  content: "Explain like I'm a bachelor's graduate with humble and polite tone. Keep the conversation friendly like a virtual pal/close friend, but also factual."
}

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hey! I'm your virtual pal, ask me anything!",
      sender: "ChatGPT",
      direction: "incoming"
    }
  ])

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    }

    const newMessages = [...messages, newMessage];

    //update our messages state

    setMessages(newMessages);
    //set typing indicator
    setTyping(true);

    //process messsage to chatgpt
    await processMessageToChatGPT(newMessages);
  }

  async function processMessageToChatGPT(chatMessages) {
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



    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      if (!data.ok) {
        throw new Error(`HTTP error! status: ${data.status}`);
      }
      return data.json();
    }).then((data) => {
      console.log(data);
      const chatGPTResponse = {
        message: data.choices[0].message.content,
        sender: "ChatGPT",
        direction: "incoming" // Messages from ChatGPT will be incoming
      };

      setMessages([...chatMessages, chatGPTResponse]);
      setTyping(false);
    }).catch((error) => {
      console.error("Error fetching data: ", error);
    });
  }

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
                  // Adjust the 'direction' and 'position' of the message based on the sender
                  const position = message.sender === "ChatGPT" ? "incoming" : "outgoing";
                  return <Message key={i} model={{ ...message, position: position }} />;
                })
              }
            </MessageList>
            <MessageInput placeholder='Type Message Here' onSend={handleSend} attachButton={false} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default App
