import { useRouter } from 'next/router';
import React, { useEffect } from 'react';


function dashboard() {

    const router = useRouter(); 
    useEffect(() => {
        if(localStorage.getItem("token") === null ) {
            router.push("/login")
        }
    })

    return (
        <h1>dashboard</h1>
    );
}

export default dashboard;