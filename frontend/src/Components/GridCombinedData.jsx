'use client';
// import { useFetchJson } from './useFetchJson';
// React Grid Logic
import React, { StrictMode, useMemo, useState } from "react";
// import { createRoot } from "react-dom/client";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useGridData } from "./GridDataContext";
import { useEffect } from "react";
// import { useFetchJson } from "./useFetchJsonForLocation";


ModuleRegistry.registerModules([AllCommunityModule]);

// Custom Cell Renderer (Display logos based on cell value)


/* Custom Cell Renderer (Display tick / cross in 'Successful' column) */

/* Format Date Cells */

const rowSelection = {
  mode: "multiRow",
  headerCheckbox: false,
};

// Create new GridExample component
const GridCombinedData = ({loading,data}) => {
  const [gridApi, setGridApi] = useState(null);
 const ROUTE="/combined"
//  setFilteredDataForRoute(ROUTE,data)

useEffect(()=>
    {
      setFilteredDataForRoute(ROUTE,data)
    },[])
console.log('combined data',data);
const {
    setFilteredDataForRoute,
    setLoadingForRoute
  } = useGridData();

  // Column Definitions: Defines & controls grid columns.
  const [colDefs] = useState([
  // { field: "Assets Name", width: 150 },
  // { field: "Customer Name", width: 150 },
  // { field: "Location", width: 150 },
  // { field: "Circuit Name", width: 150 },
  // { field: "Make/Model", width: 150 },
  // { field: "Type", width: 150 },
  // { field: "Monitored IP", width: 150 },
  // { field: "Public Usage Range", width: 150 },
  // { field: "Public Gateway", width: 150 },
  // { field: "Public Mask", width: 150 },
  // { field: "Circuit Type", width: 150 },
  // { field: "ISP Name", width: 150 },
  // { field: "Download Speed", width: 150 },
  // { field: "Upload Speed", width: 150 },
  // { field: "ISP Contact No", width: 150 },
  // { field: "Service Level", width: 150 },
  // { field: "Account Number", width: 150 },
  // { field: "Location Phone", width: 150 },
  // { field: "Location Address", width: 150 },
  // { field: "Time Zone", width: 150 },
  // { field: "Street", width: 150 },
  // { field: "City", width: 150 },
  // { field: "State", width: 150 },
  // { field: "Zip code", width: 150 }
 
  { field: "Customer Name", width: 150 },  //Customer Name, Location Name, Location phone, Street, City, State, Zip code, Asset Name, Circuit Name, Type, Make/Model, Monitored IP. Public Static IP, Public Gateway IP, Public Subnet Mass, Circuit Type, Download Speed, Upload Speed, ISP, Name, ISP Contact, Account Number
  { field: "Location", width: 150 },
  // { field: "Location Address", width: 150 },
  { field: "Location Phone", width: 150 },
  { field: "Street", width: 150 },
  { field: "City", width: 150 },
  { field: "State", width: 150 },
  { field: "Zip code", width: 150 },
  // { field: "Timezone", width: 150 },
  { field: "Assets Name", width: 150 },
  { field: "Circuit Name", width: 150 },
  // { field: "Service Level", width: 150 },
  { field: "Type", width: 150 },
  { field: "Make/Model", width: 150 },
  { field: "Monitored IP", width: 150 },
  { field: "Public Usage Range", width: 150 },
  { field: "Public Gateway IP", width: 150 },
  { field: "Public Subnet Mask", width: 150 },
  { field: "Circuit Type", width: 150 },
  { field: "Download Speed", width: 150 },
  { field: "Upload Speed", width: 150 },
  { field: "ISP Name", width: 150 },
  { field: "ISP Contact No", width: 150 },
  { field: "Account Number", width: 150 }


]
);

useEffect(() => {
    setLoadingForRoute(ROUTE, loading);
  }, [loading]);

  // Apply settings across all columns
  const defaultColDef = useMemo(() => {
    return {
      filter: true,
      editable: true,
    };
  }, []);

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const syncFilteredData = () => {
    if (!gridApi) return;

    const rows = [];
    gridApi.forEachNodeAfterFilterAndSort(node => {
      rows.push(node.data);
    });

    setFilteredDataForRoute(ROUTE, rows);
  };


  // Container: Defines the grid's theme & dimensions.
  return (
    <div style={{ width: "100%", height: "530px" }}>
      <AgGridReact
        rowData={data}
        loading={loading}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        rowSelection={rowSelection}
        onSelectionChanged={(event) => console.log("Row Selected!")}
        onCellValueChanged={(event) =>
          console.log(`New Cell Value: ${event.value}`)
        }
        onGridReady={onGridReady}
        onFilterChanged={syncFilteredData}
      />
    </div>
  );
};

export default GridCombinedData;