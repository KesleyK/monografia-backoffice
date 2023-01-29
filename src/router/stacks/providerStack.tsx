import { Layout, Login, Register } from "../../containers";
import { menuStack, generalStack } from "./drawerStack";

const providerStack = [
    {
        path: "login",
        element: <Login />
    },
    {
        path: "registro",
        element: <Register />
    },
    {
        path: "/",
        element: <Layout />,
        childrens: [...menuStack, ...generalStack]
    }
];

export { providerStack };
