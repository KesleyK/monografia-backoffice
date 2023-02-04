import { ThemeProvider } from "@mui/material";
import { Router } from "./router/router";
import theme from "./styles/theme";

function App() {
    return <ThemeProvider theme={theme}>{<Router />}</ThemeProvider>;
}

export default App;
