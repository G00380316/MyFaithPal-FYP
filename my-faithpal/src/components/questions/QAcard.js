"use client"

import { AIChatContext } from '@/context/aiChatContext';
import { useFetchRecipientUser } from '@/hooks/openAI/useFetchRecipient';
import { NotifyCustom } from '@/util/notify';
import { aiUrl, postRequest } from '@/util/service';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { Checkbox, Grid, Stack, Typography } from '@mui/joy';
import { LoadingButton } from '@mui/lab';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { useContext, useEffect, useRef, useState } from 'react';
import InputEmojiWithRef from 'react-input-emoji';
import { Icons } from "react-toastify";
import styles from "./qa.module.css";

export default function QuestionModal() {
    
    const { data: session } = useSession();
    const { currentAIChat, messages, isMessagesLoading , sendTextMessage} = useContext(AIChatContext);
    const { recipientUser } = useFetchRecipientUser(currentAIChat);
    const [textMessage, setTextMessage] = useState("");
    const [isToggled, setIsToggled] = useState(false);
    const [isClicked, setClick] = useState(false);
    const [checked, setChecked] = useState(false);
    const scroll = useRef();

    const handleKeyPress = () => {
        // Call the function to send the message when Enter is pressed
        sendTextMessage(textMessage, currentAIChat._id, setTextMessage, isToggled, checked);
        setTextMessage("");
    };

    const handleToggle = () => {
        setIsToggled(!isToggled);
        setClick(false);
        if (!isToggled) {
            NotifyCustom({text:`Switched to Solomon`});
        }
        else {
            NotifyCustom({ text: `Switched to OpenAI` });
        }
    };

    const handleChange = () => {
        setChecked(!checked);
        setIsToggled(false);
        if (!checked) {
            NotifyCustom({text:`Strict Mode` , bar: true, theme: "dark", icon: Icons.warning});
        }
        else {
            NotifyCustom({text:`Strict Mode Off` , bar: true, theme: "dark", icon: Icons.info});
        }
    };

    const handleClearButtonClick = async () => {
        setClick(prevClick => !prevClick);

        if (!isClicked) {

            const response = await postRequest(`${aiUrl}prompt/delete`, JSON.stringify({
                aichatroom: currentAIChat
            }));

            //console.log(response)

            if (response.acknowledged === true) {
                NotifyCustom({ text: `Chat is cleared, click to see changes`, bar: true, icon: Icons.success, onClick: () => window.location.reload() })
            }
        } else {
            NotifyCustom({text:`Click again to confirm`, bar: true, icon: Icons.info })
        }
    };

    useEffect(() => {
        scroll.current?.scrollIntoView({ behaviour: "smooth" })
    }, [messages,recipientUser]);

    useEffect(() => {
        if (!session?.user) {
            NotifyCustom({
                icon: Icons.warning,
                text: "Log in to Unlock feature",
                bar: true,
                autoClose: 1500,
            })
        } else if (session?.user) {
            NotifyCustom({
                icon: Icons.info,
                text: "Click white buttons Top left or Bottom right to enable Solomon",
                bar: false,
                autoClose: 2500,
                theme: "dark"
            })
        }
    }, [session]);
    
    //console.log( "This is chatBox AI current Chat: ",currentAIChat)
    //console.log("This is chatBox recipient User: ", recipientUser)
    //console.log("These are messages:", messages)
    ////console.log("Message input: ", textMessage)
    
    if (!session) {
        return (
            <Grid  container direction="row" justifyContent="space-around" alignItems="stretch">
                <Grid>
                </Grid>
                    <Grid>
                        <Stack marginTop="35vh" alignItems="center">
                        <LoadingButton loading variant="none" size='large'>
                    </LoadingButton>
                        <Typography>Oh Oh AI Conversation Loading...But Sign In Required!</Typography>
                        </Stack>
                    </Grid>
                    <Grid>
                </Grid>
            </Grid>
        );
    }
    
    if (!recipientUser)
        return (
            <Grid  container direction="row" justifyContent="space-around" alignItems="stretch">
                <Grid>
                </Grid>
                    <Grid>
                        <Stack marginTop="35vh" alignItems="center">
                        <LoadingButton loading variant="none" size='large'>
                    </LoadingButton>
                    <Typography>AI Conversation Loading</Typography>
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
                    <Typography>Messages are Loading</Typography>
                        </Stack>
                    </Grid>
                    <Grid>
                </Grid>
        </Grid>
        );

    return (
        <div className={styles.chat_box}>
            <div className={styles.chat_header}>
                <Grid display={"flex"} flexDirection={"row"} justifyContent={"space-between"} spacing={1} flex={1}>
                    {
                        !isToggled ?
                        <Checkbox
                        checked={checked}
                        onChange={handleChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                        sx={{marginTop:0.75}}
                        />
                        :
                            <Checkbox disabled={true} uncheckedIcon={<DisabledByDefaultIcon/>} disableIcon={false} sx={{marginTop:0.75}}/>
                    }
                    
                    <Stack>
                        <span className={styles.title} >RabbiGpt</span>
                    </Stack>
                    <button onClick={handleClearButtonClick} className={styles.button}>
                        Clear
                    </button>
                </Grid>
            </div>
        <div className={styles.chat_messages}>
            <div className={styles.messages_box}>
                <div className={styles.messages}>
                        {messages && messages.map((message, index) =>
                            <div key={index} className={message?.user === session?.user?._id ? styles.message : styles.user_message} ref={scroll}>
                    <span className={message?.user === session?.user?._id ? "" : styles.letter}>{message.text}</span>
                    <span className={styles.date}>{moment(message.createdAt).calendar()}</span>
                            </div>
            )}
                </div>
            </div>
            </div>
            {
                !checked ?
                    <div className={styles.chat_input}>
                    <InputEmojiWithRef
                    value={textMessage}
                    onChange={setTextMessage}
                    onEnter={handleKeyPress}
                    fontFamily="nunito"
                    borderColor="rgba(72,112,223,0.2)"
                    disableRecent={true}
                    placeholder="Ask your Rabbi AI a Question? Dont be shy..." />
                        <input type="checkbox" id="switch" checked={isToggled} onChange={handleToggle} /><label for="switch">{isToggled ? 'ON' : 'OFF'}</label>
                    </div>
                    :
                    <div className={styles.chat_input}>
                    <InputEmojiWithRef
                    value={textMessage}
                    onChange={setTextMessage}
                    onEnter={handleKeyPress}
                    fontFamily="nunito"
                    borderColor="rgba(72,112,223,0.2)"
                    disableRecent={true}
                    placeholder="Ask your Rabbi AI a Question? Dont be shy..." />
                    </div>
            }
        </div >
    );
}