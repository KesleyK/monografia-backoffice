import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Formik } from "formik";
import { Box, Typography, TextField, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { BasicTable } from "../../components";
import { IParticipantFormValues, participantInitialValues, participantSchema } from "../../schemas/participant";
import { useRequest } from "../../services/firebase/hooks/useRequest";
import UsersCollection from "../../services/firebase/db/users";
import TeamCollection from "../../services/firebase/db/team";
import { CustomError } from "../../helpers/customError";
import styles from "./styles";
import { IParticipant } from "../../models/IParticipant";

export function TeamInfo() {
    const location = useLocation();
    const team = location.state;
    const [participants, setParticipants] = useState(location.state.participants);
    const { doRequest, loading, responseComponent } = useRequest();

    const onUserDeleted = async (userId: string, userData: IParticipant) =>
        doRequest({
            handler: async () => {
                await TeamCollection.deleteParticipant(team.id, userData);

                const updatedParticipants = participants.filter((participant) => participant.userId !== userId);
                setParticipants(updatedParticipants);
            },
            successMessage: "Usuário deletado com sucesso."
        });

    const onFormSubmitted = async (formData: IParticipantFormValues) =>
        doRequest({
            handler: async () => {
                const customError = new CustomError();

                const userAlreadyRegistered = participants.some(({ userId }) => userId === formData.email);
                if (userAlreadyRegistered) {
                    customError.setCode("default/user-already-registered");
                    throw customError;
                }

                const user = await UsersCollection.get(formData.email);
                if (!user.exists()) {
                    customError.setCode("default/user-not-found");
                    throw customError;
                }

                const userData = {
                    userId: formData.email,
                    invitationStatus: formData.invitationStatus,
                    points: formData.points
                };
                await TeamCollection.insertParticipant(team.id, userData);

                const updatedParticipants = [...participants, userData];
                setParticipants(updatedParticipants);
            },
            successMessage: "Usuário adicionado com sucesso."
        });

    const tableRows = participants.map((participant) => ({
        key: participant.userId,
        columns: [participant.userId, participant.invitationStatus],
        rowData: participant
    }));

    return (
        <Box sx={styles.container}>
            <Typography sx={styles.label} variant="h5">
                {team.name}
            </Typography>
            <Box sx={styles.card}>
                <Typography sx={styles.label} variant="h6">
                    Participantes
                </Typography>

                <Formik
                    initialValues={participantInitialValues}
                    validationSchema={participantSchema}
                    validateOnChange={false}
                    onSubmit={(values) => onFormSubmitted(values)}
                >
                    {({ handleChange, handleSubmit, values, errors }) => (
                        <Box sx={styles.card}>
                            <Typography variant="subtitle2">Inserir Participante</Typography>
                            <TextField
                                fullWidth
                                label="E-mail"
                                variant="outlined"
                                value={values.email}
                                onChange={handleChange("email")}
                                error={!!errors.email}
                                helperText={errors.email ?? " "}
                            />
                            <LoadingButton loading={loading} variant="contained" onClick={() => handleSubmit()}>
                                Adicionar
                            </LoadingButton>
                        </Box>
                    )}
                </Formik>

                <BasicTable
                    labels={["Times", "Status"]}
                    rows={tableRows}
                    buttonComponent={Button}
                    buttonProps={{ children: <DeleteIcon /> }}
                    onButtonClicked={onUserDeleted}
                />

                {responseComponent}
            </Box>
        </Box>
    );
}
