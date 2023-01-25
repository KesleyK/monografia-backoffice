import * as Yup from "yup";

export interface ITopicFormValues {
    name: string;
    icon: string;
    isSequential: boolean;
    subtopics: [];
}

export const topicSchema = Yup.object().shape({
    name: Yup.string().min(3, "Nome muito curto").required("Obrigatório*"),
    icon: Yup.string().required("Obrigatório*"),
    isSequential: Yup.boolean()
});

export const topicInitialValues: ITopicFormValues = { name: "", icon: "", isSequential: false, subtopics: [] };
