import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import {GoogleLogin} from '@react-oauth/google'
import AppleLogin from 'react-apple-login'
import TwitterIcon from '../../SVGS/TwitterIcon'
import styles from "./OnboardStyle.module.css"

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

        <Col className={styles.rightWrapper}>
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
              designProp={{height:40, width: 300, color:"white", type:"sign-in"}}
              clientId="com.react.apple.login" 
              redirectURI="https://redirectUrl.com" />
          </div>
        </Col>
      </Row>

    </Container>
  )
}

export default Onboard