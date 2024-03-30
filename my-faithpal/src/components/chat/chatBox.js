import styles from "@/components/chat/chat.module.css";
import { ChatContext } from '@/context/chatContext';
import { useFetchRecipientUser } from '@/hooks/chat/useChatboxFetchRecipient';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { useContext, useEffect, useRef, useState } from 'react';
import InputEmojiWithRef from 'react-input-emoji';
import { Avatar,CircularProgress,Grid,Stack, Typography } from "@mui/joy";
import LoadingButton from '@mui/lab/LoadingButton';

export default function chatBox() {

  const { data: session } = useSession();
  const { currentChat, messages, isMessagesLoading , sendTextMessage} = useContext(ChatContext);
  const { recipientUser } = useFetchRecipientUser(currentChat);
  const [textMessage, setTextMessage] = useState("");
  const scroll = useRef();

  const handleKeyPress = () => {
      // Call the function to send the message when Enter is pressed
    sendTextMessage(textMessage, currentChat._id, setTextMessage);
  };

  useEffect(() => {
    scroll.current?.scrollIntoView({ behaviour: "smooth" })
  }, [messages,recipientUser]);

  /*
  console.log( "This is chatBox current Chat: ",currentChat)
  console.log("This is chatBox recipient User: ", recipientUser)
  console.log("These are messages:", messages)
  console.log("Message input: ", textMessage)
*/
  
  if (!recipientUser)
    return (
      <Grid  container direction="row" justifyContent="space-around" alignItems="stretch">
            <Grid>
            </Grid>
                <Grid>
                    <Stack marginTop="35vh" alignItems="center">
                    <LoadingButton loading variant="none" size='large'>
                    Select a conversation
                  </LoadingButton>
                  <Typography>Select a conversation</Typography>
                    </Stack>
                </Grid>
                <Grid>
              </Grid>
      </Grid>
    );
  
    if (isMessagesLoading)
    return (
      <Grid  container direction="row" justifyContent="space-around" alignItems="stretch">
            <Grid>
            </Grid>
                <Grid>
                    <Stack marginTop="35vh" alignItems="center">
                    <LoadingButton loading variant="none" size='large'>
            </LoadingButton>
                    </Stack>
                </Grid>
                <Grid>
              </Grid>
      </Grid>
    );
  
  return (
    <div className={styles.chat_box}>
      <div className={styles.chat_header}>
        <Avatar size="sm" src={recipientUser?.image || ""} sx={{ borderColor: 'background.body' }}/>
          <div className={styles.user_card}></div>
      <span>{recipientUser?.name}</span>
      </div>
      <div className={styles.chat_messages}>
        <div className={styles.messages}>
        {messages && messages.map((message, index) => <div  key={index} className={message?.user === session?.user?._id ? styles.message : styles.user_message} ref={scroll}>
          <span>{message.text}</span>
          <span className={styles.date}>{moment(message.createdAt).calendar()}</span>
              </div>
            )}
          </div>
      </div>
      <div className={styles.chat_input}>
        <InputEmojiWithRef value={textMessage} onChange={setTextMessage} onEnter={handleKeyPress}  fontFamily="nunito" borderColor="rgba(72,112,223,0.2)" />
        <button className={styles.send_button} onClick={() => sendTextMessage(textMessage , currentChat._id , setTextMessage)}>Send</button>
      </div>
    </div >
  );
}
