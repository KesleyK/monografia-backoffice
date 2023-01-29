import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { ResponsiveDrawer } from "../../components";

export function Layout() {
    return (
        <Box>
            <ResponsiveDrawer>
                <Outlet />
            </ResponsiveDrawer>
        </Box>
    );
}
