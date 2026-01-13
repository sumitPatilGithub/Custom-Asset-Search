import { createContext, useContext, useState } from "react";

const GridDataContext = createContext();

export const GridDataProvider = ({ children }) => {
  const [gridDataMap, setGridDataMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});

  const setFilteredDataForRoute = (route, data) => {
    setGridDataMap(prev => ({
      ...prev,
      [route]: data
    }));
  };

  const setLoadingForRoute = (route, loading) => {
    setLoadingMap(prev => ({
      ...prev,
      [route]: loading
    }));
  };

  return (
    <GridDataContext.Provider
      value={{
        gridDataMap,
        loadingMap,
        setFilteredDataForRoute,
        setLoadingForRoute
      }}
    >
      {children}
    </GridDataContext.Provider>
  );
};

export const useGridData = () => useContext(GridDataContext);
