# Virtual Pal Chat Application

I've made a simple chat bot called Virtual Pal using OpenAI's API GPT-3.5 model, designed to offer an engaging and interactive conversation!

## Prerequisites

Before you begin, ensure you have met the following requirements:

* You have installed the latest version of [Node.js and npm](https://nodejs.org/en/).
* You have read the [OpenAI API documentation](https://beta.openai.com/docs/) and have obtained an API key.
Potential employers: If you need an API key to test out my app, please contact me!

## Installation and Setup

To install and setup Virtual Pal, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/oxxuanxxo/Virtual-Pal-OpenAI
    ```

2. Install the project dependencies:
    ```bash
    npm install
    ```

3. Add your OpenAI API key:
    Head to src/App.jsx, replace `INSERT_API_KEY_HERE` with your actual API key:
    ```javascript
    const API_KEY = "INSERT_API_KEY_HERE";
    ```
    Note to potential employers: Please contact me if you need an API key to test out my app!

4. Start the application:
    In the project directory, head over to the command prompt:
    ```bash
    npm run dev
    ```
    This will start the React development server and open the chat application in your default web browser at http://localhost:5173/.


## Using Virtual Pal
Once the application is running, simply type your message into the input field and hit send. Virtual Pal will generate a response using the OpenAI API.

