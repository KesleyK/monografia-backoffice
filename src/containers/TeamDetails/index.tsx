import { BasicTabs } from "../../components";
import { TeamParticipants } from "../TeamParticipants";
import { TeamTopics } from "../TeamTopics";

export function TeamDetails() {
    return <BasicTabs labels={["Participantes", "Tópicos"]} components={[<TeamParticipants />, <TeamTopics />]} />;
}
