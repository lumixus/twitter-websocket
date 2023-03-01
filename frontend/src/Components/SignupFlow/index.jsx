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
    const [showEmail, setShowEmail] = useState(true)
    const [currentUsername, setCurrentUsername] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [month, setMonth] = useState("")
    const [year, setYear] = useState("")
    const [day, setDay] = useState("")
    const [verifyToken, setVerifyToken] = useState("")
    const [currentPicture, setCurrentPicture] = useState("https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png");
    const [imageObject, setImageObject] = useState();


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const nextStep = (e) => {
        e.preventDefault()
        if(step < 5){
            console.log()
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
    
    const openFilePicker = () => {
        const picturePicker = document.getElementById("picturePicker");

        picturePicker.click();
       
    }

    const pictureChangeHandler = (e) => {
        setImageObject(e.target.files[0]);
        setCurrentPicture(URL.createObjectURL(e.target.files[0]));
    }

    const updateProfilePicture = async () => {
        try {
            const fd = new FormData();
            fd.append('file', imageObject);
            const {data} = await axios.post("http://localhost:8080/user/upload", fd, {withCredentials: true, headers: {
                'Content-Type': 'multipart/form-data'
            }})
            if(data.success === true){
                setStep(7);
            }
        } catch (error) {
            console.log(error);       
        }
    }

    const sendVerificationCode = async () => {
        setLoading(true);
        setError("");

        try {
            const {data} = await axios.post("http://localhost:8080/auth/verify", {verificationCode, email: email, phone: phone})

            if(data.success === true){
                setVerifyToken(data.verifyToken);
                setStep(5);
            }

        } catch (error) {
            console.log(error);            
        }


        setLoading(false);
    }

    const sendPassword = async () => {
        try {
            const {data} = await axios.post("http://localhost:8080/auth/finalonboarding", {password: password, verifyToken: verifyToken}, {withCredentials:true, credentials:"include"});
            
            if(data.success){
                setStep(6);
                setCurrentUsername(data.username);
            }
        } catch (error) {
            setError(error);
        }
    }

    const updateUsername = async () => {
        try {
            const {data} = await axios.post("http://localhost:8080/user/update", {username: currentUsername, verifyToken: verifyToken});
            
            if(data.success){
                window.location.reload();
            }
        } catch (error) {
            setError(error);
        }
    }

    const signUp = async (e) => {
        e.preventDefault();
        setError("");


        const user = {
            name,
            email: showEmail ? email : null,
            phone: showEmail === false ? phone : null,
            dateOfBirth: `${year}-${month < 10 ? "0"+month : month}-${day < 10 ? "0"+day : day}`
        }
        console.log(user);
        setLoading(true);
        try {
            const {data} = await axios.post("http://localhost:8080/auth/firstonboarding", user);
            console.log(data.success);


            if(data.success === true){
                setStep(4);
            }

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
        <input style={{width: "100%"}} className="loginInput" onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Name'/>
    </div>

    {showEmail ? 
    <div className={"pt-4 pb-4"}>
        <input style={{width: "100%"}} className="loginInput" onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder='Email'/>
    </div>
    : 
    <div className={"pt-4 pb-4"}>
        <input style={{width: "100%"}} className="loginInput" onChange={(e) => setPhone(e.target.value)} value={phone} type="phone" placeholder='Phone'/>
    </div>
    }

    <p onClick={() => setShowEmail(!showEmail)}>Signup with {showEmail ? "phone" : "email" }</p>



    <div>
        <select defaultValue={month} onChange={(e) => setMonth(e.target.value)}>
            <option value=""></option>
            
            {months.map((m, index) => <option key={index} value={index+1}>{m}</option>)}
        </select>

        <select defaultValue={day} onChange={(e) => setDay(e.target.value)}>
            <option value=""></option>
            {getNumberArray(1, 31).map((d, index) => <option key={index} value={index+1}>{d}</option>)}
        </select>

        <select defaultValue={year} onChange={(e) => setYear(e.target.value)}>
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

    {showEmail ? 

    <div className={"pt-4 pb-4"}>
        <input style={{width: "100%"}} onClick={(e) => setStep(1)} className="loginInput" defaultValue={email} type="text" placeholder='Email'/>
    </div>
    :
    <div className={"pt-4 pb-4"}>
        <input style={{width: "100%"}} onClick={(e) => setStep(1)} className="loginInput" defaultValue={phone} type="phone" placeholder='Phone'/>
    </div>
    }

    <div className={"pt-4 pb-4"}>
        <input style={{width: "100%"}} onClick={(e) => setStep(1)} className="loginInput" defaultValue={`${month > 0 ? months[month-1].substring(0,3) : null} ${day}, ${year}`} type="text" placeholder='Email'/>
    </div>

    <Button  className='mt-4' style={{width: "100%", height : "50px", borderRadius: "20px"}} variant='primary' onClick={(e) => signUp(e)}>{loading ? "Signing up..." : "Sign up"}</Button>
    {error ? <h5 style={{color:"red",fontWeight:"bold"}}>{error}</h5> : ""}
</div>


let fourthStep = <div className='p-4'>
    <h2>Activate your account!</h2>
    <p>We've sent verification code to your {showEmail ? "email" : "phone"} for activation! Please enter your verification code</p>
    <input onChange={(e) => setVerificationCode(e.target.value)} className='loginInput' type="text" placeholder='Verification code' />
    <Button
    className='mt-4 w-100'
    style={{width: "100%", height: "50px", borderRadius: "20px"}}
    variant='primary'
    onClick={(e) => sendVerificationCode()}>
        Send
    </Button>
</div>

let fifthStep = <div className='p-4'>
    <h2>Set your password</h2>
    <input onChange={(e) => setPassword(e.target.value)} className='loginInput' type="password" placeholder='Password' />
    <Button
    className='mt-4 w-100'
    style={{width: "100%", height: "50px", borderRadius: "20px"}}
    variant='primary'
    onClick={(e) => sendPassword()}>
        Submit
    </Button>
</div>


let sixthStep = <div className='p-4 d-flex flex-column justify-content-center'>
    <div style={{height: "200px", width: "200px"}}>
        <img style={{borderRadius: "50%", maxHeight: "100%", maxWidth: "100%"}} src={currentPicture} alt="Profile picture" />
    </div>
    <input onChange={(e) => pictureChangeHandler(e)} id="picturePicker" type="file" style={{display: "none"}} placeholder='Password' />
    <Button
    className='mt-4 w-100'
    style={{width: "100%", height: "50px", borderRadius: "20px"}}
    variant='primary'
    onClick={() => openFilePicker()}>
        Change Profile Picture
    </Button>
    <Button
    className='mt-4 w-100'
    style={{width: "100%", height: "50px", borderRadius: "20px"}}
    variant='primary'
    onClick={() => updateProfilePicture()}>
        Next
    </Button>
</div>

let seventhStep = <div className='p-4 d-flex flex-column justify-content-center'>

    <input onChange={(e) => setCurrentUsername(e.target.value)} className='loginInput' type="text" placeholder='Username' />
    <Button
    className='mt-4 w-100'
    style={{width: "100%", height: "50px", borderRadius: "20px"}}
    variant='primary'
    onClick={() => {}}>
        Cancel
    </Button>
    <Button
    className='mt-4 w-100'
    style={{width: "100%", height: "50px", borderRadius: "20px"}}
    variant='primary'
    onClick={() => updateUsername()}>
        Update
    </Button>
</div>

let CurrentStepElement = ""

let StepCount = step > 0 && step < 6 ? <>
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
        case 5:
            CurrentStepElement = fifthStep;
            break;
        case 6:
            CurrentStepElement = sixthStep;
            break;
        case 7:
            CurrentStepElement = seventhStep;
            break;

        default:
            CurrentStepElement = loginOptions;
    }



    return (<>
    {step !== 4 ? StepCount : null}
    {CurrentStepElement}
    </>)

}

export default SignupFlow