import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BasicTable } from "../../components";
import { parseCollection } from "../../helpers/collectionUtils";
import ChallengeReportsCollection from "../../services/firebase/db/challengeReports";

import styles from "./styles";

export function ChallengeDetails() {
    const location = useLocation();
    const { challenge } = location.state;
    const [reports, setReports] = useState([]);

    useEffect(() => {
        ChallengeReportsCollection.findByChallenge(challenge.id).then((result) => {
            setReports(parseCollection(result));
        });
    }, [challenge.id]);

    const tableRows = reports.map((report) => ({
        key: report.id,
        columns: [report.userId, report.answeredCorrectly ? "Correta" : "Errada"],
        rowData: report
    }));

    const answeredCorrectlyQnt = reports.filter((report) => report.answeredCorrectly).length;
    const answeredWronglyQnt = reports.length - answeredCorrectlyQnt;

    return (
        <Box sx={styles.container}>
            <Box sx={styles.card}>
                <Typography sx={styles.label} variant="h6">
                    Desafios
                </Typography>

                <Typography sx={styles.label} variant="body2" color="green">
                    Acertos: {answeredCorrectlyQnt}
                </Typography>

                <Typography sx={styles.label} variant="body2" color="error">
                    Erros: {answeredWronglyQnt}
                </Typography>

                <BasicTable labels={["Usuário", "Resposta"]} rows={tableRows} />
            </Box>
        </Box>
    );
}
