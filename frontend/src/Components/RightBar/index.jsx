import React from 'react'
import { useSelector } from 'react-redux'
import Box from '../Box'
import Footer from '../Footer'
import LoginFlow from '../LoginFlow'
import SearchNav from '../SearchNav'
import styles from "./RightBar.module.css"

const RightBar = () => {

  const userState = useSelector((state) => state.user)


  return (
    <div className={styles.rightBar}>
        <SearchNav />
        <div className={styles.rightBarContent}>
        {Object.keys(userState).length === 0 ?
        <Box description='Sign up now to get your own personalized timeline!'>
        <LoginFlow />
        </Box>
        :
        "RightBar"
      }


      <Footer />

      </div>
    </div>
  )
}

export default RightBar