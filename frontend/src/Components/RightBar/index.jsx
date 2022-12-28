import React from 'react'
import { useSelector } from 'react-redux'
import Box from '../Box'
import Footer from '../Footer'
import SearchNav from '../SearchNav'
import styles from "./RightBar.module.css"
import OnboardFlow from '../OnboardFlow'

const RightBar = () => {

  const userState = useSelector((state) => state.user)


  return (
    <div className={styles.rightBar}>
        <SearchNav />
        <div className={styles.rightBarContent}>
        {Object.keys(userState).length === 0 ?
        <Box description='Sign up now to get your own personalized timeline!'>
        <OnboardFlow />
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