import './App.css';

import React from 'react'
import { Link } from 'react-router-dom';

const App = () => {
  return (
    <div>

      <Link className='btn btn-primary' to={"/login"}>Login</Link>
    </div>
  )
}

export default App

