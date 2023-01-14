import { Teams } from "../../containers/Teams";
import { TeamInfo } from "../../containers/TeamInfo";

const menuStack = [
    {
        path: "/equipes",
        element: <Teams />,
        title: "Equipes",
        hideOnDrawer: false
    },
    {
        path: "/equipes/info",
        element: <TeamInfo />,
        title: "Equipes",
        hideOnDrawer: true
    },
    {
        path: "/adicionartopico",
        element: <div>Tópico</div>,
        title: "Adicionar Tópico",
        hideOnDrawer: false
    }
];

const generalStack = [
    {
        path: "/perfil",
        element: <div>perfil</div>,
        title: "Perfil",
        hideOnDrawer: false
    }
];

export { menuStack, generalStack };
