import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Formik } from "formik";
import { Box, Typography, TextField, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { BasicTable } from "../../components";
import { IParticipantFormValues, participantInitialValues, participantSchema } from "../../schemas/participant";
import { useRequest } from "../../services/firebase/hooks/useRequest";
import { CustomError } from "../../helpers/customError";
import { IParticipant } from "../../models/IParticipant";
import { ParticipantStatus, TranslatedParticipantStatus } from "../../models/enum/ParticipantStatus";
import { parseCollection } from "../../helpers/collectionUtils";
import UsersCollection from "../../services/firebase/db/users";
import TeamsCollection from "../../services/firebase/db/teams";
import ParticipantsCollection from "../../services/firebase/db/participants";

import styles from "./styles";

export function TeamParticipants() {
    const location = useLocation();
    const team = location.state;
    const [participants, setParticipants] = useState([]);
    const { doRequest, loading, responseComponent } = useRequest();

    useEffect(() => {
        ParticipantsCollection.populateIds(team.participants).then((result) =>
            setParticipants(parseCollection(result).sort(byPointsDesc))
        );
    }, [team.participants]);

    const onUserDisabled = async (participantId: string, userData: IParticipant) =>
        doRequest({
            handler: async () => {
                userData.status = ParticipantStatus.DISABLED;
                await ParticipantsCollection.put(participantId, userData);

                const updatedParticipants = [...participants];
                const participantIndex = participants.findIndex((participant) => participant.id === participantId);
                updatedParticipants[participantIndex] = userData;
                setParticipants(updatedParticipants);
            },
            successMessage: "Usuário desativado com sucesso."
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
                    teamId: team.id,
                    status: formData.status,
                    points: formData.points
                };

                const newParticipantId = await ParticipantsCollection.post(userData);
                await TeamsCollection.insertParticipant(team.id, newParticipantId);

                const updatedParticipants = [...participants, { id: newParticipantId, ...userData }];
                setParticipants(updatedParticipants);
            },
            successMessage: "Usuário adicionado com sucesso."
        });

    const byPointsDesc = (a, b) => b.points - a.points;

    const tableRows = participants.map((participant) => ({
        key: participant.id,
        columns: [
            participant.userId,
            TranslatedParticipantStatus[participant.status.toUpperCase()],
            participant.points
        ],
        rowData: participant,
        disabledButton: participant.status === ParticipantStatus.DISABLED
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
                            <Typography sx={styles.label} variant="subtitle2">
                                Inserir Participante
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
                            <LoadingButton loading={loading} variant="contained" onClick={() => handleSubmit()}>
                                Adicionar
                            </LoadingButton>
                        </Box>
                    )}
                </Formik>

                <BasicTable
                    labels={["Participante", "Status", "Pontos"]}
                    rows={tableRows}
                    buttonComponent={Button}
                    buttonProps={{ children: <DeleteIcon /> }}
                    onButtonClicked={onUserDisabled}
                />
            </Box>

            {responseComponent}
        </Box>
    );
}
