export interface IChallengeReport {
    userId: string;
    challengeId: string;
    answer: string[];
    answeredCorrectly: boolean;
}