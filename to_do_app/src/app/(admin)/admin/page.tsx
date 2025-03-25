import React from 'react'
import { redirect } from "next/navigation";
import { requireAdmin } from '@/lib/session';

const page = async () => {
    const session = await requireAdmin()
    if(!session){
        redirect("/")
    }

    return (
        <div>
            <div>welcome to admin {session?.user.username}</div>
        </div>
);
    
};

export default page