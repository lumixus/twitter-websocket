import React from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import {GoogleLogin} from '@react-oauth/google'
import AppleLogin from 'react-apple-login'
import TwitterIcon from '../../SVGS/TwitterIcon'
import styles from "./OnboardStyle.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AppleIcon from '../../SVGS/AppleIcon'


const Onboard = () => {
  return (
    <Container fluid>
      <Row>
        <Col className={[styles.leftWrapper, "d-flex align-items-center justify-content-center"]}>
          <TwitterIcon 
          style={{color:"white", 
          height: "50%",
          maxHeight:"380px", 
          fill:"currentColor"}} />

        </Col>

        <Col xs={12} md={6} className={styles.rightWrapper}>
          <div>
              <TwitterIcon 
              style={{color:"white", 
              height: "3rem",
              marginBottom: "70px",
              maxHeight:"380px", 
              fill:"currentColor"}} />

              <h1 className={styles.mainTitle}>Happening now</h1>
              <h4>Join Twitter today.</h4>

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
          </div>
        </Col>
      </Row>

    </Container>
  )
}

export default Onboard