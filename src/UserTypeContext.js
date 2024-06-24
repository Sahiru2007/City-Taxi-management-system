// UserTypeContext.js
import { createContext, useContext, useState } from 'react';

const UserTypeContext = createContext();

export const UserTypeProvider = ({ children }) => {
  const [userType, setUserType] = useState(null);

  const setUserTypeContext = (type) => {
    setUserType(type);
  };

  return (
    <UserTypeContext.Provider value={{ userType, setUserTypeContext }}>
      {children}
    </UserTypeContext.Provider>
  );
};

export const useUserType = () => {
  return useContext(UserTypeContext);
};
