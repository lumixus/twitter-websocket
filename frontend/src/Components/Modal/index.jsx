import React from 'react'
import styles from './Modal.module.css'
import TwitterIcon from '../SVGS/TwitterIcon'

const Modal = ({children, closeModal, title = "Modal Title", isModalOpened = false}) => {



  return (
    <div style={isModalOpened ? {display:'flex'} : {display:'none'}} className={styles.modalWrapper}>
        <div className={styles.modal}>
            <div onClick={closeModal} className={styles.closeButton}>
                X
            </div>
            <div style={{textAlign: "center", paddingTop: "10px"}}>
                <TwitterIcon style={{color:"white", fill : "currentColor", height: "36px"}} />
            </div>
            <div className={styles.modalHeader}>

                <h3>
                    {title}
                </h3>

            </div>

            <div className={styles.modalContent}>
                {children}
            </div>

        </div>

    </div>
  )
}

export default Modal