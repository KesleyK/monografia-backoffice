import * as Yup from "yup";

export interface ITopicFormValues {
    name: string;
    icon: string;
}

export const topicSchema = Yup.object().shape({
    name: Yup.string().min(3, "Nome muito curto").required("Obrigatório*"),
    icon: Yup.string().required("Obrigatório*")
});

export const topicInitialValues: ITopicFormValues = { name: "", icon: "" };
