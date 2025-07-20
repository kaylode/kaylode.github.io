import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ModernHome from "./components/modern-home-fixed";
import NavBar from "./components/navbar";
import Techstack from './components/techstack'
import Projects from './components/projects'
import PublicationsPage from './components/PublicationsPage'
import Footer from "./components/footer";

function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={
            <>
              <ModernHome />
              <Techstack />
              <Projects />
              <Footer />
            </>
          } />
          <Route path="/publications" element={
            <>
              <PublicationsPage />
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
