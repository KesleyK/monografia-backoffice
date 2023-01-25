import {
    DocumentData,
    DocumentSnapshot,
    QuerySnapshot,
    collection,
    arrayUnion,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import { ISubtopic } from "../../../models/ISubtopic";
import { ITopic } from "../../../models/ITopic";

export default class TopicsCollection {
    private static readonly collectionName = "topics";
    private static readonly ref = collection(db, this.collectionName);

    static get(id: string = null): Promise<DocumentSnapshot<DocumentData>> {
        return getDoc(doc(this.ref, id));
    }

    static getAll(): Promise<QuerySnapshot<DocumentData>> {
        return getDocs(this.ref);
    }

    static async populateIds(ids: string[]): Promise<DocumentSnapshot<DocumentData>[]> {
        return (await Promise.all(ids.map((id) => getDoc(doc(this.ref, id))))).filter((doc) => doc.exists());
    }

    static async post(data: ITopic) {
        const newTopic = doc(collection(db, this.collectionName));
        await setDoc(newTopic, data);

        return newTopic.id;
    }

    static insertSubtopic(id: string, subtopicId: string) {
        return updateDoc(doc(this.ref, id), {
            subtopics: arrayUnion(subtopicId)
        });
    }
}
