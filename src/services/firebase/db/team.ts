import { collection, getDocs, setDoc, doc, query, where, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { IParticipant } from "../../../models/IParticipant";
import { ITeam } from "../../../models/ITeam";

export default abstract class TeamCollection {
    private static collectionName = "teams";

    static async getAll(ownerId: string) {
        const ref = collection(db, this.collectionName);
        const docsQuery = query(ref, where("ownerId", "==", ownerId));

        return getDocs(docsQuery);
    }

    static async post(teamInfo: ITeam): Promise<string> {
        const newTeam = doc(collection(db, this.collectionName));
        await setDoc(newTeam, teamInfo);

        return newTeam.id;
    }

    static insertParticipant(id: string, participant: IParticipant) {
        return updateDoc(doc(collection(db, this.collectionName), id), {
            participants: arrayUnion(participant)
        });
    }

    static deleteParticipant(id: string, participant: IParticipant) {
        return updateDoc(doc(collection(db, this.collectionName), id), {
            participants: arrayRemove(participant)
        });
    }
}
