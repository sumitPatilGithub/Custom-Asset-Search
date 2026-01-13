'use client';
// import { useFetchJson } from './useFetchJson';
// React Grid Logic
import React, { StrictMode, useMemo, useState } from "react";
// import { createRoot } from "react-dom/client";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useFetchJson } from "./useFetchJsonForLocation";
import { useGridData } from "./GridDataContext";
import { useEffect } from "react";


ModuleRegistry.registerModules([AllCommunityModule]);

// Custom Cell Renderer (Display logos based on cell value)

/* Custom Cell Renderer (Display tick / cross in 'Successful' column) */

/* Format Date Cells */


const rowSelection = {
  mode: "multiRow",
  headerCheckbox: false,
};

// Create new GridExample component
const GridCircuits = ({loading,data}) => {
  const [gridApi, setGridApi] = useState(null);
 const ROUTE="/circuits"
  const {
    setFilteredDataForRoute,
    setLoadingForRoute
  } = useGridData();

  // setFilteredDataForRoute(ROUTE,data)
  useEffect(()=>
      {
        setFilteredDataForRoute(ROUTE,data)
      },[])
console.log('circuits data',data);


  // Column Definitions: Defines & controls grid columns.
  const [colDefs] = useState([
    {
      field: "Circuit Name",
      width: 150,
    },
    {
      field: "Customer Name",
      width: 130,
      // cellRenderer: CompanyLogoRenderer,
    },
    {
      field: "Location",
      width: 225,
    },
    {
      field: "Asset Name",
       width: 130,
      // valueFormatter: dateFormatter,
    },
    {
      field: "Circuit Type",
      width: 130,
      // valueFormatter: (params) => {
      //   return "£" + params.value.toLocaleString();
      // },
    },
    // {
    //   field: "ISP Name",
    //   width: 120,
    //   // cellRenderer: MissionResultRenderer,
    // },
    {
      field: "Download Speed",
      width: 120,
      // cellRenderer: MissionResultRenderer,
    },
    {
      field: "Upload Speed",
      width: 120,
      // cellRenderer: MissionResultRenderer,
    },
    // {
    //   field: "Account #",
    //   width: 120,
    //   // cellRenderer: MissionResultRenderer,
    // },
     {
      field: "ISP Contact No",
      width: 120,
      // cellRenderer: MissionResultRenderer,
    },
     {
      field: "Service Level",
      width: 120,
      // cellRenderer: MissionResultRenderer,
    },
    {
      field: "Account Number",
      width: 120,
      // cellRenderer: MissionResultRenderer,
    },
    {
      field: "ISP Name (Provider Name)",
      width: 120,
      // cellRenderer: MissionResultRenderer,
    }
  ]);

  // Apply settings across all columns
  const defaultColDef = useMemo(() => {
    return {
      filter: true,
      editable: true,
    };
  }, []);

useEffect(() => {
    setLoadingForRoute(ROUTE, loading);
  }, [loading]);

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

export default GridCircuits;