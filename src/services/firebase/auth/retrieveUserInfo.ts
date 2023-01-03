import { getAuth } from "firebase/auth";
import { IUser } from "../../../models/IUser";
import UsersCollection from "../db/users";

export async function retrieveUserInfo(): Promise<IUser> {
    const user = getAuth().currentUser;
    const firebaseDocument = await UsersCollection.get(user.email);

    return UsersCollection.convert(firebaseDocument);
}
