import { collection, doc, addDoc, setDoc, deleteDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

// id ho to update, nahi to naya document
const save = (name, id, data) =>
  id ? setDoc(doc(db, name, id), data, { merge: true })
  : addDoc(collection(db, name), { ...data, createdAt: serverTimestamp() });

export const saveHospital = (id, data) => save("hospitals", id, data);
export const saveDoctor = (id, data) => save("doctors", id, data);
export const removeHospital = (id) => deleteDoc(doc(db, "hospitals", id));
export const removeDoctor = (id) => deleteDoc(doc(db, "doctors", id));
export const setAvailability = (id, available) => updateDoc(doc(db, "doctors", id), { available });
