import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { Box, Button, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Search as SearchIcon } from "@mui/icons-material";
import { BasicTable } from "../../components";
import { ITeamFormValues, teamInitialValues, teamSchema } from "../../schemas/team";
import { useRequest } from "../../services/firebase/hooks/useRequest";
import { retrieveUserInfo } from "../../services/firebase/auth/retrieveUserInfo";
import { parseCollection } from "../../helpers/collectionUtils";
import TeamsCollection from "../../services/firebase/db/teams";
import styles from "./styles";

export function Teams() {
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const { doRequest, loading, responseComponent } = useRequest();

    useEffect(() => {
        retrieveUserInfo().then((user) => {
            TeamsCollection.getAll(user.email).then((values) => {
                setTeams(parseCollection(values));
            });
        });
    }, []);

    const onFormSubmit = async (formData: ITeamFormValues) =>
        doRequest({
            handler: async () => {
                const user = await retrieveUserInfo();
                const teamInfo = {
                    name: formData.name,
                    ownerId: user.email,
                    description: formData.description,
                    participants: [],
                    topics: []
                };
                const newTeamId = await TeamsCollection.post(teamInfo);

                setTeams([...teams, { id: newTeamId, ...teamInfo }]);
            },
            successMessage: "Time cadastrado com sucesso"
        });

    const tableRows = teams.map((team) => ({
        key: team.id,
        columns: [team.name, team.participants.length, team.topics.length],
        rowData: team
    }));

    return (
        <Box sx={styles.container}>
            <Box sx={styles.card}>
                <Typography variant="subtitle2" sx={styles.label}>
                    Inserir Novo Time
                </Typography>
                <Formik
                    initialValues={teamInitialValues}
                    validationSchema={teamSchema}
                    validateOnChange={false}
                    onSubmit={(values) => onFormSubmit(values)}
                >
                    {({ handleChange, handleSubmit, values, errors }) => (
                        <Box sx={styles.card}>
                            <TextField
                                fullWidth
                                label="Nome do time"
                                variant="outlined"
                                sx={styles.input}
                                value={values.name}
                                onChange={handleChange("name")}
                                error={!!errors.name}
                                helperText={errors.name ?? " "}
                            />
                            <TextField
                                fullWidth
                                label="Descrição"
                                variant="outlined"
                                sx={styles.input}
                                value={values.description}
                                onChange={handleChange("description")}
                                error={!!errors.description}
                                helperText={errors.description ?? " "}
                                multiline
                                rows={4}
                            />
                            <LoadingButton loading={loading} variant="contained" onClick={() => handleSubmit()}>
                                Adicionar
                            </LoadingButton>
                        </Box>
                    )}
                </Formik>

                <Typography variant="subtitle2" sx={styles.label}>
                    Times cadastrados
                </Typography>
                <BasicTable
                    labels={["Time", "Participantes", "Tópicos"]}
                    rows={tableRows}
                    buttonComponent={Button}
                    buttonProps={{ children: <SearchIcon /> }}
                    onButtonClicked={(_, rowData) => navigate("/times/detalhes", { state: rowData })}
                />
            </Box>
            {responseComponent}
        </Box>
    );
}
