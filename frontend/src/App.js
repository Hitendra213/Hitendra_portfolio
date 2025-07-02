import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Project from './components/Project';
import Skill from './components/Skill';
import Blog from './components/Blog';
import Certificate from './components/Certificate';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './App.css';

const App = () => {
  return (
    <div className="app">
      <Helmet>
        <title>Hitendrasinh Matroja | Full Stack Developer Portfolio</title>
        <meta name="description" content="Portfolio of Hitendrasinh Matroja, showcasing MERN stack, Django, and Flutter projects." />
        <meta name="keywords" content="full stack developer, MERN stack, Django, Flutter, web development, portfolio" />
        <meta property="og:url" content="https://hitendrasinhmatroja.vercel.app" />
      </Helmet>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/project" element={<Project />} />
          <Route path="/skill" element={<Skill />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/certificate" element={<Certificate />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;