import {
    collection,
    doc,
    DocumentData,
    DocumentSnapshot,
    getDoc,
    getDocs,
    QuerySnapshot,
    setDoc,
    updateDoc,
    arrayUnion
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import { IUser } from "../../../models/IUser";

export default abstract class UsersCollection {
    private static collectionName = "users";

    static get(id: string): Promise<DocumentSnapshot<DocumentData>> {
        return getDoc(doc(db, this.collectionName, id));
    }

    static getAll(): Promise<QuerySnapshot<DocumentData>> {
        return getDocs(collection(db, this.collectionName));
    }

    static post(id: string, userInfo: IUser): Promise<void> {
        return setDoc(doc(collection(db, this.collectionName), id), userInfo);
    }

    static put(id: string, userInfo: IUser): Promise<void> {
        return setDoc(doc(collection(db, this.collectionName), id), userInfo, { merge: true });
    }

    static insertTeam(id: string, teamId: string) {
        return updateDoc(doc(collection(db, this.collectionName), id), {
            participants: arrayUnion(teamId)
        });
    }

    static convert(firestoreSnapshot: DocumentSnapshot<DocumentData>): IUser {
        const firestoreData = firestoreSnapshot.data();

        return {
            name: firestoreData.name,
            email: firestoreData.email,
            educationalInstitution: firestoreData.educationalInstitution,
            points: firestoreData.points
        };
    }
}
