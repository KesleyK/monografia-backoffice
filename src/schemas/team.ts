import * as Yup from "yup";

export interface ITeamFormValues {
    name: string;
    description: string;
}

export const teamSchema = Yup.object().shape({
    name: Yup.string().min(3, "Nome muito curto").required("Obrigatório*"),
    description: Yup.string().min(3, "Descrição muito curta").required("Obrigatório*")
});

export const teamInitialValues: ITeamFormValues = { name: "", description: "" };
