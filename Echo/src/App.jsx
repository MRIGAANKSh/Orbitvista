import { useState } from 'react'

import './App.css'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import MidPart from './components/MidPart'
import Video from './components/Video'
import Footer from './components/Fotter'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header/>
      <HeroSection/>
      <MidPart/>
      <Video/>
      <Footer/>
    </>
  )
}

export default App
