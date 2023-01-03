import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { ITeam } from "../../../models/ITeam";

export default abstract class TeamCollection {
    private static collectionName = "teams";

    static async getAll() {
        return getDocs(collection(db, this.collectionName));
    }

    static post(teamInfo: ITeam): Promise<void> {
        return setDoc(doc(collection(db, this.collectionName)), teamInfo);
    }
}
