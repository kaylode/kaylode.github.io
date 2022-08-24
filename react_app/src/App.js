import Home from "./components/home";
import NavBar from "./components/navbar";
import Techstack from './components/techstack'
// import Achievements from './components/achievements'
// import Topics from './components/topics'
// import Reference from './components/reference'
import Projects from './components/projects'
import Publications from './components/publications'
import Footer from "./components/footer";

function App() {
  return (
    <div>
      <NavBar />
      <Home />
      <Techstack />
      <Publications />
      <Projects /> 
      <Footer />
    </div>
  );
}

export default App;
