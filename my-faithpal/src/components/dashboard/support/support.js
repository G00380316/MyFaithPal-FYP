
import { Box, Card, Divider, Typography, Stack } from '@mui/joy';
import React from 'react'

const Styles = {
    root: {
        maxHeight: '90vh',
        overflowY: 'scroll',
        '&::-webkit-scrollbar': {
        width: '0.1em'
        },
        '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,0)',
        borderRadius: '0.25em'
        }
    }
};

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
                        Hello there! My name is Enoch abiodun and I am 4th Year College student at Atlantic Technology University in Galway City.
                        Welcome to my final year project called Faithpal. Faithpal is an Web Application created for new and old believers in Jesus Christ
                        our Lord and Savior. I felt God put this project on my heart as a fresh believer myself at the very beginning it was very challenging
                        in terms of making new friends and not just any new friends but like minded people. Futhermore, I believe for some reading Bible and
                        understanding may be difficult and for some whos family may have other beliefs having someone around that can give advice on your
                        new walk with Christ can be scarce. These are just a few reasons problems that were at the focal point of my thought proccess while
                        building this Web App. I believe God has really helped me through this project as at the Start of the college year I wouldn't be able
                        to possibly imagine creating such an App like this one. So I would like to give God all the glory and honour. This app includes 6 Bibles
                        ,Social Page, Questions page with two implementations of AI tailored to answer questions on the Bible and Christianity, A Chat page that
                        allows you access to all Users and a Profile page. All these features I believe to enable anyone to grow and know Christ more so as you
                        endeavour...God bless you and Thank you so much for taking the time to even visit this App. Enjoy!!!
                </Typography>
        </Box>
                <Divider />
                <Stack m={2}>
                    <Typography level="h4">
                    Bible
                    </Typography>
                    <Typography level="body-sm" m={2}>
                        For the Bible we have four dropdown boxes "Book", "Chapter", "Verse" and "Translation" on either side of these group of buttons we have a "Save" and
                        we have a "Clear". To get your desired passage use the different dropdown menu to filter through the Bible. Since your Signed in, the Bible
                        Study tools will be accesible to you we have highlights, comments/notes and bold this three elements can be used to really go in depth and track
                        your learning. To enable these features all you have to do is drag over the verse you want to highlight and for example in Genesis 1:1 you will drag
                        from I to . in the text "In the beginning, God created the heavens and the earth." this will allow you to highlight or note or bold this verse. It
                        is important to note that you can't higlight multiple verses at a time just the one current verse also when dragging don't drag on top of the
                        numbers above and beneath the verse or the procces will fail after you should be greeted with a tool bar and can utilise the tools after you make
                        your change to the Chapter click "Save" so your progress will be saved for next time you visit the page you can clear after which removes all the
                        changes to that one Chapter.
                    </Typography>
                    <Typography level="h4">
                    Feed
                    </Typography>
                    <Typography level="body-sm" m={2}>
                        For the Feed page which is the Social part of the Application you have your "Creat Post" Section at the very top prompting you what's on your Spirit
                        then below you have all thhe posts from every User currently owning an Account in this App. This page is very standard and can be compared to the posts
                        pages of Instagram and Facebook. So to get started you can make you first post you can post in three different manners you can use text and a photo
                        or just a photo alone or a text alone allowing you enough freedom to commincate what it is thats on your Spirit just press post when ready to
                        share with others. Next on each posts you can bookmark and save any post bookmarked shows up on your profile page and your own posts aswell. You can
                        make comments if a post deserves you say and also like comments.The three dots at the top right of each post allows you to unlike and comment but not
                        withstanding if you are the one that made the post you should have an extra option to then delete the post.
                    </Typography>
                    <Typography level="h4">
                    Questions
                    </Typography>
                    <Typography level="body-sm" m={2}>
                        For this page we have two Artificial intelligence Chat Models. They have been refined and modified to be friend and provide you with information based
                        on Christianity and the Bible the first AI is your less Chatgpt that has no conversational awareness and is simply just there for questions and answer.
                        On the otherhand we have our second AI whos name is Solomon as he was the wiset man in the bible due to Gods hand of his life this AI as the name
                        suggest is very wise and smart and has conversational awareness allowing it to remember your name and remembering your chat history it is also being Fed
                        data from "Gotquestions.org" the site based on questions and answers for Christians furthermore it may have more knowledge then Chatgpt 3.5 or 4
                        as I will enabling web search for a limited time on Solomon to get current time data. To switch from one AI to another just press the white button on the
                        button right hand side of the screen and you should recieve a notification relaying that you have now switched AI. Press enter to after you have written
                        your input to send your message.
                    </Typography>
                    <Typography level="h4">
                    Chat
                    </Typography>
                    <Typography level="body-sm" m={2}>
                        There are four different sections for the Chat page. On the top left bar you have your search bar that you can utilise to search any User on the
                        app to chat with once you put your cursor on the box and left-click the list positioned to the right of the Search box will must likely expand.
                        This is because it includes you chats that you have already started aswell but if you see the name of the person you wish to chat with don't
                        rush the search is intended for filter use so at least write one character of that Users name/Username to be able to click on that User and start
                        or continue a chat. Beside the Search Box to the right in its orginal state we have the potential chats that should also light with green dots if
                        the User is online at the same time as you. If you click on that user a Chat box will appear below allowing you to message that person like it was
                        stated previously this list will grow if the Search box is focused.Below the Search Box we have chatrooms that have been started simply click on the
                        User to resume conversation. To the right we have the Chat box that allows emoji input and both enter and button press fucntionality to send
                        messages to Recipients.
                    </Typography>
                    <Typography level="h4">
                    Profile
                    </Typography>
                    <Typography level="body-sm" m={2}>
                        Write a short introduction to be displayed on your profile
                    </Typography>
                    <Typography level="h4">
                    Rules
                    </Typography>
                    <Typography level="body-sm" m={2} mb={10}>
                        Write a short introduction to be displayed on your profile
                    </Typography>
                </Stack>
            </Card>
        </Box>
    )
}
