import { GoogleLogin } from '@react-oauth/google';
import React from 'react'
import AppleLogin from 'react-apple-login';
import { Button } from 'react-bootstrap';
import AppleIcon from '../SVGS/AppleIcon';

const OnboardFlow = ({withInput = false}) => {
  return (
    <>
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
              <Button style={{width:"300px"}}>
                Signup with email or phone
              </Button>

              <div>

              <Button style={{width:"300px", marginTop:"20px"}} variant='light'>
                Login
              </Button>
              </div>

    </>
  )
}

export default OnboardFlow