//components
import Navbar from "@/components/navbar/navbar.js";
import Footer from "@/components/footer/footer";

export default function UserLayout({ children }) {
return (
    <>
        <Navbar />
        {children}
        <Footer />
    </>
    );
}
