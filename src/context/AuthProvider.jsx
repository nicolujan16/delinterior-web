import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getIdTokenResult, signOut } from "firebase/auth";
import { auth } from "../FirebaseConfig";

const AuthContext = createContext({ user: null, isAdmin: false, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        try {
          const tokenResult = await getIdTokenResult(currentUser);
          setIsAdmin(Boolean(tokenResult.claims?.admin));
        } catch {
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };


  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, logout}}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar el contexto más fácil
export const useAuth = () => useContext(AuthContext);
