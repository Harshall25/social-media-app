import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {NavBar} from './components/NavBar'
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { NewPost } from './pages/NewPost';
import { Signup } from './pages/Signup';
import { Feed } from './pages/Feed';
import { Home } from './pages/Home';
function App() {
  return (
    <div>
    
        <NavBar />
        <Routes>
          <Route path='/landing' element={<Landing />} ></Route>
          <Route path='/home' element={<Home />} ></Route>
          <Route path='/feed' element={<Feed />} ></Route>
          <Route path='/login' element={<Login />} ></Route>
          <Route path='/newpost' element={<NewPost />} ></Route>

        </Routes>
      
    </div>
  );
}
export default App
