import styles from './Box.module.css'


import React from 'react'

const Box = ({children, title = "New to twitter?", description = "Lorem Ipsum"}) => {
  return (
    <div className={styles.boxWrapper}>
        <h4>{title}</h4>
        <div style={{color:"gray", marginBottom :"10px"}}>
            <small>{description}</small>
        </div>
        {children}


    </div>
  )
}

export default Box