import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getUser } from '../Store/Actions/userActions';


const Auth = ({children}) => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUser());
    }, [])

  return children;
}

export default Auth