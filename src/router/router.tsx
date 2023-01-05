import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { providerStack } from "./stacks/providerStack";

const router = (
    <Router>
        <Routes>
            {providerStack.map((page) => (
                <Route key={page.path} path={page.path} element={page.element}>
                    {page.childrens?.map((pageChildren) => (
                        <Route key={pageChildren.path} path={pageChildren.path} element={pageChildren.element} />
                    ))}
                </Route>
            ))}
        </Routes>
    </Router>
);

export { router };
