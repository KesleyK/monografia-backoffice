import { Box, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
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

    return (
        <Box sx={styles.container}>
            <Grid container spacing={10}>
                <Grid item xs={4}>
                    <Paper elevation={3} sx={styles.card}>
                        <Typography>{teams.length}</Typography>
                        <Typography>Times</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper elevation={3} sx={styles.card}>
                        <Typography>{participants.length}</Typography>
                        <Typography>Participantes</Typography>
                    </Paper>
                </Grid>

                <Grid item xs={4}>
                    <Paper elevation={3} sx={styles.card}>
                        <Typography>{topics.length}</Typography>
                        <Typography>Tópicos</Typography>
                    </Paper>
                </Grid>

                <Grid item xs={4}>
                    <Paper elevation={3} sx={styles.card}>
                        <Typography>{subtopics.length}</Typography>
                        <Typography>Subtópico</Typography>
                    </Paper>
                </Grid>

                <Grid item xs={4}>
                    <Paper elevation={3} sx={styles.card}>
                        <Typography>{challenges.length}</Typography>
                        <Typography>Desafios</Typography>
                    </Paper>
                </Grid>

                <Grid item xs={4}>
                    <Paper elevation={3} sx={styles.card}>
                        <Typography>{challengeReports.length}</Typography>
                        <Typography>Desafios respondidos</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
