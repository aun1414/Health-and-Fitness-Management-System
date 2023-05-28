import React, { createContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [hideTabs, setHideTabs] = useState(false);

  const toggleTabBarVisibility = (isHide) => {
    setHideTabs(isHide);
    console.log("Hidden: ", isHide)
  };

  return (
    <AppContext.Provider value={{ hideTabs, toggleTabBarVisibility }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
