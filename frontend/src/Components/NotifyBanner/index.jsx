import React from 'react'
import styles from './NotifyBanner.module.css'
import { Button, Col, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'

const NotifyBanner = ({loginButtonEvent = () => {}, signUpButtonEvent = () => {}}) => {


const user = useSelector(state => state.user);


  return Object.keys(user.user).length <= 0 ? (
    <div className={styles.notifyBanner}>
        <Row>
            <Col md={8} className={styles.infoText}>
                <h4>Don't miss what's happening</h4>
                <p>People on Twitter are the first to know.</p>
            </Col>
            <Col md={4} className={[styles.buttons, 'd-flex flex-row align-items-center justify-content-end']}>
                <Button onClick={loginButtonEvent} style={{backgroundColor : "rgba(0, 0, 0, 0)"}}>Log in</Button>
                <Button onClick={signUpButtonEvent} variant='light' style={{fontWeight: "bold"}}>Sign up</Button>
            </Col>
        </Row>
    </div>
  ) : null
}

export default NotifyBanner