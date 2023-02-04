import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { ResponsiveDrawer } from "../../components";
import { signoutUser } from "../../services/firebase/auth/signoutUser";

export function Layout() {
    const logoutUser = async () => await signoutUser();

    return (
        <Box>
            <ResponsiveDrawer logout={logoutUser}>
                <Outlet />
            </ResponsiveDrawer>
        </Box>
    );
}
