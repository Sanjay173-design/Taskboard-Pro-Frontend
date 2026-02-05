import { createContext, useContext, useEffect, useState } from "react";
import { fetchAuthSession, getCurrentUser, signOut } from "aws-amplify/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ---------------- LOAD SESSION ---------------- */

  useEffect(() => {
    async function loadSession() {
      try {
        const currentUser = await getCurrentUser();
        const session = await fetchAuthSession();

        setUser(currentUser);
        setAccessToken(session.tokens.accessToken.toString());
      } catch (err) {
        setUser(null);
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadSession();
  }, []);

  /* ---------------- LOGOUT ---------------- */

  const logout = async () => {
    try {
      await signOut(); // ⭐ Amplify logout

      setUser(null);
      setAccessToken(null);

      // Hard redirect (safest)
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  /* ---------------- CONTEXT ---------------- */

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!accessToken,
        isLoading,
        logout, // ⭐ ADD THIS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
