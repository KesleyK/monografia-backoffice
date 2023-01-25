import * as Yup from "yup";

export interface ISubtopicFormValues {
    name: string;
    description: string;
    challenges: [];
}

export const subtopicSchema = Yup.object().shape({
    name: Yup.string().min(3, "Nome muito curto").required("Obrigatório*"),
    description: Yup.string().min(3, "Descrição muito curta").required("Obrigatório*")
});

export const subtopicInitialValues: ISubtopicFormValues = { name: "", description: "", challenges: [] };
