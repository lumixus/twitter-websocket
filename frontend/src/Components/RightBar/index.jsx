import React from 'react'
import SearchNav from '../SearchNav'
import styles from "./RightBar.module.css"

const RightBar = () => {
  return (
    <div className={styles.rightBar}>
        <SearchNav />
        RightBar
    </div>
  )
}

export default RightBar