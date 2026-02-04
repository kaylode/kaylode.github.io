# Academic Portfolio Pro

A modern, dynamic, and professional academic portfolio template designed for researchers, professors, and PhD students. Built with **React**, **Vite**, **Tailwind CSS**, and **Google Gemini AI**.

<div align="center">
  <img width="1200" height="475" alt="Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## ✨ Features

-   **🎨 Personal Branding**: Clean, responsive design with dark mode support.
-   **📚 Academia**: Showcase publications, education, and certificates.
-   **💼 Experiences**: Highlight industry roles, internships, and personal projects.
-   **📊 Tracking**: Keep track of daily habits like LeetCode, GitHub commits, and reading goals.
-   **📝 Blog**: Share thoughts and articles with a beautiful reading experience.
-   **🤖 AI Assistant**: Integrated Gemini AI chatbot to answer visitor questions about your work.

## 🛠️ Tech Stack

-   **Frontend**: React 19, Vite, TypeScript
-   **Styling**: Tailwind CSS, Lucide React (Icons)
-   **AI Integration**: Google Gemini API (`@google/genai`)
-   **Animation**: Native CSS animations for smooth transitions

## 🚀 Getting Started

### Prerequisites

-   **Node.js** (v18 or higher)
-   **Python** (v3.8 or higher)
-   **uv** (Python package manager) - [Install uv](https://github.com/astral-sh/uv)

### 1. Backend Setup

The backend handles the API and database connections.

```bash
cd backend
# This script ensures uv syncs dependencies and starts the server
chmod +x start_backend.sh
./start_backend.sh
```

The API runs at `http://localhost:8000`.

### 2. Frontend Setup

The frontend is the React application.

```bash
cd frontend
npm install
# Ensure .env.local exists in frontend/ with your keys
npm run dev
```
 
The app runs at `http://localhost:5173`.

## 📁 Project Structure

```
academic-portfolio-pro/
├── src/
│   ├── components/       # UI Components (Sidebar, Timeline, AI Assistant, etc.)
│   ├── constants.ts      # Data file to customize your portfolio content
│   ├── types.ts          # TypeScript interfaces
│   ├── App.tsx           # Main application component
│   └── index.css         # Global styles and Tailwind imports
├── public/               # Static assets
└── ...config files
```

## ⚙️ Customization

To personalize the portfolio with your own data:

1.  Open `src/constants.ts`.
2.  Update the objects for `PROFILE_DATA`, `ACADEMIA_DATA`, `EXPERIENCES_DATA`, `BLOG_POSTS`, etc.
3.  Changes will reflect instantly in the app.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).