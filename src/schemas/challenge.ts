import * as Yup from "yup";
import { ChallengeType } from "../models/enum/ChallengeType";

export interface IChallengeFormValues {
    name: string;
    body: string;
    feedback: string;
    type: ChallengeType;
    selection?: string[];
    correct: string[];
    points: number;
}

export const challengeSchema = Yup.object().shape({
    name: Yup.string().min(3, "Nome muito curto").required("Obrigatório*"),
    type: Yup.number().required("Obrigatório"),
    selection: Yup.array().of(Yup.string()),
    correct: Yup.array().of(Yup.string()).required("Obrigatório"),
    points: Yup.number()
        .min(0, "Apenas números positivos ou zero")
        .max(100, "Máximo de 100 pontos")
        .required("Obrigatório")
});

export const challengeInitialValues: IChallengeFormValues = {
    name: "",
    body: "**Descrição do desafio**",
    type: ChallengeType.INPUT,
    feedback: "",
    correct: [],
    points: 0
};
