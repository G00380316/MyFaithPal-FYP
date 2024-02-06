//components
import { ChatContextProvider } from "@/context/chatContext";

export default function UserLayout({ children }) {
return (
    <>
        <ChatContextProvider>
            {children}
        </ChatContextProvider>
    </>
    );
}
