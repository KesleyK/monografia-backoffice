import { collection, getDocs, setDoc, doc, query, where } from "firebase/firestore";
import { db } from "../../../config/firebase";
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
}
