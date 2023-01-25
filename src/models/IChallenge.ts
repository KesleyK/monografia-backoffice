import { ChallengeType } from "./enum/ChallengeType";

export interface IChallenge {
    name: string;
    body: string;
    type: ChallengeType;
    selection?: string[];
    correct: string[];
    points: number;
}
