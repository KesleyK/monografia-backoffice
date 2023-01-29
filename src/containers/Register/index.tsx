import { useState } from "react";
import { Box, Checkbox, Link, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Formik } from "formik";
import { IRegisterFormValues, registerInitialValues, registerSchema } from "../../schemas/register";
import { createUser } from "../../services/firebase/auth/createUser";
import { useRequest } from "../../services/firebase/hooks/useRequest";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { IUser } from "../../models/IUser";
import styles from "./styles";

export function Register() {
    const navigate = useNavigate();
    const { doRequest, loading, responseComponent } = useRequest();
    const [acceptedPolicies, setAcceptedPolicies] = useState(false);

    const onFormSubmit = async (formData: IRegisterFormValues) => {
        const user = { ...formData };
        delete user.password;
        delete user.passwordConfirmation;

        doRequest({
            handler: async () => await createUser(user as IUser, formData.password),
            onSuccess: () =>
                navigate("/login", {
                    state: { registrationMessage: "Usuário cadastrado com sucesso." }
                })
        });
    };

    const policiesLink = (
        <Link href="https://pedenite.github.io/monografia-pages/" color="secondary.dark" target="_blank">
            Políticas de Privacidade
        </Link>
    );

    return (
        <Box sx={styles.container}>
            <Formik
                initialValues={registerInitialValues}
                validationSchema={registerSchema}
                validateOnChange={false}
                onSubmit={(values) => onFormSubmit(values)}
            >
                {({ handleChange, handleSubmit, values, errors }) => (
                    <Box sx={styles.card}>
                        <Typography variant="h6" sx={{ marginBottom: "10px" }}>
                            Registro
                        </Typography>
                        <TextField
                            fullWidth
                            label="Nome Completo"
                            variant="outlined"
                            value={values.name}
                            onChange={handleChange("name")}
                            error={!!errors.name}
                            helperText={errors.name ?? " "}
                        />
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
                            label="Instituição de Ensino"
                            variant="outlined"
                            value={values.educationalInstitution}
                            onChange={handleChange("educationalInstitution")}
                            error={!!errors.educationalInstitution}
                            helperText={errors.educationalInstitution ?? " "}
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
                        <TextField
                            fullWidth
                            label="Confirmação de Senha"
                            variant="outlined"
                            type="password"
                            value={values.passwordConfirmation}
                            onChange={handleChange("passwordConfirmation")}
                            error={!!errors.passwordConfirmation}
                            helperText={errors.passwordConfirmation ?? " "}
                        />

                        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <Checkbox
                                checked={acceptedPolicies}
                                onClick={() => setAcceptedPolicies(!acceptedPolicies)}
                                color="secondary"
                                inputProps={{ "aria-labelledby": "checkbox-register" }}
                            />
                            <Typography>Confirmo que li e aceito as {policiesLink} do aplicativo.</Typography>
                        </Box>

                        <LoadingButton
                            loading={loading}
                            sx={styles.button}
                            disabled={!acceptedPolicies}
                            variant="contained"
                            fullWidth
                            onClick={() => handleSubmit()}
                        >
                            Cadastrar
                        </LoadingButton>

                        <Typography sx={{ marginTop: 3, fontSize: 12 }}>
                            Já possui uma conta?
                            <Link component={RouterLink} to="/login" color="secondary.dark" sx={{ marginLeft: 0.4 }}>
                                Faça login
                            </Link>
                        </Typography>
                    </Box>
                )}
            </Formik>

            {responseComponent}
        </Box>
    );
}
