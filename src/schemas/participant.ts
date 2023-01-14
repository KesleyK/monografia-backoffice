import * as Yup from "yup";
import { InvitationStatus } from "../models/enum/InvitationStatus";

export interface IParticipantFormValues {
    email: string;
    points: number;
    invitationStatus: InvitationStatus;
}

export const participantSchema = Yup.object().shape({
    email: Yup.string().email("Email inválido").required("Obrigatório*")
});

export const participantInitialValues: IParticipantFormValues = {
    email: "",
    points: 0,
    invitationStatus: InvitationStatus.PENDING
};
