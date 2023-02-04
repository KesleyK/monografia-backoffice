import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { Box, Typography, TextField, FormGroup, FormControlLabel, Switch, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Search as SearchIcon } from "@mui/icons-material";
import { BasicTable } from "../../components";
import { ITopicFormValues, topicSchema, topicInitialValues } from "../../schemas/topic";
import { useRequest } from "../../services/firebase/hooks/useRequest";
import { parseCollection } from "../../helpers/collectionUtils";
import TopicsCollection from "../../services/firebase/db/topics";
import TeamsCollection from "../../services/firebase/db/teams";
import styles from "./styles";

export function TeamTopics() {
    const navigate = useNavigate();
    const location = useLocation();
    const team = location.state;
    const [topics, setTopics] = useState([]);
    const [loadingTable, setLoadingTable] = useState(true);
    const { doRequest, loading, responseComponent } = useRequest();

    useEffect(() => {
        const fetchData = async () => {
            const fetchedTeam = TeamsCollection.convert(await TeamsCollection.get(team.id));
            const fetchedTopics = await TopicsCollection.populateIds(fetchedTeam.topics);
            setTopics(parseCollection(fetchedTopics));
            setLoadingTable(false);
        };

        fetchData();
    }, [team.id]);

    const onFormSubmitted = async (formData: ITopicFormValues) =>
        doRequest({
            handler: async () => {
                const newTopicId = await TopicsCollection.post(formData);
                await TeamsCollection.insertTopic(team.id, newTopicId);

                const newTopic = { ...formData, id: newTopicId };
                const updatedTopics = [...topics, newTopic];
                setTopics(updatedTopics);
            },
            successMessage: "Tópico adicionado com sucesso."
        });

    const tableRows = topics.map((topic) => ({
        key: topic.id,
        columns: [topic.name, topic.icon, topic.isSequential ? "Sim" : "Não", topic.subtopics.length],
        rowData: topic,
        buttonComponent: Button,
        buttonProps: { children: <SearchIcon /> }
    }));

    return (
        <Box sx={styles.container}>
            <Typography sx={styles.label} variant="h5">
                {team.name}
            </Typography>
            <Box sx={styles.card}>
                <Typography sx={styles.label} variant="h6">
                    Tópicos
                </Typography>

                <Formik
                    initialValues={topicInitialValues}
                    validationSchema={topicSchema}
                    validateOnChange={false}
                    onSubmit={(values) => onFormSubmitted(values)}
                >
                    {({ handleChange, handleSubmit, values, errors }) => (
                        <Box sx={styles.card}>
                            <Typography sx={styles.label} variant="subtitle2">
                                Inserir Novo Tópico
                            </Typography>
                            <TextField
                                fullWidth
                                label="Nome do Tópico"
                                variant="outlined"
                                value={values.name}
                                onChange={handleChange("name")}
                                error={!!errors.name}
                                helperText={errors.name ?? " "}
                            />
                            <TextField
                                fullWidth
                                label="Nome do Ícone"
                                variant="outlined"
                                value={values.icon}
                                onChange={handleChange("icon")}
                                error={!!errors.icon}
                                helperText={errors.icon ?? " "}
                            />

                            <Box>
                                <a
                                    href="https://oblador.github.io/react-native-vector-icons"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Ver lista completa de ícones (apenas MaterialCommunityIcons) &rarr;
                                </a>
                            </Box>

                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Switch checked={values.isSequential} onChange={handleChange("isSequential")} />
                                    }
                                    label="Habilitar trilha de aprendizado"
                                />
                            </FormGroup>

                            <LoadingButton loading={loading} variant="contained" onClick={() => handleSubmit()}>
                                Adicionar
                            </LoadingButton>
                        </Box>
                    )}
                </Formik>

                <BasicTable
                    labels={["Tópico", "Ícone", "Trilha de aprendizado?", "Subtópicos"]}
                    rows={tableRows}
                    onButtonClicked={(_, rowData) => navigate("/times/topicos", { state: { topic: rowData, team } })}
                    loading={loadingTable}
                />
            </Box>

            {responseComponent}
        </Box>
    );
}
