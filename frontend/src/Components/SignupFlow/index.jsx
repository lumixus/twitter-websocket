import React from 'react'
import { GoogleLogin } from '@react-oauth/google';
import AppleLogin from 'react-apple-login';
import { Button } from 'react-bootstrap';
import AppleIcon from '../SVGS/AppleIcon';
import axios from "axios";
import months, { getNumberArray } from '../../Constants/Dates';
import styles from './SignupFlow.module.css'
import { useState } from 'react';

const SignupFlow = () => {

    const [step, setStep] = useState(0)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [month, setMonth] = useState("")
    const [year, setYear] = useState("")
    const [day, setDay] = useState("")


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const nextStep = (e) => {
        e.preventDefault()
        if(step < 5){
            let next = step + 1;
            setStep(next)
        }
    }

    const prevStep = (e) => {
        e.preventDefault();
        if(step > 0){
            setStep(step - 1);
        }
    }

    const signUp = async (e) => {
        e.preventDefault();
        setError("");


        const user = {
            firstName: name,
            lastName: "test",
            email,
            password,
            dateOfBirth: `${year}-${day < 10 ? "0"+day : day}-${month < 10 ? "0"+month : month}`
        }

        setLoading(true);
        try {
            const {data} = await axios.post("http://localhost:8080/auth/register", user);
            console.log(data);
        } catch (error) {
            if(error.response && error.response.data){
                setError(error.response.data.message)
            }
        }

        setLoading(false);



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


let firstStep = <div style={{width : "100%", padding : "0px 60px"}}>
    <h2>Create your account</h2>
    <div className={"pt-4"}>
        <input style={{width: "100%"}} className="loginInput" onChange={(e) => setName(e.target.value)} type="text" placeholder='Name'/>
    </div>

    <div className={"pt-4 pb-4"}>
        <input style={{width: "100%"}} className="loginInput" onChange={(e) => setEmail(e.target.value)} type="text" placeholder='Email'/>
    </div>

    <div className={"pt-4 pb-4"}>
        <input style={{width: "100%"}} className="loginInput" onChange={(e) => setPassword(e.target.value)} type="password" placeholder='Password'/>
    </div>

    <div>
        <select onChange={(e) => setMonth(e.target.value)}>
            <option value=""></option>
            {months.map((m, index) => <option key={index} value={index+1}>{m}</option>)}
        </select>

        <select onChange={(e) => setDay(e.target.value)}>
            <option value=""></option>
            {getNumberArray(1, 31).map((d, index) => <option key={index} value={index+1}>{d}</option>)}
        </select>

        <select onChange={(e) => setYear(e.target.value)}>
            <option value=""></option>
            {getNumberArray(new Date().getFullYear() - 123, new Date().getFullYear() ).map((y, index) => <option key={index} value={y}>{y}</option>)}
        </select>
    </div>
    <Button style={{width: "100%", height : "50px", borderRadius: "20px"}} variant='light' onClick={(e) => nextStep(e)}>Next</Button>
</div>

let secondStep = <div style={{width : "100%", padding : "0px 60px"}}>
    <h2 >Customize your experience</h2>
    <h5 className="mt-4">Track where you see Twitter content across the web</h5>
    <div className='d-flex flex-row'>
        <p>
        Twitter uses this data to personalize your experience. This web browsing history will never be stored with your name, email, or phone number.
        </p>
        <span><input style={{height:"18px", width:"18px"}} type="checkbox"/></span>
    </div>

    <small style={{color:"gray"}}>
    By signing up, you agree to our Terms, Privacy Policy, and Cookie Use. Twitter may use your contact information, including your email address and phone number for purposes outlined in our Privacy Policy. Learn more
    </small>

    <Button  className='mt-4' style={{width: "100%", height : "50px", borderRadius: "20px"}} variant='light' onClick={(e) => nextStep(e)}>Next</Button>
</div>


let thirdStep = <div style={{width : "100%", padding : "0px 60px"}}>
    <h2>Create your account</h2>
    <div className={"pt-4"}>
        <input style={{width: "100%"}} onClick={(e) => setStep(1)} className="loginInput" defaultValue={name} type="text" placeholder='Name'/>
    </div>

    <div className={"pt-4 pb-4"}>
        <input style={{width: "100%"}} onClick={(e) => setStep(1)} className="loginInput" defaultValue={email} type="text" placeholder='Email'/>
    </div>

    <div className={"pt-4 pb-4"}>
        <input style={{width: "100%"}} onClick={(e) => setStep(1)} className="loginInput" defaultValue={`${month > 0 ? months[month-1].substring(0,3) : null} ${day}, ${year}`} type="text" placeholder='Email'/>
    </div>

    <Button  className='mt-4' style={{width: "100%", height : "50px", borderRadius: "20px"}} variant='primary' onClick={(e) => signUp(e)}>{loading ? "Signing up..." : "Sign up"}</Button>
    {error ? <h5 style={{color:"red",fontWeight:"bold"}}>{error}</h5> : ""}
</div>


let fourthStep = <div>
    <h2>Activate your account!</h2>
    <p>We've sent an email for activation! Please activate your account</p>
</div>

let CurrentStepElement = ""

let StepCount = step > 0 ? <>
<p onClick={prevStep} style={{position: "absolute", top:"10px", right: "10px"}}>Back</p>
<h5 style={{position: "absolute", top: "10px", left : "70px"}}>Step {step} of 5</h5>

</> : null;


    switch (step) {
        case 0:
            CurrentStepElement = loginOptions;
            break;
        case 1:
            CurrentStepElement = firstStep;
            break;
        case 2:
            CurrentStepElement = secondStep;
            break;
        case 3:
            CurrentStepElement = thirdStep;
            break;
        case 4:
            CurrentStepElement = fourthStep;
        break;

    
        default:
            CurrentStepElement = loginOptions;
    }



    return (<>
    {StepCount}
    {CurrentStepElement}
    </>)

}

export default SignupFlow