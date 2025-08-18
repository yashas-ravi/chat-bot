
# Chat Bot

The Chatbot Application is an interactive communication platform designed to integrate user authentication, real-time chat functionality, and AI-powered responses. The system leverages Nhost Authentication for secure user management, Hasura GraphQL for efficient backend data operations, and n8n workflow automation to connect with external AI services through Hasura Actions.

## Getting Started

These instructions will give you a copy of the project up and running on
your local machine for development and testing purposes. See deployment
for notes on deploying the project on a live system.

### Prerequisites

1. Nhost for backenda and database -> https://nhost.io/ 
2. Hasura for graphQL communications -> Nhost service
2. N8N for automation ->  https://n8n.io
3. OpenRouter for trained ai models -> https://openrouter.ai/

### Installing

1. Clone the Repository:
Download the project files from the repository or unzip the provided source code.
git clone https://github.com/yashas-ravi/chat-bot.git

2. Install Dependencies
The project uses Node.js and package managers like npm or yarn. Run the following command to install required packages:
<b>npm install or yarn install</b>

3. Configure Environment Variables
Create a .env file in the root folder and provide the required credentials:
Nhost authentication keys

4. npm start

The app will be available at http://localhost:3000.

## Deployment

Make a zip file of this chat bot or if you have one.
deploy it using zip file deploy option in netlify -> https://www.netlify.com/

## Built With

React -> https://react.dev/ </br>
Nhost -> https://nhost.io/ </br>
N8N -> https://n8n.io</br>
OpenRouter -> https://openrouter.ai/