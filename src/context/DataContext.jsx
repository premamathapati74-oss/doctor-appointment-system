import { createContext, useContext, useEffect, useState } from "react";
import { listenHospitals, listenDoctors } from "../firebase/services";

const DataContext = createContext({ hospitals: [], doctors: [], loading: true, error: "" });
export const useData = () => useContext(DataContext);

// Firestore listeners sirf ek baar chalte hain; navbar, home, doctors sab yahi data use karte hain
export function DataProvider({ children }) {
    const [hospitals, setHospitals] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const listenerErrors = { hospitals: "", doctors: "" };
        const reportError = (key, e) => {
            console.error(`${key} load error:`, e);
            const code = e?.code ? ` (${e.code})` : "";
            const hint = e?.code === "permission-denied"
                ? ` Please check Firestore ${key} read access.`
                : "";
            listenerErrors[key] = `Directory Not loaded ${code}.${hint}`;
            setError(Object.values(listenerErrors).filter(Boolean).join(" "));
            setLoading(false);
        };
        const clearError = (key) => {
            listenerErrors[key] = "";
            setError(Object.values(listenerErrors).filter(Boolean).join(" "));
        };
        const u1 = listenHospitals((data) => {
            setHospitals(data);
            clearError("hospitals");
        }, (e) => reportError("hospitals", e));
        const u2 = listenDoctors((data) => {
            setDoctors(data);
            clearError("doctors");
            setLoading(false);
        }, (e) => reportError("doctors", e));
        return () => { u1(); u2(); };
    }, []);

    return <DataContext.Provider value={{ hospitals, doctors, loading, error }}>{children}</DataContext.Provider>;
}
export default DataContext;