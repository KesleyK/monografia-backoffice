import {
    collection,
    doc,
    DocumentData,
    DocumentSnapshot,
    getDoc,
    getDocs,
    query,
    QuerySnapshot,
    setDoc,
    where
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import { parseCollection } from "../../../helpers/collectionUtils";
import { IChallengeReport } from "../../../models/IChallengeReport";
import { ITopic } from "../../../models/ITopic";
import SubtopicsCollection from "./subtopics";

export default class ChallengeReportsCollection {
    private static readonly collectionName = "challengeReports";
    private static readonly ref = collection(db, this.collectionName);

    static async findByChallenge(challengeId: string) {
        const docsQuery = query(this.ref, where("challengeId", "==", challengeId));
        return getDocs(docsQuery);
    }
}
