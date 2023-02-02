import { Box, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { SimpleBarChart } from "../../components/SimpleBarChart";
import { parseCollection } from "../../helpers/collectionUtils";
import { retrieveUserInfo } from "../../services/firebase/auth/retrieveUserInfo";
import ChallengeReportsCollection from "../../services/firebase/db/challengeReports";
import ChallengesCollection from "../../services/firebase/db/challenges";
import ParticipantsCollection from "../../services/firebase/db/participants";
import SubtopicsCollection from "../../services/firebase/db/subtopics";
import TeamsCollection from "../../services/firebase/db/teams";
import TopicsCollection from "../../services/firebase/db/topics";
import styles from "./styles";

export function Home() {
    const [teams, setTeams] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [topics, setTopics] = useState([]);
    const [subtopics, setSubtopics] = useState([]);
    const [challenges, setChallenges] = useState([]);
    const [challengeReports, setChallengeReports] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const user = await retrieveUserInfo();

            const fetchedTeams = parseCollection(await TeamsCollection.getAll(user.email));

            const fetchedTopics = [];
            const fetchedParticipants = [];
            for (const team of fetchedTeams) {
                parseCollection(await TopicsCollection.populateIds(team.topics)).forEach((topic) =>
                    fetchedTopics.push(topic)
                );

                parseCollection(await ParticipantsCollection.populateIds(team.participants)).forEach((participant) =>
                    fetchedParticipants.push(participant)
                );
            }

            const fetchedSubtopics = [];
            for (const topic of fetchedTopics) {
                parseCollection(await SubtopicsCollection.populateIds(topic.subtopics)).forEach((subtopic) =>
                    fetchedSubtopics.push(subtopic)
                );
            }

            const fetchedChallenges = [];
            for (const subtopic of fetchedSubtopics) {
                parseCollection(await ChallengesCollection.populateIds(subtopic.challenges)).forEach((challenge) =>
                    fetchedChallenges.push(challenge)
                );
            }

            const fetchedChallengesReports = [];
            for (const challenge of fetchedChallenges) {
                parseCollection(await ChallengeReportsCollection.findByChallenge(challenge.id)).forEach(
                    (challengeReport) => fetchedChallengesReports.push(challengeReport)
                );
            }

            setTeams(fetchedTeams);
            setParticipants(fetchedParticipants);
            setTopics(fetchedTopics);
            setSubtopics(fetchedSubtopics);
            setChallenges(fetchedChallenges);
            setChallengeReports(fetchedChallengesReports);
        };

        fetchData();
    }, []);

    const labels = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ];
    const currentDate = new Date();
    const correctAnswers = Array(12).fill(0);
    const wrongAnswers = Array(12).fill(0);

    for (const report of challengeReports) {
        const answerDate = report.createdAt ? new Date(report.createdAt) : currentDate;
        const answerMonth = answerDate.getMonth();

        if (answerDate.getFullYear() === currentDate.getFullYear()) {
            if (report.answeredCorrectly) {
                correctAnswers[answerMonth] += 1;
            } else {
                wrongAnswers[answerMonth] += 1;
            }
        }
    }

    const chartData = {
        labels,
        datasets: [
            {
                label: "Acertos",
                data: correctAnswers,
                backgroundColor: "rgba(53, 162, 235, 0.5)"
            },
            {
                label: "Erros",
                data: wrongAnswers,
                backgroundColor: "rgba(255, 99, 132, 0.5)"
            }
        ]
    };

    return (
        <Box sx={styles.container}>
            <Grid container spacing={10} sx={styles.gridContainer}>
                <Grid item xs={4}>
                    <Paper elevation={1} sx={{ ...styles.card, backgroundColor: "#BAD7EE" }}>
                        <Typography variant="h3">{teams.length}</Typography>
                        <Typography variant="h6">Times</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper elevation={1} sx={{ ...styles.card, backgroundColor: "#D4EAEF" }}>
                        <Typography variant="h3">{participants.length}</Typography>
                        <Typography variant="h6">Participantes</Typography>
                    </Paper>
                </Grid>

                <Grid item xs={4}>
                    <Paper elevation={1} sx={{ ...styles.card, backgroundColor: "#D4EFE3" }}>
                        <Typography variant="h3">{topics.length}</Typography>
                        <Typography variant="h6">Tópicos</Typography>
                    </Paper>
                </Grid>

                <Grid item xs={4}>
                    <Paper elevation={1} sx={{ ...styles.card, backgroundColor: "#EFD4EE" }}>
                        <Typography variant="h3">{subtopics.length}</Typography>
                        <Typography variant="h6">Subtópicos</Typography>
                    </Paper>
                </Grid>

                <Grid item xs={4}>
                    <Paper elevation={1} sx={{ ...styles.card, backgroundColor: "#DFD4EF" }}>
                        <Typography variant="h3">{challenges.length}</Typography>
                        <Typography variant="h6">Desafios</Typography>
                    </Paper>
                </Grid>

                <Grid item xs={4}>
                    <Paper elevation={1} sx={{ ...styles.card, backgroundColor: "#EFE4D4" }}>
                        <Typography variant="h3">{challengeReports.length}</Typography>
                        <Typography variant="h6">Desafios respondidos</Typography>
                    </Paper>
                </Grid>
            </Grid>

            <SimpleBarChart data={chartData} />
        </Box>
    );
}
