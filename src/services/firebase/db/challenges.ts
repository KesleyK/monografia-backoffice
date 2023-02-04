import { DocumentSnapshot, DocumentData, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { IChallenge } from "../../../models/IChallenge";

export default class ChallengesCollection {
    private static readonly collectionName = "challenges";
    private static readonly ref = collection(db, this.collectionName);

    static get(id: string): Promise<DocumentSnapshot<DocumentData>> {
        return getDoc(doc(db, this.collectionName, id));
    }

    static async post(data: IChallenge) {
        const newChallenge = doc(this.ref);
        await setDoc(newChallenge, data);

        return newChallenge.id;
    }

    static async populateIds(ids: string[]): Promise<DocumentSnapshot<DocumentData>[]> {
        return (await Promise.all(ids.map((id) => getDoc(doc(this.ref, id))))).filter((doc) => doc.exists());
    }

    static convert(firestoreSnapshot: DocumentSnapshot<DocumentData>): IChallenge {
        const firestoreData = firestoreSnapshot.data();

        return {
            name: firestoreData.name,
            body: firestoreData.body,
            type: firestoreData.type,
            selection: firestoreData.selection,
            correct: firestoreData.correct,
            points: firestoreData.points
        };
    }
}
