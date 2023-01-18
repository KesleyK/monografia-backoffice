import { ParticipantStatus } from "./enum/ParticipantStatus";

export interface IParticipant {
    userId: string;
    teamId: string;
    points: number;
    status: ParticipantStatus;
}
