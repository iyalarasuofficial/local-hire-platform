import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../firebase_auth/firebase";// your Firebase config
import { getIdTokenResult } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
  if (firebaseUser) {
    // ✅ Get custom claims (like 'role') from the ID token
    const tokenResult = await getIdTokenResult(firebaseUser);
    setRole(tokenResult.claims.role || "user");
    setUser(firebaseUser);
  } else {
    setUser(null);
    setRole(null);
  }
  setLoading(false); // ✅ Done loading either way
});

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
