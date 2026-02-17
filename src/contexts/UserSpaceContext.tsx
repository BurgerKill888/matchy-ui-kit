import { createContext, useContext, useState, ReactNode } from "react";

export type UserSpace = "vendeur" | "acquereur";

interface UserSpaceContextType {
  space: UserSpace;
  setSpace: (space: UserSpace) => void;
  isVendeur: boolean;
  isAcquereur: boolean;
}

const UserSpaceContext = createContext<UserSpaceContextType | undefined>(undefined);

export function UserSpaceProvider({ children }: { children: ReactNode }) {
  const [space, setSpace] = useState<UserSpace>(() => {
    const saved = localStorage.getItem("matchstone-space");
    return (saved === "vendeur" || saved === "acquereur") ? saved : "vendeur";
  });

  const handleSetSpace = (newSpace: UserSpace) => {
    setSpace(newSpace);
    localStorage.setItem("matchstone-space", newSpace);
  };

  return (
    <UserSpaceContext.Provider value={{
      space,
      setSpace: handleSetSpace,
      isVendeur: space === "vendeur",
      isAcquereur: space === "acquereur",
    }}>
      {children}
    </UserSpaceContext.Provider>
  );
}

export function useUserSpace() {
  const context = useContext(UserSpaceContext);
  if (!context) throw new Error("useUserSpace must be used within UserSpaceProvider");
  return context;
}
