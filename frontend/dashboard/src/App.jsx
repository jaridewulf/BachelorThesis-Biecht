import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Feedback from './components/Feedback'
import FeedbackList from './components/FeedbackList'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <FeedbackList />
    </>
  )
}

export default App
