import { Outlet } from "react-router-dom";

import Navbar from "./Navbar/Navbar";

function AppLayout() {

    return (

        <>

            <Navbar />

            <main>

                <Outlet />

            </main>

        </>

    );

}

export default AppLayout;