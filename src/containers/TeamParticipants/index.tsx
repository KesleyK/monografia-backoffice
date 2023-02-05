import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Formik } from "formik";
import { Box, Typography, TextField, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Delete as DeleteIcon, Undo as UndoIcon } from "@mui/icons-material";
import { BasicModal, BasicTable } from "../../components";
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
    const [loadingTable, setLoadingTable] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [participantId, setParticipantId] = useState(null);
    const [participantData, setParticipantData] = useState(null);
    const { doRequest, loading, responseComponent } = useRequest();

    useEffect(() => {
        const fetchData = async () => {
            const fetchedTeam = TeamsCollection.convert(await TeamsCollection.get(team.id));
            const fetchedParticipants = await ParticipantsCollection.populateIds(fetchedTeam.participants);
            setParticipants(parseCollection(fetchedParticipants).sort(byPointsDesc));
            setLoadingTable(false);
        };

        fetchData();
    }, [team.id]);

    const onToggleModal = (participantId: string, participantData: IParticipant) => {
        setParticipantId(participantId);
        setParticipantData(participantData);
        setModalOpen(!modalOpen);
    };

    const onChangingUserStatus = async () =>
        doRequest({
            handler: async () => {
                let updatedStatus = ParticipantStatus.PENDING;
                if (participantData.status !== ParticipantStatus.DISABLED) {
                    updatedStatus = ParticipantStatus.DISABLED;
                }

                participantData.status = updatedStatus;
                await ParticipantsCollection.put(participantId, participantData);

                const updatedParticipants = [...participants];
                const participantIndex = participants.findIndex((participant) => participant.id === participantId);
                updatedParticipants[participantIndex] = participantData;
                setParticipants(updatedParticipants);
                setModalOpen(false);
            },
            successMessage: "Usuário alterado com sucesso."
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
        buttonComponent: Button,
        buttonProps: { children: participant.status !== ParticipantStatus.DISABLED ? <DeleteIcon /> : <UndoIcon /> }
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
                    onButtonClicked={onToggleModal}
                    loading={loadingTable}
                />
            </Box>

            <BasicModal open={modalOpen} toggleModal={onToggleModal}>
                <Typography>Deseja prosseguir com a ação?</Typography>
                <LoadingButton
                    loading={loading}
                    variant="contained"
                    sx={styles.modalButton}
                    onClick={onChangingUserStatus}
                >
                    Continuar
                </LoadingButton>
            </BasicModal>

            {responseComponent}
        </Box>
    );
}
