import { DocumentData, QuerySnapshot } from "firebase/firestore";

export const parseCollection = (info: QuerySnapshot<DocumentData>) => {
    const arr = [];

    info.forEach((doc: DocumentData) => {
        arr.push({ id: doc.id, ...doc.data() });
    });

    return arr;
};
