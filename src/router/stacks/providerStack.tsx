import { Home, Login } from "../../containers";
import { menuStack, generalStack } from "./drawerStack";

const providerStack = [
    {
        path: "login",
        element: <Login />
    },
    {
        path: "/",
        element: <Home />,
        childrens: [...menuStack, ...generalStack]
    }
];

export { providerStack };
