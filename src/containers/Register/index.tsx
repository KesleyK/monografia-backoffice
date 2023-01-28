import { Box, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Formik } from "formik";
import { IRegisterFormValues, registerInitialValues, registerSchema } from "../../schemas/register";
import { createUser } from "../../services/firebase/auth/createUser";
import { useRequest } from "../../services/firebase/hooks/useRequest";
import { useNavigate } from "react-router-dom";
import { IUser } from "../../models/IUser";
import styles from "./styles";

export function Register() {
    const navigate = useNavigate();
    const { doRequest, loading, responseComponent } = useRequest();

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
                            Cadastro
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
