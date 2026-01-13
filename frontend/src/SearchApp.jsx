import React, { useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useFetchJsonForLocation } from './Components/useFetchJsonForLocation';
import MyNavbar from './Components/Nav';
import GridLocation from './Components/GridLocation';
import GridCircuits from './Components/GridCircuits';
import GridAssets from './Components/GridAssets';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useFetchJsonForAssets } from './Components/useFetchJsonForAssets';
import { useFetchJsonForCircuits } from './Components/useFetchJsonForCircuits';
import GridCombinedData from './Components/GridCombinedData';
import AuthErrorCard from './AuthErrorCard';
import axios from "axios";
import { useEffect } from 'react';
import { GridDataProvider } from './Components/GridDataContext';
function SearchApp() {

    
  const locationPayload = useMemo(() => ({
    query: 'objectType  = "Location List"',
    workspaceId: '95aaeb5c-8417-4a83-811c-735e4c08c346',
    startAt: 0
  }), []);

  const assetsPayload = useMemo(() => ({
    query: 'objectType  = "Assets List"',
    workspaceId: '95aaeb5c-8417-4a83-811c-735e4c08c346',
    startAt: 0
  }), []);

  const circuitPayload = useMemo(() => ({
    query: 'objectType  = "Circuit List"',
    workspaceId: '95aaeb5c-8417-4a83-811c-735e4c08c346',
    startAt: 0
  }), []);



  const { data, loading, error, loadedCount } = useFetchJsonForLocation(locationPayload);
  const { assetData, assetLoading, assetError, assetLoadedCount } = useFetchJsonForAssets(assetsPayload);
  const { circuitData, circuitLoading, circuitError, circuitLoadedCount } = useFetchJsonForCircuits(circuitPayload);
  


  

function mergeAssetData(assets, circuits, locations) {
  return assets.map(asset => {
    
    const circuitData = circuits.find(c => c["Circuit Name"] == asset["Circuit Name"]) || {};
    const locationData = locations.find(l => l["Location"] == asset["Location"]) || {};

    return {
  "Assets Name": asset["Assets Name"],
  "Customer Name": asset["Customer Name"],
  "Location": asset["Location"],
  "Circuit Name": asset["Circuit Name"],
  "Make/Model": asset["Make/Model"],
  "Type": asset["Type"],
  "Monitored IP":  asset["Monitored IP"],
  "Public Usage Range": asset["Public Usage Range"],
  "Public Gateway IP": asset["Public Gateway"],
  "Public Subnet Mask": asset["Public Mask"],
  "Circuit Type": circuitData["Circuit Type"],
  "ISP Name": circuitData["ISP Name"],
  "Download Speed": circuitData["Download Speed"],
  "Upload Speed": circuitData["Upload Speed"],
  "ISP Contact No": circuitData["ISP Contact No"],
  "Service Level": circuitData["Service Level"],
  "Account Number": circuitData["Account Number"],
  "Location Phone": locationData["Location Phone"],
  "Location Address": locationData["Location Address"],
  "Timezone": locationData["Time Zone"],
  "Street": locationData["Street"],
  "City": locationData["City"],
  "State": locationData["State"],
  "Zip code": locationData["Zip code"]
 
      
    };
  });
}


  // Create normalized arrays and merge them
  const combinedData = useMemo(() => {
  // Wait until all data are fully loaded
  if (loading || assetLoading || circuitLoading) {
    return []; // return empty until everything is ready
  }

  // If any dataset is missing, also skip merge
  if (!data.length || !assetData.length || !circuitData.length) {
    return [];
  }

  return mergeAssetData(assetData, circuitData, data);
}, [loading, assetLoading, circuitLoading, data, assetData, circuitData]);

  console.log("all combined Data ",combinedData);
  
  // Combined loading and counts
  const combinedLoading = loading || assetLoading || circuitLoading;
  // const combinedLoadedCount = (locationLoadedCount || 0) + (assetLoadedCount || 0) + (circuitLoadedCount || 0);

if (error) return <div><AuthErrorCard message={String(error)}/></div>;
  if (assetError) return <div><AuthErrorCard message={String(error)}/></div>;
  if (circuitError) return <div><AuthErrorCard message={String(error)}/></div>;

  return (
    <div>
      <GridDataProvider>
      <MyNavbar />
      <div className=" mt-3">
        <Routes>
          <Route path="location" element={<GridLocation data={data} loading={loading} loadedCount={loadedCount} />} />
          <Route path="circuits" element={<GridCircuits data={circuitData} loading={circuitLoading} loadedCount={circuitLoadedCount} />} />
          <Route path="assets" element={<GridAssets data={assetData} loading={assetLoading} loadedCount={assetLoadedCount} />} />
           <Route
            path="combined"
            element={
              <GridCombinedData
                data={combinedData}
                loading={combinedLoading}
               
              />
            }
          />
          {/* default redirect */}
          <Route path="" element={<Navigate to="location" replace />} />
          {/* 404 fallback */}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </div>
      </GridDataProvider>
    </div>
  );
}

export default SearchApp;
