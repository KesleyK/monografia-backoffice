import { Box, Paper, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { retrieveUserInfo } from "../../services/firebase/auth/retrieveUserInfo";
import { useRequest } from "../../services/firebase/hooks/useRequest";
import { updateUserProfile } from "../../services/firebase/auth/updateUserProfile";
import { reauthenticate, resetPassword } from "../../services/firebase/auth/resetPassword";
import { LoadingButton } from "@mui/lab";
import {
    IEditProfileFormValues,
    IEditPasswordFormValues,
    editProfileSchema,
    buildEditProfileInitialValues,
    editPasswordSchema,
    editPasswordInitialValues
} from "../../schemas/profile";

export function Profile() {
    const [user, setUser] = useState(null);
    const [editProfileLoading, setEditProfileLoading] = useState(false);
    const [editPasswordLoading, setEditPasswordLoading] = useState(false);
    const { doRequest, responseComponent } = useRequest();

    useEffect(() => {
        retrieveUserInfo().then((fetchedUser) => {
            setUser(fetchedUser);
        });
    }, []);

    const onEditProfileFormSubmitted = async (formData: IEditProfileFormValues) => {
        doRequest({
            handler: async () => {
                setEditProfileLoading(true);
                await updateUserProfile(formData);
            },
            successMessage: "Dados alterados com sucesso.",
            onFinally: () => setEditProfileLoading(false)
        });
    };

    const onEditPasswordFormSubmitted = async (formData: IEditPasswordFormValues) => {
        doRequest({
            handler: async () => {
                setEditPasswordLoading(true);
                await reauthenticate(formData.currentPassword);
                await resetPassword(formData.password);
            },
            successMessage: "Dados alterados com sucesso.",
            onFinally: () => setEditPasswordLoading(false)
        });
    };

    return (
        <Box>
            <Paper elevation={3}>
                {user && (
                    <Formik
                        initialValues={buildEditProfileInitialValues(user)}
                        onSubmit={onEditProfileFormSubmitted}
                        validationSchema={editProfileSchema}
                    >
                        {({ handleChange, handleSubmit, values, errors }) => (
                            <Box sx={{ padding: 5 }}>
                                <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                    Perfil do Usuário
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
                                    error={!!errors.email}
                                    helperText={errors.email ?? " "}
                                    disabled={true}
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

                                <LoadingButton
                                    loading={editProfileLoading}
                                    sx={{ marginTop: 3 }}
                                    variant="contained"
                                    onClick={() => handleSubmit()}
                                >
                                    Alterar Dados
                                </LoadingButton>
                            </Box>
                        )}
                    </Formik>
                )}
            </Paper>

            <Paper elevation={3} sx={{ marginTop: 3 }}>
                {user && (
                    <Formik
                        initialValues={editPasswordInitialValues}
                        onSubmit={onEditPasswordFormSubmitted}
                        validationSchema={editPasswordSchema}
                        validateOnChange={false}
                    >
                        {({ handleChange, handleSubmit, values, errors }) => (
                            <Box sx={{ padding: 5 }}>
                                <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                    Editar Senha
                                </Typography>
                                <TextField
                                    fullWidth
                                    label="Senha Atual"
                                    variant="outlined"
                                    type="password"
                                    value={values.currentPassword}
                                    onChange={handleChange("currentPassword")}
                                    error={!!errors.currentPassword}
                                    helperText={errors.currentPassword ?? " "}
                                />
                                <TextField
                                    fullWidth
                                    label="Nova Senha"
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
                                    loading={editPasswordLoading}
                                    sx={{ marginTop: 3 }}
                                    variant="contained"
                                    onClick={() => handleSubmit()}
                                >
                                    Alterar Senha
                                </LoadingButton>
                            </Box>
                        )}
                    </Formik>
                )}
            </Paper>

            {responseComponent}
        </Box>
    );
}
