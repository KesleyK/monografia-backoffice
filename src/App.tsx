import { ThemeProvider } from "@mui/material";
import { router } from "./router/router";
import theme from "./styles/theme";

function App() {
    return <ThemeProvider theme={theme}>{router}</ThemeProvider>;
}

export default App;
