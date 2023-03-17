import React from 'react'
import styles from './profileSection.module.css'
import { useSelector } from 'react-redux'
import { Button } from 'react-bootstrap';
import moment from 'moment';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ProfileSection = () => {

    const userState = useSelector(state => state.user);
    const profileState = useSelector(state => state.profile);

    const {user} = userState;

    return (
    <div className={styles.profileSectionWrapper}>
        <div className={styles.profileBanner}></div>
        <div className={styles.profileInfoSection}>
            <div className={styles.profileInfoUpper}>
                <div className={styles.profilePictureWrapper}>
                    <img src={`http://localhost:8080/uploads/${user.profilePicture}`} alt="" />
                </div>
                <div>
                    <Button>Set up profile</Button>
                </div>
            </div>

            <div>
                <h4 style={{marginBottom: "0"}}>{user.name}</h4>
                <small style={{color: "gray", fontSize: "1rem"}}>@{user.username}</small>
                <div className='mt-4'>
                    <FontAwesomeIcon style={{color: "gray"}} icon={faCalendarAlt} /> <small style={{color: "gray", fontSize: "1rem"}}>Joined {moment(profileState.user.createdAt).format('MMM YYYY')}</small>
                </div>
            </div>
        </div>
    </div>
    )
}

export default ProfileSection