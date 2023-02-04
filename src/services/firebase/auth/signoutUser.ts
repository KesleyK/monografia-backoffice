import { getAuth, signOut } from "firebase/auth";

export async function signoutUser() {
    const auth = getAuth();
    await signOut(auth);
}
