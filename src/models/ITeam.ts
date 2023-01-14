import { IParticipant } from "./IParticipant";

export interface ITeam {
    name: string;
    ownerId: string;
    participants: Array<IParticipant>;
    topics: Array<string>;
}
