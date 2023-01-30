import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../config/firebase";

export default class ChallengeReportsCollection {
    private static readonly collectionName = "challengeReports";
    private static readonly ref = collection(db, this.collectionName);

    static async findByChallenge(challengeId: string) {
        const docsQuery = query(this.ref, where("challengeId", "==", challengeId));
        return getDocs(docsQuery);
    }
}
