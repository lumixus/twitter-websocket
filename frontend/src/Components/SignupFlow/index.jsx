import { GoogleLogin } from '@react-oauth/google';
import React from 'react'
import AppleLogin from 'react-apple-login';
import { Button } from 'react-bootstrap';
import AppleIcon from '../SVGS/AppleIcon';
import styles from './SignupFlow.module.css'
import { useState } from 'react';

const SignupFlow = () => {

    const [step, setStep] = useState(0)

    const nextStep = (e) => {
        e.preventDefault()
        if(step < 5){
            let next = step + 1;
            setStep(next)
        }
    }


    const loginOptions =  <div>
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

<div className={styles.nextButton}>
<Button onClick={(e) => setStep(1)} variant='light'>Sign up with phone or email</Button>
</div>
</div>


let firstStep = <div>
    <h2>First Step</h2>
    <Button onClick={(e) => nextStep(e)}>Next</Button>
</div>

let secondStep = <div>
    <h2>Second Step</h2>
    <Button onClick={(e) => nextStep(e)}>Next</Button>
</div>


let thirdStep = <div>
    <h2>Third Step</h2>
    <Button onClick={(e) => nextStep(e)}>Next</Button>
</div>


    switch (step) {
        case 0:
            return loginOptions;
        case 1:
            return firstStep;
        case 2:
            return secondStep;
        case 3:
            return thirdStep;

    
        default:
            return loginOptions;
    }



}

export default SignupFlow