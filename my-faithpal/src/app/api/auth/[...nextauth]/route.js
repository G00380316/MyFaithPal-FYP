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
            //pass id to token
            if (user?._id) token._id = user._id;
            //console.log("jwt callback", { token, user, session })
            return token;
        },
        async session({ session, token, user }) {
            if (token?._id) session.user._id = token._id;
            //console.log("session callback", { token, user, session })
            return session;
        },
        async signIn({ profile }) {
            console.log("Details:",profile)

            try {
                await connectMongoDB();

                const userExist = await User.findOne({ email: profile.email });

                if (!userExist) {
                    const user = await User.create({
                        email: profile.name, name: profile.name, image: profile.picture?.data?.url,
                    })

                    console.log(user)

                }

                return true
            } catch (error) {
                console.log(error)
                return false
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