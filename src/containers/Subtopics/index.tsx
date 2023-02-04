import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import { Search as SearchIcon } from "@mui/icons-material";
import { BasicTable } from "../../components";
import { ISubtopicFormValues, subtopicInitialValues, subtopicSchema } from "../../schemas/subtopic";
import { useRequest } from "../../services/firebase/hooks/useRequest";
import { CustomError } from "../../helpers/customError";
import { parseCollection } from "../../helpers/collectionUtils";
import TopicsCollection from "../../services/firebase/db/topics";
import SubtopicsCollection from "../../services/firebase/db/subtopics";

import styles from "./styles";

export function Subtopics() {
    const navigate = useNavigate();
    const location = useLocation();
    const { team, topic } = location.state;
    const [subtopics, setSubtopics] = useState([]);
    const [loadingTable, setLoadingTable] = useState(true);
    const { doRequest, loading, responseComponent } = useRequest();

    useEffect(() => {
        const fetchData = async () => {
            const fetchedTopic = TopicsCollection.convert(await TopicsCollection.get(topic.id));
            const fetchedSubtopics = await SubtopicsCollection.populateIds(fetchedTopic.subtopics);
            setSubtopics(parseCollection(fetchedSubtopics));
            setLoadingTable(false);
        };

        fetchData();
    }, [topic.id]);

    const onFormSubmitted = async (formData: ISubtopicFormValues) =>
        doRequest({
            handler: async () => {
                const customError = new CustomError();

                const subtopicAlreadyExists = subtopics.some(({ name }) => name === formData.name);
                if (subtopicAlreadyExists) {
                    customError.setCode("default/subtopic-already-registered");
                    throw customError;
                }

                const newSubtopicId = await SubtopicsCollection.post(formData);

                await TopicsCollection.insertSubtopic(topic.id, newSubtopicId);

                const updatedSubtopics = [...subtopics];
                updatedSubtopics.push({ ...formData, id: newSubtopicId });
                setSubtopics(updatedSubtopics);
            },
            successMessage: "Subtópico adicionado com sucesso."
        });

    const tableRows = subtopics.map((subtopic, index) => ({
        key: index,
        columns: [subtopic.name, subtopic.challenges.length],
        rowData: subtopic,
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
                    Subtópico
                </Typography>

                <Formik
                    initialValues={subtopicInitialValues}
                    validationSchema={subtopicSchema}
                    validateOnChange={false}
                    onSubmit={(values) => onFormSubmitted(values)}
                >
                    {({ handleChange, handleSubmit, values, errors }) => (
                        <Box sx={styles.card}>
                            <Typography sx={styles.label} variant="subtitle2">
                                Inserir Novo Subtópico
                            </Typography>
                            <TextField
                                fullWidth
                                label="Nome do Subtópico"
                                variant="outlined"
                                value={values.name}
                                onChange={handleChange("name")}
                                error={!!errors.name}
                                helperText={errors.name ?? " "}
                            />
                            <TextField
                                fullWidth
                                label="Descrição do subtópico"
                                variant="outlined"
                                value={values.description}
                                onChange={handleChange("description")}
                                error={!!errors.description}
                                helperText={errors.description ?? " "}
                            />

                            <LoadingButton loading={loading} variant="contained" onClick={() => handleSubmit()}>
                                Adicionar
                            </LoadingButton>
                        </Box>
                    )}
                </Formik>

                <BasicTable
                    labels={["Subtópico", "Desafios"]}
                    rows={tableRows}
                    onButtonClicked={(_, subtopic) => navigate("/times/desafios", { state: { topic, team, subtopic } })}
                    loading={loadingTable}
                />
            </Box>

            {responseComponent}
        </Box>
    );
}
