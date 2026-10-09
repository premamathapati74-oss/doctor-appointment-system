import { useEffect, useState } from "react";
import { listenHospitals, listenDoctors } from "../firebase/services";

export default function useLiveData() {
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const onErr = (e) => { console.error(e); setError("Data is not loaded ,pls check firestore."); setLoading(false); };
    const u1 = listenHospitals(setHospitals, onErr);
    const u2 = listenDoctors((d) => { setDoctors(d); setLoading(false); }, onErr);
    return () => { u1(); u2(); };
  }, []);

  return { hospitals, doctors, loading, error };
}
