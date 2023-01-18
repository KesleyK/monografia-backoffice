import { Teams } from "../../containers/Teams";
import { TeamDetails } from "../../containers/TeamDetails";

const menuStack = [
    {
        path: "/equipes",
        element: <Teams />,
        title: "Equipes",
        hideOnDrawer: false
    },
    {
        path: "/equipes/detalhes",
        element: <TeamDetails />,
        hideOnDrawer: true
    },
    {
        path: "/relatorios",
        element: <div>Relatórios</div>,
        title: "Relatórios",
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
