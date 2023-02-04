import { Layout, Login, Register } from "../../containers";
import { NotFoundPage } from "../../containers/NotFoundPage";
import { menuStack, generalStack } from "./drawerStack";

const providerStack = [
    {
        path: "login",
        element: Login,
        unprotected: true
    },
    {
        path: "registro",
        element: Register,
        unprotected: true
    },
    {
        path: "/",
        element: Layout,
        childrens: [...menuStack, ...generalStack],
        protected: true
    },
    {
        path: "*",
        element: NotFoundPage
    }
];

export { providerStack };
