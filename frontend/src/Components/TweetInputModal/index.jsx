import React from 'react'
import styles from './tweetInputModal.module.css'
import TweetInput from '../TweetInput'
import { useState } from 'react'
import { Button } from 'react-bootstrap'


const TweetInputModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
    }

    const handleClose = () => {
        setIsOpen(false)
    }

    console.log(styles.backgroundOverlay);

  return (
    <>
        <Button onClick={handleOpen} style={{borderRadius:"20px", padding: "10px", fontSize:"20px", marginTop:"20px"}}>
            Tweet
        </Button>
    {isOpen ? 
    <div className={styles.backgroundOverlay}>
        <div className={styles.tweetInputWrapper}>
            <div onClick={handleClose} className={styles.closeIcon}>X</div>
            <TweetInput />
        </div>
        <div onClick={handleClose} className={styles.handleCloseArea}></div>
    </div>
: ''}
</>
  )
}

export default TweetInputModal