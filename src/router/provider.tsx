import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Home, Login } from "../containers";

const router = createBrowserRouter([
    {
        path: "login",
        element: <Login />
    },
    {
        path: "/",
        element: <Home />
    }
]);

export { router };
