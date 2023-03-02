import React from 'react'
import styles from './LoginFlow.module.css'
import AppleLogin from 'react-apple-login';
import { GoogleLogin } from '@react-oauth/google';
import { Button } from 'react-bootstrap';
import AppleIcon from '../SVGS/AppleIcon';
import { useState } from 'react';
import axios from 'axios';
import {setUser} from "../../Store";

const LoginFlow = () => {

    const [key, setKey] = useState('')
    const [password, setPassword] = useState('')
    const [step, setStep] = useState(0)

    let currentElement = null;

    const login = async () => {
      const {data} = await axios.post("http://localhost:8080/auth/login", 
      {key: key, password: password},
      {withCredentials: true})

      if(data.success === true){
        setUser(data.user);
      }
    }

    const mainLoginModal = <div>
    <GoogleLogin width={300}
        onSuccess={credentialResponse => {
          console.log(credentialResponse);
        }}
        onError={() => {
          console.log('Login Failed');
        }}
        useOneTap={false}
      />

      <AppleLogin
      render={ renderProps => (
        <Button style={{backgroundColor:"white", 
        color: "black", 
        border: "none",
        height: "40px",
        marginTop : "10px",
        fontWeight: "500",
        fontFamily:"Open Sans", 
        minWidth:"300px",
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        textAlign:"center",
        alignItems:"center",
        fontSize:"14px"}}>
          <AppleIcon styles={{height:"24px",width:"18px",marginRight:"8px"}} />
          <div style={{textAlign:"center",width:"100%"}}>Continue with Apple</div>
           
        </Button>
      )}
      clientId="com.react.apple.login" 
      redirectURI="https://redirectUrl.com" />

      <div style={{display:"flex",
      flexDirection:"row",
      justifyContent:"space-between",
      width:"300px", 
      alignItems:"center"}}>
        <hr width="120px" />
        Or
        <hr width="120px" />
      </div>
      <input className="loginInput" onChange={(e) => setKey(e.target.value)} type="text" placeholder='Phone, e-mail or username'/>

      <div className={styles.nextButton}>
        <Button variant='light' onClick={(e) => setStep(1)}>Next</Button>
      </div>

      <div className={styles.forgotButton}>
        <Button>Forgot Password?</Button>
      </div>

</div>

const basicLoginModal = <div>
<div style={{display:"flex",
flexDirection:"row",
justifyContent:"space-between",
width:"300px", 
alignItems:"center"}}>
</div>
<input className="loginInput" onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Password'/>

<div className={styles.nextButton}>
  <Button variant='light' onClick={(e) => login()}>Login</Button>
</div>

<div className={styles.forgotButton}>
  <Button>Forgot Password?</Button>
</div>
</div>


switch (step) {
  case 0:
    currentElement = mainLoginModal;
    break;
  case 1:
    currentElement = basicLoginModal;
    break;

  default:
    currentElement = mainLoginModal;
    break;
}



  return <>{currentElement}</>
}

export default LoginFlow