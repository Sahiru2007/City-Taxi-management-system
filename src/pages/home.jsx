import React from 'react'
import GetInTouch from '../components/GetInTouch';
import GetStarted from '../components/GetStarted';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer/Footer'
const Home = () => {
  return (
    <>
     <Navbar />
    <Header/>
    <GetStarted />
    <GetInTouch />
    <Footer />
    </>

  )
}

export default Home