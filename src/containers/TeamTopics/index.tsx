import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Formik } from "formik";
import { Box, Typography, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { BasicTable } from "../../components";
import { ITopicFormValues, topicSchema, topicInitialValues } from "../../schemas/topic";
import { useRequest } from "../../services/firebase/hooks/useRequest";
import TopicsCollection from "../../services/firebase/db/topics";
import styles from "./styles";
import TeamsCollection from "../../services/firebase/db/teams";
import { parseCollection } from "../../helpers/collectionUtils";

export function TeamTopics() {
    const location = useLocation();
    const team = location.state;
    const [topics, setTopics] = useState([]);
    const { doRequest, loading, responseComponent } = useRequest();

    useEffect(() => {
        TopicsCollection.populateIds(team.topics).then((result) => setTopics(parseCollection(result)));
    }, [team.topics]);

    const onFormSubmitted = async (formData: ITopicFormValues) =>
        doRequest({
            handler: async () => {
                const topicData = { name: formData.name, icon: formData.icon, teamId: team.id, subtopics: [] };
                const newTopicId = await TopicsCollection.post(topicData);
                await TeamsCollection.insertTopic(team.id, newTopicId);

                const newTopic = { ...topicData, id: newTopicId };
                const updatedTopics = [...topics, newTopic];
                setTopics(updatedTopics);
            },
            successMessage: "Usuário adicionado com sucesso."
        });

    const tableRows = topics.map((topic) => ({
        key: topic.id,
        columns: [topic.name, topic.icon],
        rowData: topic
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

                            <LoadingButton loading={loading} variant="contained" onClick={() => handleSubmit()}>
                                Adicionar
                            </LoadingButton>
                        </Box>
                    )}
                </Formik>

                <BasicTable
                    labels={["Tópico", "Ícone"]}
                    rows={tableRows}
                    // buttonComponent={Button}
                    // buttonProps={{ children: <DeleteIcon /> }}
                    // onButtonClicked={onUserDeleted}
                />
            </Box>

            {responseComponent}
        </Box>
    );
}
