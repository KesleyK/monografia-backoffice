import { Box, Typography } from "@mui/material";

import styles from "./styles";

function NotFoundPage() {
    return (
        <Box sx={styles.container}>
            <Typography sx={styles.text}>404 Página não encontrada.</Typography>
        </Box>
    );
}

export { NotFoundPage };
