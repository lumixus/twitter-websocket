import React from 'react'
import styles from './Footer.module.css'
import moment from 'moment'

const Footer = () => {
  return (
    <footer className={styles.footer}>
        &copy; {moment().year()} Twitter Clone, Inc.
    </footer>
  )
}

export default Footer