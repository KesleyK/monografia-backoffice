import * as Yup from "yup";
import { ParticipantStatus } from "../models/enum/ParticipantStatus";

export interface IParticipantFormValues {
    email: string;
    points: number;
    status: ParticipantStatus;
}

export const participantSchema = Yup.object().shape({
    email: Yup.string().email("Email inválido").required("Obrigatório*")
});

export const participantInitialValues: IParticipantFormValues = {
    email: "",
    points: 0,
    status: ParticipantStatus.PENDING
};
