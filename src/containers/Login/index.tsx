import { Box, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Formik } from "formik";
import { ILoginFormValues, loginInitialValues, loginSchema } from "../../schemas/login";
import { signinUser } from "../../services/firebase/auth/signinUser";
import { useRequest } from "../../services/firebase/hooks/useRequest";
import { useNavigate } from "react-router-dom";
import styles from "./styles";

export function Login() {
    const navigate = useNavigate();
    const { doRequest, loading, responseComponent } = useRequest();
    const onFormSubmit = async (formData: ILoginFormValues) =>
        doRequest({
            handler: async () => await signinUser(formData.email, formData.password),
            onSuccess: () => navigate("/")
        });

    return (
        <Box sx={styles.container}>
            <Formik
                initialValues={loginInitialValues}
                validationSchema={loginSchema}
                validateOnChange={false}
                onSubmit={(values) => onFormSubmit(values)}
            >
                {({ handleChange, handleSubmit, values, errors }) => (
                    <Box sx={styles.card}>
                        <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                            Login
                        </Typography>
                        <TextField
                            fullWidth
                            label="E-mail"
                            variant="outlined"
                            value={values.email}
                            onChange={handleChange("email")}
                            error={!!errors.email}
                            helperText={errors.email ?? " "}
                        />
                        <TextField
                            fullWidth
                            label="Senha"
                            variant="outlined"
                            type="password"
                            value={values.password}
                            onChange={handleChange("password")}
                            error={!!errors.password}
                            helperText={errors.password ?? " "}
                        />

                        <LoadingButton
                            loading={loading}
                            sx={styles.button}
                            variant="contained"
                            fullWidth
                            onClick={() => handleSubmit()}
                        >
                            Confirmar
                        </LoadingButton>
                    </Box>
                )}
            </Formik>

            {responseComponent}
        </Box>
    );
}
