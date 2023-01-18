import { IParticipant } from "./IParticipant";

export interface ITeam {
    name: string;
    ownerId: string;
    description: string;
    participants: IParticipant[];
    topics: string[];
}
