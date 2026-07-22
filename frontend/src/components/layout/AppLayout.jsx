import Navbar from "./Navbar/Navbar";

function AppLayout({ children }) {

    return (

        <>

            <Navbar />

            <main>

                {children}

            </main>

        </>

    );

}

export default AppLayout;