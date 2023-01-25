import { ISubtopic } from "./ISubtopic";

export interface ITopic {
    name: string;
    icon: string;
    isSequential?: boolean;
    subtopics: ISubtopic[];
}
