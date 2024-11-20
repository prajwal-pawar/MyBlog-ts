import { createContext, Dispatch, SetStateAction } from "react";

interface AuthContextType {
  user: string | null;
  setUser: Dispatch<SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export default AuthContext;
