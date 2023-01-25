import { DocumentSnapshot, DocumentData, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { IChallenge } from "../../../models/IChallenge";

export default class ChallengesCollection {
    private static readonly collectionName = "challenges";
    private static readonly ref = collection(db, this.collectionName);

    static async post(data: IChallenge) {
        const newChallenge = doc(this.ref);
        await setDoc(newChallenge, data);

        return newChallenge.id;
    }

    static async populateIds(ids: string[]): Promise<DocumentSnapshot<DocumentData>[]> {
        return (await Promise.all(ids.map((id) => getDoc(doc(this.ref, id))))).filter((doc) => doc.exists());
    }
}
