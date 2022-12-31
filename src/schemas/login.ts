import * as Yup from "yup";

export interface ILoginFormValues {
    email: string;
    password: string;
}

export const loginSchema = Yup.object().shape({
    email: Yup.string().email("Email inválido").required("Obrigatório*"),
    password: Yup.string().min(6, "Senha inválida").required("Obrigatório*")
});

export const loginInitialValues: ILoginFormValues = { email: "", password: "" };
