import './App.css';
import React from 'react'
import LeftBar from './Components/LeftBar';
import RightBar from './Components/RightBar';
import TopNav from './Components/TopNav';

const App = ({element}) => {
  return (
    <>
    <div className='wrapper'>
    <LeftBar/>
    <div className="mainWrapper">
      <TopNav />
      {element}
    </div>

    <RightBar />
      </div>
    </>
  )
}

export default App

