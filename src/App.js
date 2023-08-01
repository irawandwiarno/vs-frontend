import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Nota from "./pages/nota";
import Navbar from "./components/navbar";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nota" element={<Nota />} />
      </Routes>
    </Router>
  );
};

export default App;
