import React, { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // On component mount, check if user data is stored in localStorage
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleUserUpdate = (newUserData) => {
    setUser(newUserData);
    // Store the updated user data in localStorage
    localStorage.setItem('userData', JSON.stringify(newUserData));
  };

  return (
    <UserContext.Provider value={{ user, setUser: handleUserUpdate }}>
      {children}
    </UserContext.Provider>
  );
}
