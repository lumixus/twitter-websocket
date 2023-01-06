import React from 'react'
import styles from './LoginFlow.module.css'
import AppleLogin from 'react-apple-login';
import { GoogleLogin } from '@react-oauth/google';
import { Button } from 'react-bootstrap';
import AppleIcon from '../SVGS/AppleIcon';
import { useState } from 'react';

const LoginFlow = () => {

    const [id, setId] = useState('')




  return (
    <div>
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
              <input className="loginInput" onChange={(e) => setId(e)} type="text" placeholder='Phone, e-mail or username'/>

              <div className={styles.nextButton}>
                <Button variant='light'>Next</Button>
              </div>

              <div className={styles.forgotButton}>
                <Button>Forgot Password?</Button>
              </div>

    </div>
  )
}

export default LoginFlow