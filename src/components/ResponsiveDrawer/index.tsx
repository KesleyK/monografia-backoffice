import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ListSubheader from "@mui/material/ListSubheader";
import Divider from "@mui/material/Divider";
import { Link } from "react-router-dom";
import { generalStack, menuStack } from "../../router/stacks/drawerStack";

const drawerWidth = 240;

export function ResponsiveDrawer(props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <div>
            <Toolbar>
                <img
                    src={require("../../assets/logo.png")}
                    alt="logo"
                    style={{ width: "30px", height: "30px", marginRight: "10px" }}
                />
                <Typography variant="subtitle2">Algoritmia</Typography>
            </Toolbar>

            <Divider />
            <List>
                <ListSubheader>Menu Principal</ListSubheader>
                {menuStack
                    .filter((page) => !page.hideOnDrawer)
                    .map((page) => (
                        <ListItem key={page.title} disablePadding>
                            <ListItemButton component={Link} to={page.path}>
                                <ListItemIcon>{page.icon}</ListItemIcon>
                                <ListItemText primary={page.title} />
                            </ListItemButton>
                        </ListItem>
                    ))}
            </List>

            <Divider />

            <List>
                <ListSubheader>Geral</ListSubheader>
                {generalStack
                    .filter((page) => !page.hideOnDrawer)
                    .map((page) => (
                        <ListItem key={page.title} disablePadding>
                            <ListItemButton component={Link} to={page.path}>
                                <ListItemIcon>{page.icon}</ListItemIcon>
                                <ListItemText primary={page.title} />
                            </ListItemButton>
                        </ListItem>
                    ))}
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` }
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%"
                        }}
                    >
                        <Typography variant="h6" noWrap component="div">
                            Bem-vindo
                        </Typography>
                        <Link to="/login" style={{ color: "#FFFF" }}>
                            <LogoutIcon />
                        </Link>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth }
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth }
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` }
                }}
            >
                <Toolbar />
                {props.children}
            </Box>
        </Box>
    );
}
