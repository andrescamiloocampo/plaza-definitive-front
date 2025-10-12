"use client"

import { ReactElement, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
    children: ReactElement;
}

export default function AuthMiddleware({children}:Props) {
    const router = useRouter();

    useEffect(()=>{
        console.log('Call')
        const token = sessionStorage.getItem('accessToken');
        if(!token){
            router.push('/login')
        }    
    },[router]);
    
    return (
        <>
            {children}
        </>
    );
}