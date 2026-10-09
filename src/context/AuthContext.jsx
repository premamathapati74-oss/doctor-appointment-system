import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); // null => naya patient
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(
    () =>
      onAuthStateChanged(auth, async (u) => {
        setLoading(true);
        setUser(u);
        setProfile(null);
        setIsAdmin(false);
        setAdminError("");
        if (u) {
          try {
            const snap = await getDoc(doc(db, "patients", u.uid)); // purana ya naya patient check
            setProfile(snap.exists() ? snap.data() : null); 
          } catch (e) { console.error("Profile load error:", e); }
          try {
            setIsAdmin((await getDoc(doc(db, "admins", u.uid))).exists()); // admin check
          } catch (e) {
            console.error("Admin check error:", e);
            setAdminError(e?.code || e?.message || "unknown");
          }
        }
        setLoading(false);
      }),
    []
  );

  // data me phone/email/naam sab pehle se hai (ProfileSetup se aata hai)
  const saveProfile = async (data) => {
    const p = { ...data, uid: user.uid };
    await setDoc(doc(db, "patients", user.uid), { ...p, createdAt: serverTimestamp() });
    setProfile(p);
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, adminError, loading, saveProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
