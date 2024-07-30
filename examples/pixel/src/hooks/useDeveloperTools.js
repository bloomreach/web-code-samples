import { createContext, useContext, useState } from 'react';

const DeveloperToolsContext = createContext({});

const DeveloperToolsProvider = ({ children }) => {
  const [showJson, setShowJson] = useState(false);

  return (
    <DeveloperToolsContext.Provider value={{ showJson, setShowJson }}>
      {children}
    </DeveloperToolsContext.Provider>
  );
};

export function useDeveloperTools() {
  return useContext(DeveloperToolsContext);
}

export default DeveloperToolsProvider;
