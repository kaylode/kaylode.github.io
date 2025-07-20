import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ModernHome from "./components/modern-home";
import NavBar from "./components/navbar";
import PublicationsPage from './components/PublicationsPage'
import ProjectsPage from './components/ProjectsPage'
import ExperiencesPage from './components/ExperiencesPage'
import BlogPage from './components/BlogPage'
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
          <Route path="/experiences" element={
            <>
              <ExperiencesPage />
              <Footer />
            </>
          } />
          <Route path="/blog" element={
            <>
              <BlogPage />
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
