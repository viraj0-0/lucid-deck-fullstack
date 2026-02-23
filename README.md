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