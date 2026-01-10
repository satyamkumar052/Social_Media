import React, { useEffect } from 'react';
import styles from "./index.module.css";
import { useRouter } from 'next/router';
import { setTokenIsThere } from '@/config/redux/reducer/authReducer';
import { useDispatch, useSelector } from 'react-redux';


function DashboardLayout({children}) {

    const authState = useSelector((state) => state.auth)

    const router = useRouter();

    const dispatch = useDispatch();

    useEffect(() => {
        if(localStorage.getItem("token") === null ) {
            router.push("/login")
        }
        dispatch(setTokenIsThere());
    },[])

    return (

        <div className="container">
            
            <div className={styles.homeContainer}>

                <div className={styles.homeContainer_leftBar}>

                    <div onClick={()=>router.push("/dashboard")} className={styles.sidebarOption}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>

                        <p>Scroll</p>
                    </div>
                    <div onClick={()=>router.push("/discover")} className={styles.sidebarOption}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                        <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
                        </svg>

                        <p>Discover</p>
                    </div>
                    <div onClick={()=>router.push("/my_connections")} className={styles.sidebarOption}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>

                        <p>My Connections</p>
                    </div>


                </div>

                <div className={styles.homeContainer_feedContainer}>

                    {children}

                </div>

                <div className={styles.homeContainer_extraContainer}>
                    <h3>Top Profiles</h3>

                    {authState.all_profiles_fetched && authState.all_users.map((profile, index) => {
                        // profile.userId.name
                        return (
                            <div key={profile._id}>
                                <div>
                                    <p style={{padding:"1rem"}}>{profile.userId?.name}</p>
                                </div><hr />
                            </div>
                        )

                    })}

                </div>

            </div>

            

        </div>

    );
}

export default DashboardLayout;