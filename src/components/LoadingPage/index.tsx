import { Box, CircularProgress } from "@mui/material";

import styles from "./styles";

function LoadingPage() {
    return (
        <Box sx={styles.container}>
            <CircularProgress sx={styles.progess} size={60} thickness={5} />
        </Box>
    );
}

export { LoadingPage };
