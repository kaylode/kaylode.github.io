import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ModernHome from "./components/modern-home";
import NavBar from "./components/navbar";
import PublicationsPage from './components/PublicationsPage'
import ProjectsPage from './components/ProjectsPage'
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
              <Footer />
            </>
          } />
          <Route path="/publications" element={
            <>
              <PublicationsPage />
              <Footer />
            </>
          } />
          <Route path="/projects" element={
            <>
              <ProjectsPage />
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
