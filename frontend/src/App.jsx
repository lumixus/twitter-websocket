import './App.css';
import React from 'react'
import LeftBar from './Components/LeftBar';
import RightBar from './Components/RightBar';
import TopNav from './Components/TopNav';
import Modal from './Components/Modal'
import { useSelector } from 'react-redux';
import NotifyBanner from './Components/NotifyBanner';
import { useState } from 'react';
import LoginFlow from './Components/LoginFlow';
import SignupFlow from './Components/SignupFlow';

const App = ({element}) => {

  const userState = useSelector((state) => state.user)

  const [isLoginModalOpened, setIsLoginModalOpened] = useState(false)
  const [isSignupModalOpened, setIsSignupModalOpened] = useState(false)

  const openSignupModal = () => {
    setIsSignupModalOpened(true)
  }

  const closeSignupModal = () => {
    setIsSignupModalOpened(false)
  }



  const openLoginModal = () => {

    setIsLoginModalOpened(true)

  }

  const closeLoginModal = () => {
    setIsLoginModalOpened(false)
  }



  return (
    <>
    <Modal isModalOpened={isLoginModalOpened} closeModal={closeLoginModal} title='Sign in to Twitter'>
      <LoginFlow />
    </Modal>
    <Modal isModalOpened={isSignupModalOpened} closeModal={closeSignupModal} title='Join Twitter today'>
      <SignupFlow />
    </Modal>
    <div className='wrapper'>
    <LeftBar/>
    <div className="mainWrapper">
      <TopNav />
      {element}
    </div>

    <RightBar />
      </div>


    {Object.keys(userState).length > 0 ? null : <NotifyBanner loginButtonEvent={openLoginModal} signUpButtonEvent={openSignupModal} />}
    </>
  )
}

export default App

