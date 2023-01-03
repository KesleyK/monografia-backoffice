import { Box, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Formik } from "formik";
import { ITeamFormValues, teamInitialValues, teamSchema } from "../../schemas/team";
import { useRequest } from "../../services/firebase/hooks/useRequest";
import TeamCollection from "../../services/firebase/db/team";
import styles from "./styles";
import { retrieveUserInfo } from "../../services/firebase/auth/retrieveUserInfo";

export function AddingTeams() {
    const { doRequest, loading, responseComponent } = useRequest();

    const onFormSubmit = async (formData: ITeamFormValues) =>
        doRequest({
            handler: async () => {
                const user = await retrieveUserInfo();
                await TeamCollection.post({ name: formData.name, ownerId: user.email });
            },
            successMessage: "Equipe inserida com sucesso"
        });

    return (
        <Box sx={styles.container}>
            <Formik
                initialValues={teamInitialValues}
                validationSchema={teamSchema}
                validateOnChange={false}
                onSubmit={(values) => onFormSubmit(values)}
            >
                {({ handleChange, handleSubmit, values, errors }) => (
                    <Box sx={styles.card}>
                        <Typography variant="subtitle2">Inserir Nova Equipe</Typography>
                        <TextField
                            fullWidth
                            label="Nome da equipe"
                            variant="outlined"
                            type="name"
                            sx={styles.input}
                            value={values.name}
                            onChange={handleChange("name")}
                            error={!!errors.name}
                            helperText={errors.name ?? " "}
                        />
                        <LoadingButton loading={loading} variant="contained" onClick={() => handleSubmit()}>
                            Adicionar
                        </LoadingButton>
                    </Box>
                )}
            </Formik>
            {responseComponent}
        </Box>
    );
}
