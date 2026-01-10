import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import React, { useEffect, useState } from 'react';
import styles from "./index.module.css";
import { BASE_URL, clientServer } from '@/config';
import { useDispatch, useSelector } from 'react-redux';
import { getAboutUser } from '@/config/redux/action/authAction';
import { getAllPosts } from '@/config/redux/action/postAction';


function UserProfile() {

    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth);
    const postReducer = useSelector((state) => state.posts);
    
    const [userProfile, setUserProfile] = useState({
        userId: {
            name : "",
            username : "",
            profilePicture : ""
        },
        bio: "",
        pastWork: [],
        education : [],
    })

    const [userPosts, setUserPosts] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [workInputData, setWorkInputData] = useState({
        company : "",
        position : "",
        years : "",
    });
    const handleWorkInput = (e) => {

        const { name, value } = e.target;

        setWorkInputData({ ...workInputData, [name] : value })
    }

    // -------------------------------------education---------------------------------------

    const [workEducationData, setEducationInputData] = useState({
        school : "",
        degree : "",
        fieldOfStudy : "",
    });

    const handleEducationInput = (e) => {
        const {name,value} = e.target;

        setEducationInputData({ ...workEducationData, [name] : value})
    }

    // -------------------------------------education---------------------------------------

    useEffect(() => {
        dispatch(getAboutUser({token : localStorage.getItem("token")}));
        dispatch(getAllPosts());
    }, [])


    useEffect(() => {
        if(authState.user != undefined) {
            setUserProfile(authState.user);

            let post = postReducer.posts.filter((post) => {
                return post.userId.username === authState.user.userId.username;    
            })
            setUserPosts(post);
        }
        
            
    }, [authState.user, postReducer.posts])


    const updateProfilePicture = async (file) => {
        const formData = new FormData();
        formData.append("profile_picture", file);
        formData.append("token", localStorage.getItem("token"));

        const response = await clientServer.post("/update_profile_picture", formData, {
            headers : {
                "Content-Type" : "multipart/form-data"
            },
        });

        dispatch(getAboutUser({token : localStorage.getItem("token")}));
    }


    const updateProfileData = async () => {
        const request = await clientServer.post("/user_update", {
            token : localStorage.getItem("token"),
            name : userProfile.userId.name,
        })
        
        const response = await clientServer.post("/update_profile_data", {
            token : localStorage.getItem("token"),
            bio : userProfile.bio,
            currentPost : userProfile.currentPost,
            pastWork : userProfile.pastWork,
            education : userProfile.education,

        })

        dispatch(getAboutUser({token : localStorage.getItem("token")}));
    }


    return (
        <UserLayout>
            <DashboardLayout>

                {authState.user && userProfile.userId && 

                <div className={styles.container}>
                    <div className={styles.backDropContainer}>
                        <div className={styles.backDrop}>
                            <label htmlFor='profilePictureUpload' className={styles.backDrop_overlay}>
                                <p>Edit</p>
                            </label>
                            <input onChange={(e) => {
                                updateProfilePicture(e.target.files[0])
                            }} type="file" id='profilePictureUpload' hidden />
                            <img src={`${BASE_URL}/${userProfile.userId.profilePicture}`} />
                        </div>
                    </div>

                    <div className={styles.profileContainer_details}>

                        <div style={{ display:"flex", gap:"0.7rem" }}>

                            <div style={{flex:"0.8"}}>
                                
                                <div style={{display:"flex", width:"fit-content", alignItems:"center", gap:"1.2rem"}}>
                                    <input className={styles.nameEdit} type="text" value={userProfile.userId.name} onChange={(e) =>
                                        setUserProfile({...userProfile, userId: {...userProfile.userId, name:e.target.value}})
                                    } />
                                    <p style={{color:"grey" }}>@{userProfile.userId.username}</p>
                                </div>



                                

                                <div>
                                    <textarea value={userProfile.bio} onChange={(e) =>
                                        setUserProfile({...userProfile, bio:e.target.value})
                                    } rows={Math.max(3,Math.ceil(userProfile.bio.length / 80))} style={{width:"90%"}} />
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


                    <div className={styles.workHistory}>
                        <h4>Work History</h4>

                        <div className={styles.workHistoryContainer}>
                            {
                                userProfile.pastWork.map((work, index) => {
                                    return (
                                        <div key={index} className={styles.workHistoryCard}>
                                            <p style={{fontWeight:"bold", display:"flex", alignItems:"center", gap:"0.8rem"}}>{work.company} - {work.position}</p>
                                            <p>{work.years}</p>
                                        </div>
                                    )
                                })
                            }
                            <button onClick={()=>setIsModalOpen(!isModalOpen)} className={styles.addWorkButton}>Add Work</button>
                        </div>
                        
                    </div>


                    {userProfile != authState.user &&
                        <div onClick={() => updateProfileData()} className={styles.updateProfileBtn}>
                            Update Profile
                        </div>
                    }


                </div>}


                {// pick from dashboard
                isModalOpen &&  
                
                <div onClick={() => {
                    setIsModalOpen(!isModalOpen)
                }} className={styles.commentContainer}>
                    <div onClick={(e) => {
                        e.stopPropagation()
                    }} className={styles.allCommentContainer}>
                        <input onChange={handleWorkInput} name='company' className={styles.inputField} type="text" placeholder='Enter Company' />
                        <input onChange={handleWorkInput} name='position' className={styles.inputField} type="text" placeholder='Enter Position' />
                        <input onChange={handleWorkInput} name='years' className={styles.inputField} type="number" placeholder='Years' />

                        <div onClick={() => {
                            setUserProfile({ ...userProfile, pastWork : [...userProfile.pastWork, workInputData]})
                            setIsModalOpen(false)
                        }} className={styles.updateProfileBtn}>
                            Save
                        </div>




                        {/* ---------------education----------------- */}

                        {/* <input onChange={handleEducationInput} name='school' className={styles.inputField} type="text" placeholder='Enter School' />
                        <input onChange={handleEducationInput} name='degree' className={styles.inputField} type="text" placeholder='Degree Name' />
                        <input onChange={handleEducationInput} name='fieldOfStudy' className={styles.inputField} type="text" placeholder='What field' />


                        <div onClick={() => {
                            setUserProfile({ ...userProfile, education : [...userProfile.education, workEducationData]})
                            setIsModalOpen(false)
                        }} className={styles.updateProfileBtn}>
                            Save
                        </div> */}

                        {/* ---------------education----------------- */}

                    </div>

                </div>

        }

            </DashboardLayout>
        </UserLayout>
    );
}

export default UserProfile;