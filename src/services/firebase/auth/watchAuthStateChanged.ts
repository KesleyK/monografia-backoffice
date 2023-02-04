import { getAuth, onAuthStateChanged } from "firebase/auth";

export function watchAuthStateChanged(onAuthStateChange) {
    const auth = getAuth();
    const unsubscribeFromAuthStatuChanged = onAuthStateChanged(auth, (user) => {
        if (user) {
            onAuthStateChange(user);
        } else {
            onAuthStateChange(undefined);
        }
    });

    return unsubscribeFromAuthStatuChanged;
}
