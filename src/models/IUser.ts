import { EducationalBackground } from "./enum/EducationalBackground";

export interface IUser {
    name: string;
    email: string;
    educationalInstitution: string;
    educationalBackground?: EducationalBackground;
    birthDate?: Date;
    points: Number;
}
