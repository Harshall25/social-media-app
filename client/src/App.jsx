import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Landing } from "./pages"
import { NavBar } from './components/NavBar';
function App() {
  return (
    <div>
      <Router>
        <NavBar />
        <Routes>
          <Route path='/' element={<Landing />} ></Route>
        </Routes>
      </Router>
    </div>
  );
}
export default App
