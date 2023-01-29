import { Box, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { parseCollection } from "../../helpers/collectionUtils";
import { retrieveUserInfo } from "../../services/firebase/auth/retrieveUserInfo";
import ParticipantsCollection from "../../services/firebase/db/participants";
import TeamsCollection from "../../services/firebase/db/teams";
import TopicsCollection from "../../services/firebase/db/topics";

export function Home() {
    const [teams, setTeams] = useState([]);
    const [topics, setTopics] = useState([]);
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const user = await retrieveUserInfo();

            const fetchedTeams = parseCollection(await TeamsCollection.getAll(user.email));
            setTeams(fetchedTeams);

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

            console.log(fetchedParticipants);

            setTopics(fetchedTopics);
            setParticipants(fetchedParticipants);
        };

        fetchData();
    }, []);

    return (
        <Box>
            <Paper elevation={3}>Times {teams.length}</Paper>
            <Paper elevation={3}>Tópicos {topics.length}</Paper>
            <Paper elevation={3}>Participantes {participants.length}</Paper>
        </Box>
    );
}
