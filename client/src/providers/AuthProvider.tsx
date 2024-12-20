import { useState, ReactNode } from "react";
import AuthContext from "../context/AuthContext";
import User from "../types/user";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem("user") as string) || null
  );

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
