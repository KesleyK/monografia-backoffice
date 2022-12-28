import { Box, Button, TextField, Typography } from "@mui/material";
import styles from "./styles";

export function Register() {
    return (
        <Box sx={styles.container}>
            <Box sx={styles.card}>
                <Typography variant="h6">Login</Typography>

                <TextField
                    sx={styles.input}
                    fullWidth
                    label="E-mail"
                    variant="outlined"
                />
                <TextField
                    sx={styles.input}
                    fullWidth
                    label="Senha"
                    variant="outlined"
                />

                <Button sx={styles.button} variant="contained" fullWidth>
                    Confirmar
                </Button>
            </Box>
        </Box>
    );
}
