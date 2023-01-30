import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    TextField,
    Typography
} from "@mui/material";
import { Formik } from "formik";
import { IChallengeFormValues, challengeSchema, challengeInitialValues } from "../../schemas/challenge";
import { Search as SearchIcon } from "@mui/icons-material";
import { useRequest } from "../../services/firebase/hooks/useRequest";
import { BasicTable, CheckboxList } from "../../components";
import { ChallengeType } from "../../models/enum/ChallengeType";
import { RadioList } from "../../components";
import { CustomError } from "../../helpers/customError";
import { parseCollection } from "../../helpers/collectionUtils";
import ChallengesCollection from "../../services/firebase/db/challenges";
import SubtopicsCollection from "../../services/firebase/db/subtopics";
import MDEditor from "@uiw/react-md-editor";

import styles from "./styles";

export function Challenges() {
    const location = useLocation();
    const navigate = useNavigate();
    const { team, subtopic } = location.state;
    const { doRequest, loading, responseComponent } = useRequest();

    const [challenges, setChallenges] = useState([]);
    const [checkboxItems, setCheckboxItems] = useState(["Resposta 1", "Resposta 2", "Resposta 3"]);
    const [checkboxChecked, setCheckboxChecked] = useState([0, 2]);
    const [radioItems, setRadioItems] = useState(["Resposta 1", "Resposta 2", "Resposta 3"]);
    const [radioChecked, setRadioChecked] = useState([1]);
    const [inputAnswer, setInputAnswer] = useState([""]);

    useEffect(() => {
        ChallengesCollection.populateIds(subtopic.challenges).then((result) => setChallenges(parseCollection(result)));
    }, [subtopic.challenges]);

    const onFormSubmitted = async (formData: IChallengeFormValues) =>
        doRequest({
            handler: async () => {
                const customError = new CustomError();
                const isRadioChallenge = formData.type.toString() === ChallengeType.RADIO.toString();
                const isCheckboxChallenge = formData.type.toString() === ChallengeType.CHECKBOX.toString();

                if (formData.body?.length < 3) {
                    customError.setCode("default/challenge-invalid-body");
                    throw customError;
                }

                if (isRadioChallenge) {
                    formData.selection = [...radioItems];
                    formData.correct = radioChecked.map((checked) => checked.toString());
                } else if (isCheckboxChallenge) {
                    formData.selection = [...checkboxItems];
                    formData.correct = checkboxChecked.map((checked) => checked.toString());
                } else {
                    formData.correct = inputAnswer;
                }

                const [answerExists] = formData.correct;
                if (!answerExists) {
                    customError.setCode("default/challenge-without-answer");
                    throw customError;
                }

                formData.type = parseInt(formData.type.toString());

                const newChallengeId = await ChallengesCollection.post(formData);
                await SubtopicsCollection.insertChallenge(subtopic.id, newChallengeId);

                const updatedChallenges = [...challenges];
                updatedChallenges.push(formData);
                setChallenges(updatedChallenges);
            },
            successMessage: "Desafio adicionado com sucesso."
        });

    const getAnswerComponent = (challengeType: ChallengeType) => {
        const isRadioChallenge = challengeType.toString() === ChallengeType.RADIO.toString();
        const isCheckboxChallenge = challengeType.toString() === ChallengeType.CHECKBOX.toString();

        if (isRadioChallenge) {
            return (
                <RadioList
                    items={radioItems}
                    setItems={setRadioItems}
                    checked={radioChecked}
                    setChecked={setRadioChecked}
                />
            );
        }

        if (isCheckboxChallenge) {
            return (
                <CheckboxList
                    items={checkboxItems}
                    setItems={setCheckboxItems}
                    checked={checkboxChecked}
                    setChecked={setCheckboxChecked}
                />
            );
        }

        return (
            <TextField
                label="Resposta do desafio"
                variant="outlined"
                value={inputAnswer[0]}
                onChange={(e) => setInputAnswer([e.target.value])}
                helperText={" "}
            />
        );
    };

    const tableRows = challenges.map((challenge) => ({
        key: challenge.id,
        columns: [challenge.name, challenge.points, ChallengeType[challenge.type].toLowerCase()],
        rowData: challenge
    }));

    return (
        <Box sx={styles.container}>
            <Typography sx={styles.label} variant="h5">
                {team.name}
            </Typography>
            <Box sx={styles.card}>
                <Typography sx={styles.label} variant="h6">
                    Desafios
                </Typography>

                <Formik
                    initialValues={challengeInitialValues}
                    validationSchema={challengeSchema}
                    validateOnChange={false}
                    onSubmit={(values) => onFormSubmitted(values)}
                >
                    {({ handleChange, handleSubmit, values, errors, initialValues }) => (
                        <Box sx={styles.card}>
                            <Typography sx={styles.label} variant="subtitle2">
                                Inserir Novo Desafio
                            </Typography>

                            <TextField
                                sx={{ marginRight: 3 }}
                                label="Nome do Desafio"
                                inputProps={{ maxLength: 15 }}
                                variant="outlined"
                                value={values.name}
                                onChange={handleChange("name")}
                                error={!!errors.name}
                                helperText={errors.name ?? " "}
                            />

                            <TextField
                                label="Pontos do Desafio"
                                type="number"
                                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                                variant="outlined"
                                value={values.points}
                                onChange={handleChange("points")}
                                error={!!errors.points}
                                helperText={errors.points ?? " "}
                            />

                            <Box>
                                <FormLabel id="demo-radio-buttons-group-label">Descrição do Desafio</FormLabel>
                                <MDEditor
                                    style={styles.texEditor}
                                    value={values.body}
                                    onChange={handleChange("body")}
                                />
                            </Box>

                            <Box>
                                <FormControl>
                                    <FormLabel id="demo-radio-buttons-group-label">Modelo da Resposta</FormLabel>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue={initialValues.type}
                                        name="radio-buttons-group"
                                    >
                                        {Object.keys(ChallengeType)
                                            .filter((x) => !(parseInt(x) >= 0))
                                            .map((key) => (
                                                <FormControlLabel
                                                    key={key}
                                                    value={ChallengeType[key]}
                                                    control={<Radio />}
                                                    onChange={handleChange("type")}
                                                    label={key.toLocaleLowerCase()}
                                                />
                                            ))}
                                    </RadioGroup>
                                </FormControl>
                            </Box>

                            <Box>
                                <FormControl>
                                    <FormLabel id="demo-radio-buttons-group-label">Resposta</FormLabel>
                                    {getAnswerComponent(values.type)}
                                </FormControl>
                            </Box>

                            <Box>
                                <TextField
                                    label="Feedback do Desafio"
                                    variant="outlined"
                                    value={values.feedback}
                                    onChange={handleChange("feedback")}
                                    error={!!errors.feedback}
                                    helperText={errors.feedback ?? " "}
                                    fullWidth
                                    multiline
                                    inputProps={{ maxLength: 200 }}
                                    rows={2}
                                />
                            </Box>

                            <LoadingButton loading={loading} variant="contained" onClick={() => handleSubmit()}>
                                Adicionar
                            </LoadingButton>
                        </Box>
                    )}
                </Formik>

                <BasicTable
                    labels={["Desafio", "Pontos", "Tipo"]}
                    rows={tableRows}
                    buttonComponent={Button}
                    buttonProps={{ children: <SearchIcon /> }}
                    onButtonClicked={(_, challenge) => navigate("/times/desafio/detalhes", { state: { challenge } })}
                />
            </Box>

            {responseComponent}
        </Box>
    );
}
