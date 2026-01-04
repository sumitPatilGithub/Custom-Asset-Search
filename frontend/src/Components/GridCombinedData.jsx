'use client';
// import { useFetchJson } from './useFetchJson';
// React Grid Logic
import React, { StrictMode, useMemo, useState } from "react";
// import { createRoot } from "react-dom/client";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
// import { useFetchJson } from "./useFetchJsonForLocation";


ModuleRegistry.registerModules([AllCommunityModule]);

// Custom Cell Renderer (Display logos based on cell value)
const CompanyLogoRenderer = (params) => (
  <span
    style={{
      display: "flex",
      height: "100%",
      width: "100%",
      alignItems: "center",
    }}
  >
    {params.value && (
      <img
        alt={`${params.value} Flag`}
        src={`https://www.ag-grid.com/example-assets/space-company-logos/${params.value.toLowerCase()}.png`}
        style={{
          display: "block",
          width: "25px",
          height: "auto",
          maxHeight: "50%",
          marginRight: "12px",
          filter: "brightness(1.1)",
        }}
      />
    )}
    <p
      style={{
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      {params.value}
    </p>
  </span>
);

/* Custom Cell Renderer (Display tick / cross in 'Successful' column) */
const MissionResultRenderer = (params) => (
  <span
    style={{
      display: "flex",
      justifyContent: "center",
      height: "100%",
      alignItems: "center",
    }}
  >
    {
      <img
        alt={`${params.value}`}
        src={`https://www.ag-grid.com/example-assets/icons/${params.value ? "tick-in-circle" : "cross-in-circle"}.png`}
        style={{ width: "auto", height: "auto" }}
      />
    }
  </span>
);

/* Format Date Cells */
const dateFormatter = (params) => {
  return new Date(params.value).toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const rowSelection = {
  mode: "multiRow",
  headerCheckbox: false,
};

// Create new GridExample component
const GridCombinedData = ({loading,data}) => {
 
console.log('combined data',data);


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
 
  { field: "Customer Name", width: 150 },
  { field: "Location", width: 150 },
  { field: "Location Address", width: 150 },
  { field: "Location Phone", width: 150 },
  { field: "Street", width: 150 },
  { field: "City", width: 150 },
  { field: "State", width: 150 },
  { field: "Zip code", width: 150 },
  { field: "Timezone", width: 150 },
  { field: "Assets Name", width: 150 },
  { field: "Service Level", width: 150 },
  { field: "Type", width: 150 },
  { field: "Make/Model", width: 150 },
  { field: "Monitored IP", width: 150 },
  { field: "Public Usage Range", width: 150 },
  { field: "Public Gateway IP", width: 150 },
  { field: "Public Subnet Mask", width: 150 },
  { field: "Circuit Name", width: 150 },
  { field: "Circuit Type", width: 150 },
  { field: "Download Speed", width: 150 },
  { field: "Upload Speed", width: 150 },
  { field: "ISP Name", width: 150 },
  { field: "ISP Contact No", width: 150 },
  { field: "Account Number", width: 150 }


]
);

  // Apply settings across all columns
  const defaultColDef = useMemo(() => {
    return {
      filter: true,
      editable: true,
    };
  }, []);

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
      />
    </div>
  );
};

export default GridCombinedData;