import { InvitationStatus } from "./enum/InvitationStatus";

export interface IParticipant {
    userId: string;
    points: number;
    invitationStatus: InvitationStatus;
}
