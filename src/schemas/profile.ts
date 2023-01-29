import * as Yup from "yup";

export interface IEditProfileFormValues {
    name: string;
    email: string;
    educationalInstitution: string;
}

export const editProfileSchema = Yup.object().shape({
    name: Yup.string().min(3, "Digite seu nome completo").required("Obrigatório*"),
    email: Yup.string().email("Email inválido").required("Obrigatório*"),
    educationalInstitution: Yup.string().min(3, "Digite o nome completo da instituição").required("Obrigatório*")
});

export const buildEditProfileInitialValues = (user): IEditProfileFormValues => ({
    name: user.name ?? "",
    email: user.email ?? "",
    educationalInstitution: user.educationalInstitution ?? ""
});

export interface IEditPasswordFormValues {
    currentPassword: string;
    password: string;
    passwordConfirmation: string;
}

export const editPasswordSchema = Yup.object().shape({
    currentPassword: Yup.string().min(6, "Senha inválida").required("Obrigatório*"),
    password: Yup.string().min(6, "Senha muito curta").required("Obrigatório*"),
    passwordConfirmation: Yup.string()
        .oneOf([Yup.ref("password")], "Senhas precisam coincidir")
        .required("Obrigatório*")
});

export const editPasswordInitialValues: IEditPasswordFormValues = {
    currentPassword: "",
    password: "",
    passwordConfirmation: ""
};
