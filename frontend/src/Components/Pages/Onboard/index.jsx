import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import TwitterIcon from '../../SVGS/TwitterIcon'
import styles from "./OnboardStyle.module.css"
import LoginFlow from '../../LoginFlow'


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
              <LoginFlow />
              

          </div>
        </Col>
      </Row>

    </Container>
  )
}

export default Onboard