import { ThemeProvider } from "@mui/material";
import { Register } from "./containers";
import theme from "./styles/theme";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Register />
        </ThemeProvider>
    );
}

export default App;
