import { Home, Login, Register } from "../../containers";
import { menuStack, generalStack } from "./drawerStack";

const providerStack = [
    {
        path: "login",
        element: <Login />
    },
    {
        path: "cadastro",
        element: <Register />
    },
    {
        path: "/",
        element: <Home />,
        childrens: [...menuStack, ...generalStack]
    }
];

export { providerStack };
