import { AddingTeams } from "../../containers/AddingTeams";

const menuStack = [
    {
        path: "/adicionartime",
        element: <AddingTeams />,
        title: "Adicionar Equipe"
    },
    {
        path: "/adicionartopico",
        element: <div>Tópico</div>,
        title: "Adicionar Tópico"
    }
];

const generalStack = [
    {
        path: "/perfil",
        element: <div>perfil</div>,
        title: "Perfil"
    }
];

export { menuStack, generalStack };
