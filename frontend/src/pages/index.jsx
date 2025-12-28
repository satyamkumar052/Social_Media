import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import { Poppins } from "next/font/google";
import UserLayout from "@/layout/UserLayout";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});


export default function Home() {

    
    const router = useRouter();
    

  return (
    <UserLayout>
      
      <div className={`${styles.container} ${poppins.className}`}>

        <div className={styles.maincontainer}>

          <div className={styles.mainContainer_left}>
            
            <p>Connect with friends without Exaggeration</p>

            <p>A True Social Media platform, with stories no blufs!</p>

            <div className={styles.buttonJoin} onClick={() =>{
                router.push("/login")
            }}>
                Join Now
            </div>

          </div>

          <div className={styles.mainContainer_right}>
            <img src="images/connections.jpg" alt="connection" />
          </div>

        </div>

      </div>

    </UserLayout>
  );
}
