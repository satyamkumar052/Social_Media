import { getAboutUser, getAllUsers } from '@/config/redux/action/authAction';
import { getAllPosts } from '@/config/redux/action/postAction';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import { useRouter } from 'next/router';
import React, { useEffect, useEffectEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';


function dashboard() {

    const router = useRouter(); 

    const authState = useSelector((state) => state.auth);

    const dispatch = useDispatch();


    useEffect(() => {
        if(authState.isTokenThere) {
            dispatch(getAllPosts());
            dispatch(getAboutUser({token : localStorage.getItem("token")}));
        }
        
        if(!authState.all_profiles_fetched) {
            dispatch(getAllUsers());
        }

    }, [authState.isTokenThere])



    return (
        <UserLayout>
           
           <DashboardLayout>
            <h1>Dashboard</h1>
           </DashboardLayout>

        </UserLayout>
    );
}

export default dashboard;