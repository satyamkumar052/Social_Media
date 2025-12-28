import React from 'react'
import styles from "./styles.module.css"
import { useRouter } from 'next/router'

function Navbar() {
    
    const router = useRouter();

  return (
    <div className={styles.container}>
       
        <nav className={styles.navbar}>

            <h1 onClick={() => {
                    router.push("/")
                }}><img src="/images/netwiselogo.png" alt="logo" /></h1>

            <div className={styles.navbarOptionContainer}>

                <div className={styles.buttonJoin} onClick={() => {
                    router.push("/login")
                }}>Be a part</div>

            </div>

        </nav>

    </div>
  )
}

export default Navbar
