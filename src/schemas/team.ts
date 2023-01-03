import * as Yup from "yup";

export interface ITeamFormValues {
    name: string;
}

export const teamSchema = Yup.object().shape({
    name: Yup.string().min(3, "Nome muito curto").required("Obrigatório*")
});

export const teamInitialValues: ITeamFormValues = { name: "" };
