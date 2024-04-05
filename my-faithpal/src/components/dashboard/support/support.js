
import { Box, Card, Divider, Typography, Stack, List, ListItem } from '@mui/joy';
import ListItemText from '@mui/material/ListItemText';
import React from 'react'

export default function Support() {
    
    return (
        <Box m>
            <Card >
                <Box sx={{ m: 2 }} >
                    <Typography
                        fontSize="24px"
                        fontStyle="italic"
                        fontFamily="monospace"
                        level="title-lg"
                        fontWeight={900}
                    >
                        Info & Instructions
                    </Typography>
                <Typography level="sm">
                        Hello there! My name is Enoch Abiodun, and I am a fourth-year college student at Atlantic Technology University in Galway City.
                        Welcome to my final year project called Faithpal. Faithpal is a web application created for new and old believers in Jesus Christ, our Lord, and Savior.
                        I felt God put this project on my heart as a fresh believer myself. At the very beginning, it was very challenging to make new friends, and not just any new friends, but like-minded people.
                        Furthermore, I believe that for some, reading the Bible and understanding it may be difficult, and for others whose families may have different beliefs, having someone around to give advice on your new walk with Christ can be scarce.
                        These are just a few reasons and problems that were at the focal point of my thought process while building this web app.
                        I believe God has really helped me through this project.
                        At the start of the college year, I wouldn't have been able to imagine creating such an app like this one.
                        So I would like to give God all the glory and honor.
                        This app includes six Bibles, a social page, a questions page with two implementations of AI tailored to answer questions on the Bible and Christianity, a chat page that allows you access to all users, and a profile page. I believe all these features enable anyone to grow and know Christ more.
                        So as you endeavor, God bless you, and thank you so much for taking the time to even visit this app. Enjoy!!!
                </Typography>
        </Box>
                <Divider />
                <Stack m={2}>
                    <Typography level="h4">
                    Bible
                    </Typography>
                    <Typography level="body-sm" m={2}>
                        For the Bible, we have four dropdown boxes: "Book", "Chapter", "Verse", and "Translation". On either side of these groups of buttons, we have a "Save" button and a "Clear" button. To get your desired passage, use the different dropdown menus to filter through the Bible.
                        Since you're signed in, the Bible study tools will be accessible to you. We have highlights, comments/notes, and bolding.
                        These three elements can be used to really go in depth and track your learning. To enable these features, all you have to do is drag over the verse you want to highlight. For example, in Genesis 1:1, you will drag from "I" to "." in the text "In the beginning, God created the heavens and the earth." This will allow you to highlight, note, or bold this verse.
                        It is important to note that you can't highlight multiple verses at a time, just the current one. Also, when dragging, don't drag on top of the numbers above and beneath the verse, or the process will fail. After, you should be greeted with a toolbar and can utilize the tools. After you make your change to the chapter, click "Save" so your progress will be saved for next time you visit the page. You can clear after, which removes all the changes to that one chapter.
                    </Typography>
                    <Typography level="h4">
                    Feed
                    </Typography>
                    <Typography level="body-sm" m={2}>
                        For the Feed page, which is the social part of the application, you have your "Create Post" section at the very top, prompting you with "What's on your spirit?" Then below, you have all the posts from every user currently owning an account in this app. This page is very standard and can be compared to the posts pages of Instagram and Facebook.
                        So, to get started, you can make your first post. You can post in three different manners: you can use text and a photo, or just a photo alone, or text alone, allowing you enough freedom to communicate what is on your spirit.
                        Just press "Post" when ready to share with others.
                        Next, on each post, you can bookmark and save.
                        Any post bookmarked shows up on your profile page, as well as your own posts. You can make comments if a post deserves your say and also like comments.
                        The three dots at the top right of each post allow you to unlike and comment.
                        However, if you are the one that made the post, you should have an extra option to then delete the post.
                    </Typography>
                    <Typography level="h4">
                    Questions
                    </Typography>
                    <Typography level="body-sm" m={2}>
                        For this page, we have two artificial intelligence chat models.
                        They have been refined and modified to be friendly and provide you with information based on Christianity and the Bible.
                        The first AI is your basic ChatGPT, which has no conversational awareness and is simply there for questions and answers.
                        On the other hand, we have our second AI, whose name is Solomon.
                        As the name suggests, he is very wise and smart, similar to the biblical Solomon who was known for his wisdom bestowed by God.
                        This AI has conversational awareness, allowing it to remember your name and chat history.
                        It is also being fed data from "Gotquestions.org," a site based on questions and answers for Christians.
                        Furthermore, it may have more knowledge than ChatGPT 3.5 or 4, as I will enable web search for a limited time on Solomon to gather current data.
                        To switch from one AI to another, just press the white button on the bottom right-hand side of the screen, and you should receive a notification indicating that you have now switched AI.
                        Press enter after you have written your input to send your message.
                    </Typography>
                    <Typography level="h4">
                    Chat
                    </Typography>
                    <Typography level="body-sm" m={2}>
                        There are four different sections on the Chat page. On the top left bar, you have your search bar that you can utilize to search for any user on the app to chat with.
                        Once you put your cursor in the box and left-click, the list positioned to the right of the search box will most likely expand.
                        This is because it includes your chats that you have already started as well. If you see the name of the person you wish to chat with, don't rush.
                        The search is intended for filtering use, so at least write one character of that user's name/username to be able to click on that user and start or continue a chat.
                        Beside the search box to the right, in its original state, we have the potential chats that should also light up with green dots if the user is online at the same time as you.
                        If you click on that user, a chat box will appear below, allowing you to message that person.
                        As stated previously, this list will grow if the search box is focused.
                        Below the search box, we have chatrooms that have been started. Simply click on the user to resume the conversation.
                        To the right, we have the chat box that allows emoji input and functionality to send messages to recipients by either pressing enter or clicking a button.
                        There is a notification in place that allows you to open chat and mark messages as read just click the notifications to see their functions.
                    </Typography>
                    <Typography level="h4">
                    Profile
                    </Typography>
                    <Typography level="body-sm" m={2}>
                        "On the profile page, various functionalities are available. A tab bar is situated on the page, facilitating easy switching between different sections. Additionally, at the top right-hand corner of the page, your name and email are displayed alongside an icon for logging out of your account.
                        The initial tab is 'Edit Profile,' enabling comprehensive customization of profile details excluding the password. Simply input the desired changes and click 'Save' at the bottom of the page. It's important to note that any information left blank will remain unchanged.
                        The subsequent tab is 'Your Posts,' providing a filtered feed displaying only the posts you've authored. Following that is 'Saved Posts,' where bookmarked posts are conveniently stored without cluttering the feed with unrelated content. Moving on, two tabs are linked to your Bible page.
                        Firstly, 'Highlights' showcases all your saved highlights, with an option to copy text to the clipboard. Then, 'Saved Notes' displays all your notes and comments. Finally, there's the 'People' page, facilitating user search within the application.
                        Simply start typing a name, and upon selecting a user, you can view their profile and engage with their posts."
                    </Typography>
                    <Typography level="h4">
                    Rules
                    </Typography>
                    <Typography level="body-sm" m={2} mb={10}>
                    <List>
                        <ListItem>
                            <ListItemText primary="Treat others with love and kindness." secondary="(John 13:34-35) 'A new commandment I give to you, that you love one another: just as I have loved you, you also are to love one another. By this all people will know that you are my disciples, if you have love for one another.'" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Respect diverse viewpoints." secondary="(Romans 14:1) 'As for the one who is weak in faith, welcome him, but not to quarrel over opinions.'" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Avoid offensive language and behavior." secondary="(Ephesians 4:29) 'Let no corrupting talk come out of your mouths, but only such as is good for building up, as fits the occasion, that it may give grace to those who hear.'" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Maintain a positive atmosphere." secondary="(Philippians 4:8) 'Finally, brothers, whatever is true, whatever is honorable, whatever is just, whatever is pure, whatever is lovely, whatever is commendable, if there is any excellence, if there is anything worthy of praise, think about these things.'" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Keep discussions focused on edifying topics." secondary="(Ephesians 4:29) 'Let no corrupting talk come out of your mouths, but only such as is good for building up, as fits the occasion, that it may give grace to those who hear.'" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Respect privacy." secondary="(Matthew 7:12) 'So whatever you wish that others would do to you, do also to them, for this is the Law and the Prophets.'" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Report inappropriate content.(Report at 'enochabiodun918@gmail.com')" secondary="(Ephesians 5:11) 'Take no part in the unfruitful works of darkness, but instead expose them.'" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Moderate discussions." secondary="(Proverbs 15:1) 'A soft answer turns away wrath, but a harsh word stirs up anger.'" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Encourage forgiveness and reconciliation." secondary="(Matthew 6:14) 'For if you forgive others their trespasses, your heavenly Father will also forgive you.'" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Prayer and support." secondary="(James 5:16) 'Therefore, confess your sins to one another and pray for one another, that you may be healed. The prayer of a righteous person has great power as it is working.'" />
                        </ListItem>
                        </List>
                        Updates will be implemented promptly upon detecting any bugs or for general enhancement of the app.
                        If you wish to support me in this endeavor, my Rev tag is @enoch1urd, which can be used to locate my Revolut account.
                        Your support is greatly appreciated as it will aid in maintaining the application's functionality.
                        Thank you sincerely for visiting Faithpal Web Application. May God bless you abundantly for your time and support!
                </Typography>
                </Stack>
            </Card>
        </Box>
    )
}
