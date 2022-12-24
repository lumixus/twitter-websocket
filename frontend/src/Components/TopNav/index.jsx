import React from 'react'
import TwitterChrips from '../SVGS/TwitterChrips'
import styles from "./TopNav.module.css"

const TopNav = () => {
  return (
    <div className={styles.topNav}>
        <div>
            <h5>Home</h5>
        </div>
        <div>
            <TwitterChrips />
        </div>
    </div>
  )
}

export default TopNav