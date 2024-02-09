//components
import Navbar from "@/components/navbar/navbar.js";
import Footer from "@/components/footer/footer";

export default function UserLayout({ children }) {
return (
    <>
        <div style={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>
        <Navbar />
            {children}
        <Footer/>
        </div>
    </>
    );
}
