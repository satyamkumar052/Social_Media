import UserLayout from '@/layout/UserLayout';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from "./style.module.css";
import { loginUser, registerUser } from '@/config/redux/action/authAction';
import { emptyMessage } from '@/config/redux/reducer/authReducer';


function login() {

    const authState = useSelector((state) => state.auth)

    const [userLoginMethod, setUserLoginMethod] = useState(false);

    const router = useRouter();

    const dispatch = useDispatch();


    const [email, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");

    useEffect(() => {   // checks if user already loggedin then we send it to dashboard
        if(authState.LoggedIn) {
            router.push("/dashboard");
        }
    }, [authState.LoggedIn] )

    useEffect(() => {
        dispatch(emptyMessage());
    }, [userLoginMethod])

    
    const handlelogin = () => {
        console.log("login...");
        dispatch(loginUser({ email, password }));
    }


    const handleRegister = () => {
        console.log("registering...");
        dispatch(registerUser({ username, password, email, name }));
    }


    return (
        <UserLayout>

            <div className={`${styles.container}`}>
            
            <div className={styles.cardContainer}>

                <div className={styles.cardContainer_left}>
                    <p className={styles.cardleft_heading}> {userLoginMethod ? "Sign In" : "Sign Up"} </p>
                    <p style={{color : authState.isError ? "red" : "green"}}>{authState.message.message}</p>

                    <div className={styles.inputContainers}>

                        { !userLoginMethod && <div className={styles.inputRow}>
                            <input onChange={(e) => setUsername(e.target.value)} className={styles.inputField} type="text" placeholder='Username' />
                            <input onChange={(e) => setName(e.target.value)} className={styles.inputField} type="text" placeholder='Name' />
                        </div>}

                        <input onChange={(e) => setEmailAddress(e.target.value)} className={styles.inputField} type="text" placeholder='Email' />
                        <input onChange={(e) => setPassword(e.target.value)} className={styles.inputField} type="text" placeholder='Password' />
                        <div onClick={() => {
                            if(userLoginMethod) {
                                handlelogin();
                            } else {
                                handleRegister();
                            }
                        }} className={styles.buttonWithOutline}>Submit</div>
                    </div>

                </div>

                <div className={styles.cardContainer_right}>
                        { userLoginMethod ? <p>Don't have an Account?</p> : <p>Already have an Account?</p> }
                        
                        <div onClick={() => {
                            setUserLoginMethod(!userLoginMethod)
                        }} style={{maxWidth:"15rem", color:"#000", backgroundColor:"snow"}} className={styles.buttonWithOutline}>
                            {userLoginMethod ? "Sign Up" : "Sign In"}
                        </div>

                </div>

            </div>
            </div>
        </UserLayout>
    );
}

export default login;
