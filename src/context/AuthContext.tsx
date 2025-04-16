// context/AuthContext.tsx
import React, {createContext, useContext, useState} from 'react';

type AuthContextType = {
  isSignedIn: boolean;
  signIn: () => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        signIn: () => setIsSignedIn(true),
        signOut: () => setIsSignedIn(false),
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
