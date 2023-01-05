import { useEffect, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Formik } from "formik";
import { BasicTable } from "../../components";
import { Search as SearchIcon } from "@mui/icons-material";
import { ITeamFormValues, teamInitialValues, teamSchema } from "../../schemas/team";
import { useRequest } from "../../services/firebase/hooks/useRequest";
import { retrieveUserInfo } from "../../services/firebase/auth/retrieveUserInfo";
import { parseCollection } from "../../helpers/collectionUtils";
import TeamCollection from "../../services/firebase/db/team";
import styles from "./styles";

export function AddingTeams() {
    const [teams, setTeams] = useState([]);
    const { doRequest, loading, responseComponent } = useRequest();

    useEffect(() => {
        retrieveUserInfo().then((user) => {
            TeamCollection.getAll(user.email).then((values) => {
                setTeams(parseCollection(values));
            });
        });
    }, []);

    const onFormSubmit = async (formData: ITeamFormValues) =>
        doRequest({
            handler: async () => {
                const user = await retrieveUserInfo();
                const teamInfo = { name: formData.name, ownerId: user.email };
                const newTeamId = await TeamCollection.post(teamInfo);

                setTeams([...teams, { id: newTeamId, ...teamInfo }]);
            },
            successMessage: "Equipe inserida com sucesso"
        });

    const tableRows = teams.map(({ id, name }) => ({
        key: id,
        columns: [name]
    }));

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
                        <Typography variant="subtitle2" sx={styles.label}>
                            Inserir Nova Equipe
                        </Typography>
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

            <Box sx={styles.card}>
                <Typography variant="subtitle2" sx={styles.label}>
                    Equipes cadastradas
                </Typography>
                <BasicTable
                    labels={["Times"]}
                    rows={tableRows}
                    buttonComponent={Button}
                    buttonProps={{ children: <SearchIcon /> }}
                    onButtonClicked={(key) => console.log(key)}
                />
            </Box>
            {responseComponent}
        </Box>
    );
}
