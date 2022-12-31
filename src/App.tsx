import { ThemeProvider } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/provider";
import theme from "./styles/theme";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
