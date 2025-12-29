import React from 'react'
import styles from "./styles.module.css"
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux';
import { reset } from '@/config/redux/reducer/authReducer';

function Navbar() {
    
    const router = useRouter();

    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth);

  return (
    <div className={styles.container}>
       
        <nav className={styles.navbar}>

            <h1 onClick={() => {
                    router.push("/")
                }}><img src="/images/netwiselogo.png" alt="logo" /></h1>

            <div className={styles.navbarOptionContainer}>


            { authState.profileFetched  && <div>
                <div style={{display:"flex", gap:"1.25rem"}}>
                    <p>Hey, {authState.user.userId.name}</p>
                    <p style={{fontWeight:"bold", cursor:"pointer"}}>Profile</p>

                    <p style={{cursor:"pointer"}} onClick={() => {
                        localStorage.removeItem("token");
                        dispatch(reset());
                        router.push("/login");
                    }}>Logout</p>

                </div>
            </div> }


            { !authState.profileFetched  && <div className={styles.buttonJoin} onClick={() => router.push("/login")}>Be a part</div> }

            </div>

        </nav>

    </div>
  )
}

export default Navbar
