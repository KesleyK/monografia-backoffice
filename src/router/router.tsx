import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoadingPage } from "../components";
import { useAuthentication } from "../services/firebase/hooks/useAuthentication";
import { providerStack } from "./stacks/providerStack";

function Router() {
    const { user, handshakeAccomplished } = useAuthentication();

    if (!handshakeAccomplished) {
        return <LoadingPage />;
    }

    const getPageElement = (page) => {
        if (page.protected && !user) {
            return <Navigate to="login" />;
        }

        if (page.unprotected && user) {
            return <Navigate to="/" />;
        }

        return <page.element />;
    };

    return (
        <BrowserRouter>
            <Routes>
                {providerStack.map((page) => (
                    <Route key={page.path} path={page.path} element={getPageElement(page)}>
                        {page.childrens?.map((pageChildren) => (
                            <Route key={pageChildren.path} path={pageChildren.path} element={pageChildren.element} />
                        ))}
                    </Route>
                ))}
            </Routes>
        </BrowserRouter>
    );
}

export { Router };
