import UsersCollection from "../db/users";

export async function updateUserProfile(user) {
    return await UsersCollection.put(user.email, user);
}
