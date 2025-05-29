import { Slide } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";

const Router = () => {
    return (
        <>
        <SideBar />
        <Outlet />
        </>
    )
}

export default Rooter;