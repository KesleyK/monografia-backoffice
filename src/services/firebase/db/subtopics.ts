import {
    DocumentSnapshot,
    DocumentData,
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    arrayUnion
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import { ISubtopic } from "../../../models/ISubtopic";

export default class SubtopicsCollection {
    private static readonly collectionName = "subtopics";
    private static readonly ref = collection(db, this.collectionName);

    static async post(data: ISubtopic) {
        const newSubtopic = doc(this.ref);
        await setDoc(newSubtopic, data);

        return newSubtopic.id;
    }

    static async populateIds(ids: string[]): Promise<DocumentSnapshot<DocumentData>[]> {
        return (await Promise.all(ids.map((id) => getDoc(doc(this.ref, id))))).filter((doc) => doc.exists());
    }

    static insertChallenge(id: string, challengeId: string) {
        return updateDoc(doc(collection(db, this.collectionName), id), {
            challenges: arrayUnion(challengeId)
        });
    }
}
