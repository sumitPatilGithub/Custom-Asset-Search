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



const rowSelection = {
  mode: "multiRow",
  headerCheckbox: false,
};

// Create new GridExample component
const GridLocation = ({loading,data}) => {
  const [gridApi, setGridApi] = useState(null);
 
  const ROUTE="/location"
    const {
      setFilteredDataForRoute,
      setLoadingForRoute
    } = useGridData();
  
    useEffect(()=>
    {
      if (Array.isArray(data)) {
    setFilteredDataForRoute(ROUTE, data);
    }
    },[data])

  // Column Definitions: Defines & controls grid columns. //Location, Customer name, Location Phone, street, city, State and Zip code
  const [colDefs] = useState([
    {
      field: "Location",
      // width: 150,
    },
    {
      field: "Customer Name",
      // width: 130,
      // cellRenderer: CompanyLogoRenderer,
    },
    // {
    //   field: "Asset Name",
    //   width: 225,
    // },
    // {
    //   field: "Circuit Name",
    //    width: 130,
    //   // valueFormatter: dateFormatter,
    // },
    {
      field: "Location Phone",
      // width: 130,
      // valueFormatter: (params) => {
      //   return "£" + params.value.toLocaleString();
      // },
    },
    // {
    //   field: "Location Address",
    //   width: 120,
    //   // cellRenderer: MissionResultRenderer,
    // },
    // {
    //   field: "Time Zone",
    //   width: 120,
    //   // cellRenderer: MissionResultRenderer,
    // },
    {
      field: "Street",
      // width: 120,
      // cellRenderer: MissionResultRenderer,
    },
    {
      field: "City",
      // width: 120,
      // cellRenderer: MissionResultRenderer,
    },
     {
      field: "State",
      // width: 120,
      // cellRenderer: MissionResultRenderer,
    },
     {
      field: "Zip code",
      // width: 120,
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

export default GridLocation;