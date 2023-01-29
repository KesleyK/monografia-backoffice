import { getAuth, reauthenticateWithCredential, updatePassword, EmailAuthProvider } from "firebase/auth";

export async function resetPassword(newPassword: string) {
    const auth = getAuth();
    const user = auth.currentUser;

    return updatePassword(user, newPassword);
}

export async function reauthenticate(currentPassword: string) {
    const auth = getAuth();
    const user = auth.currentUser;

    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    return reauthenticateWithCredential(user, credential);
}
