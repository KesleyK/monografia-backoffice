import { Teams } from "../../containers/Teams";
import { TeamDetails } from "../../containers/TeamDetails";
import { Subtopics } from "../../containers/Subtopics";
import { Challenges } from "../../containers/Challenges";
import { ChallengeDetails } from "../../containers/ChallengeDetails";
import { Home } from "../../containers/Home";
import { Home as HomeIcon, Groups2, AccountCircle } from "@mui/icons-material";

const menuStack = [
    {
        path: "/",
        element: <Home />,
        title: "Home",
        hideOnDrawer: false,
        icon: <HomeIcon />
    },
    {
        path: "/times",
        element: <Teams />,
        title: "Times",
        hideOnDrawer: false,
        icon: <Groups2 />
    },
    {
        path: "/times/detalhes",
        element: <TeamDetails />,
        hideOnDrawer: true
    },
    {
        path: "/times/topicos",
        element: <Subtopics />,
        hideOnDrawer: true
    },
    {
        path: "/times/desafios",
        element: <Challenges />,
        hideOnDrawer: true
    },
    {
        path: "/times/desafio/detalhes",
        element: <ChallengeDetails />,
        hideOnDrawer: true
    }
];

const generalStack = [
    {
        path: "/perfil",
        element: <div>perfil</div>,
        title: "Perfil",
        hideOnDrawer: false,
        icon: <AccountCircle />
    }
];

export { menuStack, generalStack };
