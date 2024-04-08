"use client"

import styles from "@/app/(pages)/(userPages)/chat/page.module.css";
import Chatrooms from "@/components/chat/chat";
import ChatBox from "@/components/chat/chatBox";
import PotentialChats from "@/components/chat/potentialChats";
import { ChatContext } from "@/context/chatContext";
import { NotifyCustom } from "@/util/notify";
import { Grid, Stack, Typography } from "@mui/joy";
import { LoadingButton } from "@mui/lab";
import { useSession } from "next-auth/react";
import { useContext, useEffect } from "react";
import { Icons } from "react-toastify";

export default function Chat() {

  const { userChats, isUserChatsLoading, updateCurrentChat } = useContext(ChatContext);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user) {
          NotifyCustom({
                icon: Icons.warning,
                text: "Log in to Unlock feature",
                bar: true,
          })
        }
  }, [session]);
  
  if (!session) {
    return(
        <Grid container direction="row" justifyContent="space-around" alignItems="stretch">
                <Grid>
                </Grid>
                    <Grid>
                        <Stack marginTop="35vh" alignItems="center">
                        <LoadingButton loading variant="none" size='large'>
                    </LoadingButton>
                    <Typography>Want to chat with a fellow Believer then Log in/Register Required!</Typography>
                        </Stack>
                    </Grid>
                <Grid>
                </Grid>
      </Grid>
    )
  }

  return (
      <div className={styles.chat_container}>
            <PotentialChats />
          <div style={{ display: "flex"}}>
            <div className={styles.chat_box} >
            {isUserChatsLoading && <LoadingButton loading variant="none"/>}
            {userChats?.slice().reverse().map((chat, index) => (
              <div className={styles.chat_box_item} key={index} onClick={() => updateCurrentChat( chat )}>
                <Chatrooms rUser={chat} />
              </div>
            ))}
          </div>
            <div className={styles.chat_box_right} >
              <ChatBox/>
            </div>
      </div>
      
      </div>
  );
}
