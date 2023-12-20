import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FeedbackList from './components/FeedbackList';
import Nav from './components/Nav';
import "./App.css";

function App() {
  return (
    <div className='container'>
      <Router>
        <Nav />
        <Routes>
          <Route path="/department/:id" element={<FeedbackList />} />
          <Route path="/" element={<FeedbackList />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
