import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";


export default function Home() {

    
    const router = useRouter();
    

  return (
    <>
      
      <div className="container">

        <div className="mainContainer">

          <div className="mainContainer-left">
            
            <p>Connect with friends without Exaggeration</p>

            <p>A True Social Media platform, with stories no blufs!</p>

            <div className="buttonJoin" onClick={() =>{
                router.push("/login")
            }}>
                <p>Join Now</p>
            </div>
                                                
          </div>

          <div className="mainContainer-right">
            <img src="images/connections.jpg" alt="connection" />
          </div>

        </div>

      </div>

    </>
  );
}
