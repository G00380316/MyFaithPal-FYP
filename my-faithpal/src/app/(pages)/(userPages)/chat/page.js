"use client"

//import DisplayUser from "@/app/api/getUser"; to get from backend information from json backend
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";
import Chat from "@/components/chat/chat";

export default function chat() {

  const { data: session } = useSession();
  
  return (
    <section>
      <div>
      <h1>chat page</h1>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <p style={{ color: 'purple',paddingRight:10 }}>Hi Welcome!!Nice to meet you</p>
        {session?.user?.name}
      </div>
      <Chat/>
    </section>
      )
  }
