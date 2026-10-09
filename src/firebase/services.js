import {
  collection, onSnapshot, doc, writeBatch, addDoc, query, where,
  runTransaction, serverTimestamp, getDocs,
} from "firebase/firestore";
import { db } from "./config";

const toList = (s) => s.docs.map((x) => ({ id: x.id, ...x.data() }));
const slotId = (a) => `${a.doctorId}_${a.date}_${a.time.replace(":", "")}`;

// ---- Real-time listeners ----
export const listenHospitals = (cb, onErr) => onSnapshot(collection(db, "hospitals"), (s) => cb(toList(s)), onErr);
export const listenDoctors = (cb, onErr) => onSnapshot(collection(db, "doctors"), (s) => cb(toList(s)), onErr);
export const listenMyAppointments = (uid, cb, onErr) =>
  onSnapshot(query(collection(db, "appointments"), where("patientUid", "==", uid)), (s) => cb(toList(s)), onErr);
export const listenMyReports = (uid, cb, onErr) =>
  onSnapshot(query(collection(db, "reports"), where("patientUid", "==", uid)), (s) => cb(toList(s)), onErr);
// Booked slots (sirf doctor+date+time, patient ki detail nahi)
export const listenBookedSlots = (doctorId, date, cb) =>
  onSnapshot(query(collection(db, "slots"), where("doctorId", "==", doctorId), where("date", "==", date)),
    (s) => cb(s.docs.map((x) => x.data().time)));

// ---- Booking: transaction se double booking nahi hoti ----
export async function bookAppointment(a) {
  const slotRef = doc(db, "slots", slotId(a));
  const apRef = doc(collection(db, "appointments"));
  await runTransaction(db, async (tx) => {
    if ((await tx.get(slotRef)).exists()) throw new Error("SLOT_TAKEN");
    tx.set(slotRef, { doctorId: a.doctorId, date: a.date, time: a.time, patientUid: a.patientUid });
    tx.set(apRef, { ...a, status: "Booked", createdAt: serverTimestamp() });
  });
}

export async function cancelAppointment(a) {
  const batch = writeBatch(db);
  batch.update(doc(db, "appointments", a.id), { status: "Cancelled" });
  batch.delete(doc(db, "slots", slotId(a)));
  await batch.commit();
}

export const addFeedback = (f) => addDoc(collection(db, "feedback"), { ...f, createdAt: serverTimestamp() });

// ---- Admin: patient ko report jodna (asli file upload nahi, sirf link) ----
export async function findPatientByPhone(phone) {
  const snap = await getDocs(query(collection(db, "patients"), where("phone", "==", "+91" + phone)));
  return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
}
export async function addReport(patientUid, data) {
  await addDoc(collection(db, "reports"), { ...data, patientUid, createdAt: serverTimestamp() });
}