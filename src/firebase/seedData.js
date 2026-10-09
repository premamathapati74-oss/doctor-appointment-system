import { doc, writeBatch } from "firebase/firestore";
import { db } from "./config";

// Total 25 hospitals. Pehli 11 aapki di hui list se (sirf naam pakka; city/address /admin se edit karo).
// Baaki 14 ek public hospital directory (Sangli-Miraj listing) se: naam aur area. Official naam/address ek baar check kar lena.
const H = (name, city = "Sangli District", address = "") => ({ name, city, address, phone: "" });
const hospitals = [
  // --- Aapki di hui list ---
  ["hos-sevasadan-lifeline", H("Sevasadan Lifeline Superspeciality Hospital")],
  ["hos-mehata-malti", H("Mehata Malti Specialist Hospital")],
  ["hos-kims-uaims", H("KIMS-UAIMS Hospital")],
  ["hos-anuradha-eye", H("Anuradha Superspecialist Eye Hospital")],
  ["hos-sanjeevani", H("Sanjeevani Hospital")],
  ["hos-kullolli", H("Kullolli Hospital")],
  ["hos-laksmi-narayan", H("Laksmi Narayan Superspecialist Hospital")],
  ["hos-islampur-multi", H("Islampur Multispecialist Hospital", "Islampur")],
  ["hos-shriratna", H("Shriratna Multispeciality Hospital")],
  ["hos-sanjeevan-surgical", H("Sanjeevan Surgical Hospital")],
  ["hos-rk", H("R K Hospital")],
  
  // --- Directory se (Sangli-Miraj-Kupwad area) ---
  ["hos-wanless", H("Wanless Hospital", "Miraj", "Miraj - Malgaon Main Road, Miraj")],
  ["hos-vivekanand", H("Vivekanand Hospital", "Kupwad", "Kupwad")],
  ["hos-aaditya", H("Aaditya Hospital", "Sangli", "Samastanagar, Sangli")],
  ["hos-wasavade", H("Wasavade Hospital", "Sangli", "Nishant Colony, Sangli")],
  ["hos-swasthiyog", H("Swasthiyog Pratishthan", "Sangli", "Guruvar Peth, Sangli")],
  ["hos-sarvamangal", H("Sarvamangal Hospital", "Sangli", "Shivaji Nagar, Sangli")],
  ["hos-matruseva", H("Matruseva Superspeciality Hospital", "Sangli", "Shivaji Nagar, Sangli")],
  ["hos-kothari-ortho", H("Kothari Accident and Orthopaedic Hospital", "Sangli", "Khanbhag, Sangli")],
  ["hos-magdum", H("Magdum Multispeciality Hospital", "Kupwad", "Miraj Kupwad")],
  ["hos-birnale", H("Birnale Hospitals", "Sangli", "Sangli-Miraj-Kupwad")],
  ["hos-mhaishalkar-shinde", H("Mhaishalkar Shinde Hospital", "Sangli", "Patrakar Nagar, Sangli")],
  ["hos-horizon", H("Horizon Multispeciality Hospital", "Sangli", "Patrakar Nagar, Sangli")],
  ["hos-shraddha", H("Shraddha Surgical and Accident Hospital", "Sangli", "Patrakar Nagar, Sangli")],
  ["hos-ushahkal-abhinav", H("Ushahkal Abhinav Institute of Medical Sciences", "Sangli", "Dhamni Road, Sangli")],
];

// Fixed ids => dobara chalane par duplicate nahi banta
export async function seedDemoData() {
  const batch = writeBatch(db);
  oldDoctorIds.forEach((id) => batch.delete(doc(db, "doctors", id)));
  hospitals.forEach(([id, d]) => batch.set(doc(db, "hospitals", id), d));
  await batch.commit();
}

const DD = (hospitalId, name, qualification, experience, specialty, available = true) =>
  ({ hospitalId, name: `${name} (Demo)`, qualification, experience, specialty, photo: "", available, demo: true });

const demoDoctors = [
  ["hos-sevasadan-lifeline", "Dr. Anil Kulkarni", "MBBS, MD (Medicine)", 12, "General Physician"],
  ["hos-sevasadan-lifeline", "Dr. Pooja Naik", "MBBS, DM (Cardiology)", 11, "Cardiology"],
  ["hos-mehata-malti", "Dr. Sneha Patil", "MBBS, MS (Gynaecology)", 9, "Gynaecology"],
  ["hos-kims-uaims", "Dr. Rahul Deshmukh", "MBBS, MD (Paediatrics)", 15, "Paediatrics"],
  ["hos-kims-uaims", "Dr. Harshad Sawant", "MBBS, DM (Neurology)", 10, "Neurology"],
  ["hos-anuradha-eye", "Dr. Mansi Deshpande", "MBBS, MS (Ophthalmology)", 8, "Ophthalmology"],
  ["hos-sanjeevani", "Dr. Kavita Jadhav", "MBBS, MD (Medicine)", 10, "General Physician"],
  ["hos-kullolli", "Dr. Vikram More", "MBBS, MS (ENT)", 8, "ENT", false],
  ["hos-laksmi-narayan", "Dr. Prasad Bhosale", "MBBS, DM (Cardiology)", 16, "Cardiology"],
  ["hos-islampur-multi", "Dr. Nilesh Mane", "MBBS, MS (ENT)", 9, "ENT"],
  ["hos-shriratna", "Dr. Priya Kadam", "MBBS, MD (Medicine)", 7, "General Physician"],
  ["hos-sanjeevan-surgical", "Dr. Suresh Kamble", "MBBS, MS (General Surgery)", 20, "General Surgery"],
  ["hos-rk", "Dr. Nita Pawar", "MBBS, MD (Paediatrics)", 6, "Paediatrics"],
  ["hos-wanless", "Dr. Amit Gaikwad", "MBBS, MS (Ortho)", 14, "Orthopedics"],
  ["hos-wanless", "Dr. Rekha Salunkhe", "MBBS, MS (Gynaecology)", 13, "Gynaecology", false],
  ["hos-vivekanand", "Dr. Meera Joshi", "MBBS, DDVL", 7, "Dermatology"],
  ["hos-vivekanand", "Dr. Ganesh Pise", "MBBS, MD (Medicine)", 9, "General Physician"],
  ["hos-aaditya", "Dr. Sanjay Shinde", "MBBS, MS (Ortho)", 18, "Orthopedics"],
  ["hos-aaditya", "Dr. Anjali Yadav", "MBBS, MS (Gynaecology)", 11, "Gynaecology"],
  ["hos-wasavade", "Dr. Omkar Thorat", "MBBS, MD (Paediatrics)", 8, "Paediatrics"],
  ["hos-swasthiyog", "Dr. Swati Chavan", "MBBS, DDVL", 5, "Dermatology"],
  ["hos-sarvamangal", "Dr. Sagar Ghadge", "MBBS, MS (ENT)", 7, "ENT"],
  ["hos-matruseva", "Dr. Tejaswini Mohite", "MBBS, MS (Gynaecology)", 6, "Gynaecology"],
  ["hos-kothari-ortho", "Dr. Ajay Jagtap", "MBBS, MS (Ortho)", 12, "Orthopedics"],
  ["hos-magdum", "Dr. Yogesh Patole", "MBBS, DM (Cardiology)", 12, "Cardiology", false],
  ["hos-birnale", "Dr. Komal Nikam", "MBBS, MD (Medicine)", 5, "General Physician"],
  ["hos-mhaishalkar-shinde", "Dr. Manoj Kale", "MBBS, MCh (Urology)", 13, "Urology"],
  ["hos-horizon", "Dr. Deepa Lokhande", "MBBS, MS (Ophthalmology)", 9, "Ophthalmology"],
  ["hos-shraddha", "Dr. Rutuja Sutar", "MBBS, MS (Ortho)", 4, "Orthopedics"],
  ["hos-ushahkal-abhinav", "Dr. Shweta Kore", "BDS, MDS", 6, "Dentistry", false],
].map((a, i) => [`demo-d${i + 1}`, DD(...a)]);

export async function seedDemoDoctors() {
  const batch = writeBatch(db);
  demoDoctors.forEach(([id, d]) => batch.set(doc(db, "doctors", id), d));
  await batch.commit();
}

export async function removeDemoDoctors() {
  const batch = writeBatch(db);
  demoDoctors.forEach(([id]) => batch.delete(doc(db, "doctors", id)));
  await batch.commit();
}

const moreHospitals = [
  ["hos-shivaji-nagar-city", H("Shivaji Nagar City Hospital", "Sangli", "Shivaji Nagar, Sangli")],
  ["hos-sangli-nursing", H("Sangli Nursing Home", "Sangli", "Ganpati Peth, Sangli")],
  ["hos-miraj-general", H("Miraj General Hospital", "Miraj", "Miraj")],
  ["hos-kupwad-multispeciality", H("Kupwad Multispeciality Hospital", "Kupwad", "Kupwad")],
  ["hos-tasgaon-general", H("Tasgaon General Hospital", "Tasgaon", "Tasgaon")],
  ["hos-vita-city", H("Vita City Hospital", "Vita", "Vita")],
  ["hos-jat-rural", H("Jat Rural Hospital", "Jat", "Jat")],
  ["hos-shirala-care", H("Shirala Care Hospital", "Shirala", "Shirala")],
  ["hos-palus-nursing", H("Palus Nursing Home", "Palus", "Palus")],
  ["hos-atpadi-general", H("Atpadi General Hospital", "Atpadi", "Atpadi")],
];
hospitals.push(...moreHospitals);

const moreDoctors = [
  ["hos-shivaji-nagar-city", "Dr. Ravindra Jadhav", "MBBS, MD (Medicine)", 14, "General Physician"],
  ["hos-sangli-nursing", "Dr. Snehal Kamble", "MBBS, DGO", 8, "Gynaecology"],
  ["hos-miraj-general", "Dr. Santosh Powar", "MBBS, MS (Ortho)", 11, "Orthopedics"],
  ["hos-kupwad-multispeciality", "Dr. Neha Bhosale", "MBBS, MD (Paediatrics)", 7, "Paediatrics"],
  ["hos-tasgaon-general", "Dr. Mahesh Koli", "MBBS, DM (Cardiology)", 15, "Cardiology"],
  ["hos-vita-city", "Dr. Ashwini Sawant", "MBBS, DDVL", 6, "Dermatology", false],
  ["hos-jat-rural", "Dr. Vishal Patil", "MBBS, MS (ENT)", 9, "ENT"],
  ["hos-shirala-care", "Dr. Pallavi More", "MBBS, MS (Ophthalmology)", 10, "Ophthalmology"],
  ["hos-palus-nursing", "Dr. Rajendra Salvi", "MBBS, MD (Medicine)", 18, "General Physician"],
  ["hos-atpadi-general", "Dr. Sonal Gaikwad", "MBBS, MS (Gynaecology)", 5, "Gynaecology"],
].map((a, i) => [`demo-e${i + 1}`, DD(...a)]);
demoDoctors.push(...moreDoctors);
