# 🚀 Lucid Deck - AI-Powered Code IDE

Lucid Deck is a modern, full-stack, AI-driven Integrated Development Environment (IDE) built for students and developers. Powered by Google's Gemini API, it simulates code execution across multiple languages and acts as an intelligent coding assistant to help users explain, debug, review, and test their code.

## ✨ Features

* **Multi-Language Support:** Write and simulate execution for Python, JavaScript, HTML/CSS, C++, C, and Java.
* **AI Compiler Simulation:** Uses Gemini API to intelligently analyze code for syntax errors and simulate console output with high fidelity.
* **Live HTML Preview:** Instantly visualizes HTML, CSS, and JS changes in a live iframe.
* **Intelligent Coding Assistant:**
  * **Explain:** Breaks down complex logic step-by-step.
  * **Debug:** Analyzes code for logical/syntax errors and provides fixes.
  * **Docs:** Automatically generates comprehensive comments and docstrings.
  * **Analysis:** Calculates Time and Space complexity.
  * **Review:** Performs a strict code review enforcing best practices.
  * **Quiz:** Generates multiple-choice questions to test your understanding of the written code.
* **Execution History:** Automatically logs past compilations, allowing you to easily restore previous code states.
* **PDF Export:** Downloads a complete report of the source code, terminal output, and student metadata (Name & Roll No.) for assignments.
* **Rich Markdown Rendering:** AI responses are beautifully formatted with code highlighting and dropdowns.
* **Customization:** Toggle between Dark/Light modes and adjust editor font sizes.

## 🛠 Tech Stack

**Frontend:**
* [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
* [Tailwind CSS](https://tailwindcss.com/) (Styling)
* [Lucide React](https://lucide.dev/) (Icons)
* [React Markdown](https://github.com/remarkjs/react-markdown) & [Rehype Raw](https://github.com/rehypejs/rehype-raw) (AI Output Formatting)

**Backend:**
* [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
* [Google Gemini API](https://ai.google.dev/) (AI logic and compilation)

## 📂 Project Structure

This project is set up as a monorepo containing both the frontend and backend.

```text
lucid-deck-fullstack/
├── backend/                  # Node.js & Express server
│   ├── index.js              # Main server logic & Gemini API integration
│   ├── package.json
│   └── .env                  # Backend secrets (ignored in Git)
├── client1/pixi/             # React + Vite frontend application
│   ├── src/
│   │   ├── pages/
│   │   │   └── Codeide.jsx   # Main IDE component
│   │   └── App.jsx
│   ├── vercel.json           # SPA routing config for Vercel
│   ├── package.json
│   └── vite.config.js
└── README.md

🚀 Local Setup & Installation
Prerequisites
Node.js installed on your machine.

A Gemini API Key from Google AI Studio.

1. Clone the Repository
Bash
git clone [https://github.com/viraj0-0/lucid-deck-fullstack.git](https://github.com/viraj0-0/lucid-deck-fullstack.git)
cd lucid-deck-fullstack
2. Setup the Backend
Navigate to the backend folder, install dependencies, and set up your environment variables.

Bash
cd backend
npm install
Create a .env file inside the backend folder and add:

Code snippet
GEMINI_API_KEY=your_gemini_api_key_here
ALLOWED_ORIGIN=http://localhost:5173
PORT=3000
Start the server:

Bash
node index.js
3. Setup the Frontend
Open a new terminal, navigate to the frontend folder, and install dependencies.

Bash
cd client1/pixi
npm install
Create a .env file inside the client1/pixi folder and add:

Code snippet
VITE_API_URL=http://localhost:3000
Start the frontend development server:

Bash
npm run dev
🌍 Deployment
This project is configured for easy deployment on Vercel (Frontend) and Render (Backend).

Deploying the Backend (Render)
Create a new Web Service on Render connected to this GitHub repository.

Set the Root Directory to backend.

Set the Build Command to npm install and Start Command to node index.js.

Add the GEMINI_API_KEY and ALLOWED_ORIGIN environment variables.

Deploying the Frontend (Vercel)
Import this GitHub repository into Vercel.

Set the Root Directory to client1/pixi.

Add the VITE_API_URL environment variable pointing to your live Render backend URL.

Deploy. The included vercel.json file will automatically handle React Router's SPA redirects.