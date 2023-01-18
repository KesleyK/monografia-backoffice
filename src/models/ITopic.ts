export interface ITopic {
    name: string;
    icon: string;
    teamId?: string;
    subtopics: {
        name: string;
        description: string;
        challenges: string[];
    }[];
}
