import { DocumentSnapshot, DocumentData, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { IParticipant } from "../../../models/IParticipant";

export default class ParticipantsCollection {
    private static readonly collectionName = "participants";
    private static readonly ref = collection(db, this.collectionName);

    static async post(data: IParticipant) {
        const newParticipant = doc(collection(db, this.collectionName));
        await setDoc(newParticipant, data);

        return newParticipant.id;
    }

    static async populateIds(ids: string[]): Promise<DocumentSnapshot<DocumentData>[]> {
        const ref = collection(db, this.collectionName);
        return (await Promise.all(ids.map((id) => getDoc(doc(ref, id))))).filter((doc) => doc.exists());
    }

    static put(id: string, data: IParticipant): Promise<void> {
        return setDoc(doc(collection(db, this.collectionName), id), data, { merge: true });
    }
}
