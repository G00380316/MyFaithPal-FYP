import { connectMongoDB } from "@/lib/mongo";
import User from "@/models/user";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcryptjs";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {},

            async authorize(credentials) {
                const { email, password } = credentials;
                
                try {
                    await connectMongoDB();
                    const user = await User.findOne({ email });

                    if (!user) {
                        return null;
                    }

                    const passwordCheck = await bcrypt.compare(password, user.password)

                    if (!passwordCheck) {
                        return null;
                    }

                    if (user.image) {
                        return { _id: user.id, name: user.name, email: user.email, image: user.image };
                    }

                    return { _id: user.id, name: user.name, email: user.email };
                } catch (error) {
                    console.log("Error: ", error);
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user, session }) {
            
            if (!user) {//allow for facebook and google accounts to have session _id so they can use app functionalities
                const user = await User.findOne({ email: token.email });

                if (user?._id) token._id = user._id;
                //console.log("jwt callback", { token, user, session })
                return token;
            }

            //pass id to token
            if (user?._id) token._id = user._id;
            //passing in username to token
            if (user?.username) token.username = user.username;
            //passing in image to token
            if (user?.image) token.image = user.image;
            //console.log("jwt callback", { token, user, session })

            return token;
        },
        async session({ session, token, user }) {

            //then putting the _id in session from database
            if (token?._id) session.user._id = token._id;
            //then putting the username in session from database
            if (token?.username) session.user.username = token.username;
            //then putting the username in session from database
            if (token?.image) session.user.image = token.image;
            //console.log("session callback", { token, user, session })

            return session;
        },
        async signIn({ profile , credentials}) {
            console.log("Details:", profile)
            //console.log("Details:", credentials)
            
            if (credentials) {
                const { email, password } = credentials;
                
                try {
                    await connectMongoDB();
                    const user = await User.findOne({ email });

                    if (!user) {
                        return null;
                    }

                    const passwordCheck = await bcrypt.compare(password, user.password)

                    if (!passwordCheck) {
                        return null;
                    }

                    if (user.image) {
                        return { _id: user.id, name: user.name, email: user.email, image: user.image };
                    }

                    return { _id: user.id, name: user.name, email: user.email };
                } catch (error) {
                    console.log("Error: ", error);
                }
            }
            
            if (profile) {
                try {
                    await connectMongoDB();

                    const userExist = await User.findOne({ email: profile.email });

                    if (!userExist) {
                        if (profile?.iss === 'https://accounts.google.com') {
                                
                                const user = await User.create({
                                    email: profile.email, name: profile.name, image: profile.picture,
                                })

                            console.log("Created Google user",user)

                        } else {
                                
                                const user = await User.create({
                                email: profile.email, name: profile.name, image: profile.picture?.data?.url,
                                })
                            
                            console.log("Created Facebook user",user)
                            
                        }
                    } else if (userExist) {
                        
                        if (profile?.iss === 'https://accounts.google.com') {
                            
                            const updatedUser = await User.findOneAndUpdate({ email: profile.email }, {email: profile.email, name: profile.name, image: profile.picture}, { new: true });

                            console.log("Updated Google user",updatedUser)

                        } else {
                            
                            const updatedUser = await User.findOneAndUpdate({ email: profile.email }, { email: profile.email, name: profile.name, image: profile.picture?.data?.url }, { new: true });
                            
                            console.log("Updated Facebook user",updatedUser)
                            
                        }
                        
                    
                    }

                        return true
                } catch (error) {
                    console.log(error)
                    return false
                }
            }
        
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };