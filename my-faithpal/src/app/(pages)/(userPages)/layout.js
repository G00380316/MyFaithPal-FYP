//components
import Navbar from "@/components/navbar/navbar.js";
import Footer from "@/components/footer/footer";
import { Box } from "@mui/joy";

export default function UserLayout({ children }) {
return (
    <Box display="flex" flexDirection="column" width="100%" height="100vh">
            <Navbar />
                {children}
        </Box>
    );
}
