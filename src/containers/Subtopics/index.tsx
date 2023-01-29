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
    const { doRequest, loading, responseComponent } = useRequest();

    useEffect(() => {
        SubtopicsCollection.populateIds(topic.subtopics).then((result) => setSubtopics(parseCollection(result)));
    }, [topic.subtopics]);

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
                updatedSubtopics.push(formData);
                setSubtopics(updatedSubtopics);
            },
            successMessage: "Subtópico adicionado com sucesso."
        });

    const tableRows = subtopics.map((subtopic, index) => ({
        key: index,
        columns: [subtopic.name, subtopic.challenges.length],
        rowData: subtopic
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
                    buttonComponent={Button}
                    buttonProps={{ children: <SearchIcon /> }}
                    onButtonClicked={(_, subtopic) => navigate("/times/desafios", { state: { topic, team, subtopic } })}
                />
            </Box>

            {responseComponent}
        </Box>
    );
}
