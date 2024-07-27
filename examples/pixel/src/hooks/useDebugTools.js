import { createContext, useContext, useState } from 'react';

const DebugToolsContext = createContext({});

const DebugToolsProvider = ({children}) => {
  const [showJson, setShowJson] = useState(false);

  return (
    <DebugToolsContext.Provider value={{showJson, setShowJson}}>
      {children}
    </DebugToolsContext.Provider>
  )
}

export function useDebugTools() {
  return useContext(DebugToolsContext);
}

export default DebugToolsProvider;
