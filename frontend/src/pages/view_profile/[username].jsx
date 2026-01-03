import { BASE_URL, clientServer } from '@/config';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import styles from "./index.module.css";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import { getConnectionRequest, sendConnectionRequest } from '@/config/redux/action/authAction';


function ViewProfilePage({userProfile}) {

    const searchParams = useSearchParams();

    const router = useRouter();
    const postReducer = useSelector((state) => state.posts);
    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth);

    const [userPosts, setUserPosts] = useState([]);

    const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false);

    const [isConnectionNull, setIsConnectionNull] = useState(true);


    const getUsersPost = async () => {
        await dispatch(getAllPosts());      // to show recent activity
        await dispatch(getConnectionRequest({token:localStorage.getItem("token")}));      // to show text on button (connect or connected)
    }

    useEffect(() => {
        getUsersPost();

    },[])

    useEffect(() => {
        
        let post = postReducer.posts.filter((post) => {
            return post.userId.username === router.query.username

        })

        setUserPosts(post);

    }, [postReducer.posts]);


    useEffect(() => {
        // console.log(authState.connections, userProfile.userId._id)
        if (authState.connections.some(user => user.connectionId._id === userProfile.userId._id)) {
            setIsCurrentUserInConnection(true)
            if(authState.connections.find(user => user.connectionId._id === userProfile.userId._id).status_accepted === true) {
                setIsConnectionNull(false);
            }
        }
    }, [authState.connections])


    
    return (
        <UserLayout>
           
            <DashboardLayout>

                <div className={styles.container}>
                    <div className={styles.backDropContainer}>
                        <img className={styles.backDrop} src={`${BASE_URL}/${userProfile.userId.profilePicture}`} />
                    </div>

                    <div className={styles.profileContainer_details}>

                        <div style={{ display:"flex", gap:"0.7rem" }}>

                            <div style={{flex:"0.8"}}>
                                
                                <div style={{display:"flex", width:"fit-content", alignItems:"center", gap:"1.2rem"}}>
                                    <h2>{userProfile.userId.name}</h2>
                                    <p style={{color:"grey" }}>@{userProfile.userId.username}</p>
                                </div>



                                {isCurrentUserInConnection ?
                                    <button className={styles.connectedButton}>{isConnectionNull ? "Pending" : "Connected"}</button>
                                    :
                                    <button onClick={() => {
                                        dispatch(sendConnectionRequest({ token : localStorage.getItem("token"), connectionId : userProfile.userId._id })) 
                                    }} className={styles.connectBtn}>Connect</button>
                                }

                                <div>
                                    <p>{userProfile.bio}</p>
                                </div>



                            </div>

                            <div style={{flex:"0.2"}}>
                                <h3>Recent Activity</h3>
                                {
                                    userPosts.map((post) => {
                                        return (
                                            <div key={post._id} className={styles.postCard}>
                                                <div className={styles.card}>
                                                    <div className={styles.card_profileContainer}>

                                                        {post.media !== "" ? <img src={`${BASE_URL}/${post.media}`} /> 
                                                         :
                                                         <div style={{width:"3.4rem", height:"3.4rem"}}></div>
                                                        }

                                                    </div>

                                                    <p>{post.body}</p>

                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            
                        </div>
                        
                    </div>

                </div>

            </DashboardLayout>

        </UserLayout>
    );
}


export async function getServerSideProps(context) {

    const request = await clientServer.get("/user/get_profile_based_on_username", {
        params : {
            username : context.query.username
        }
    })

    const response = await request.data;
    // console.log(response);

    return { props : { userProfile : response.profile } }
}

export default ViewProfilePage;