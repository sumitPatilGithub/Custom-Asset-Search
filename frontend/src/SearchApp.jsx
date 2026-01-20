// import React, { useMemo, useState } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import { useFetchJsonForLocation } from "./Components/useFetchJsonForLocation";
// import MyNavbar from "./Components/Nav";
// import GridLocation from "./Components/GridLocation";
// import GridCircuits from "./Components/GridCircuits";
// import GridAssets from "./Components/GridAssets";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { useFetchJsonForAssets } from "./Components/useFetchJsonForAssets";
// import { useFetchJsonForCircuits } from "./Components/useFetchJsonForCircuits";
// import GridCombinedData from "./Components/GridCombinedData";
// import AuthErrorCard from "./AuthErrorCard";
// import axios from "axios";
// import { useEffect } from "react";
// import { GridDataProvider } from "./Components/GridDataContext";


// function SearchApp({ userEmail }) {
// const [custData,setCustData]=useState({companies:[]});


//   useEffect(()=>
//   {
//     function getEmailAndCompanies(data) {
//   let email = null;
//   let companies = [];

//   if (!data || !Array.isArray(data.attributes)) {
//     return { email, companies };
//   }

//   data.attributes.forEach(attr => {
//     // Email attribute
//     if (attr.objectTypeAttributeId === "120") {
//       email = attr.objectAttributeValues?.[0]?.value || null;
//     }

//     // Companies attribute
//     if (attr.objectTypeAttributeId === "125") {
//       companies = attr.objectAttributeValues
//         .filter(v => v.referencedType && v.referencedObject)
//         .map(v => ({
//           id: v.referencedObject.id,
//           key: v.referencedObject.objectKey,
//           name: v.referencedObject.name
//         }));
//     }
//   });

//   return {
//     email,
//     companies
//   };
// }
//      const fetchUserCompanies=async()=>
//      {
//    const payload = {
//       query:`objectType = \"External Employees\" AND \"Email\" = \"${userEmail}\"`,
//       startAt:  0,
//       maxResults: 1000,
//     };

//         let response =  await axios.post(
//           `/api/assets`,
//           payload,
//           {
//             withCredentials: true, // sends cookies
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         const values = response && response.data.values ? response.data.values : [];

//         console.log("UserData",values);
//         const userData=getEmailAndCompanies(values[0]);

//         console.log("all company data",userData);
        
//         setCustData(userData)
    


//      }
//      fetchUserCompanies()

//   },[]);

//   const locationPayload = useMemo(
//     () => ({
//       query: 'objectType  = "Location List"',
//       workspaceId: "95aaeb5c-8417-4a83-811c-735e4c08c346",
//       startAt: 0,
//     }),
//     []
//   );

//   const assetsPayload = useMemo(
//     () => ({
//       query: 'objectType  = "Assets List"',
//       workspaceId: "95aaeb5c-8417-4a83-811c-735e4c08c346",
//       startAt: 0,
//     }),
//     []
//   );

//   const circuitPayload = useMemo(
//     () => ({
//       query: `objectType = "Circuit List"
//       AND "Customer Name".Name IN (${custData.companies
//         .map(c => `"${c.name}"`)
//         .join(", ")})`,
//       workspaceId: "95aaeb5c-8417-4a83-811c-735e4c08c346",
//       startAt: 0,
//     }),
//     []
//   );

//   const { data, loading, error, loadedCount } =
//     useFetchJsonForLocation(locationPayload);
//   const { assetData, assetLoading, assetError, assetLoadedCount } =
//     useFetchJsonForAssets(assetsPayload);
//   const { circuitData, circuitLoading, circuitError, circuitLoadedCount } =
//     useFetchJsonForCircuits(circuitPayload);

//   function mergeAssetData(assets, circuits, locations) {
//     return assets.map((asset) => {
//       const circuitData =
//         circuits.find((c) => c["Circuit Name"] == asset["Circuit Name"]) || {};
//       const locationData =
//         locations.find((l) => l["Location"] == asset["Location"]) || {};

//       return {
//         "Assets Name": asset["Assets Name"],
//         "Customer Name": asset["Customer Name"],
//         Location: asset["Location"],
//         "Circuit Name": asset["Circuit Name"],
//         "Make/Model": asset["Make/Model"],
//         Type: asset["Type"],
//         "Monitored IP": asset["Monitored IP"],
//         "Public Usage Range": asset["Public Usage Range"],
//         "Public Gateway IP": asset["Public Gateway"],
//         "Public Subnet Mask": asset["Public Mask"],
//         "Circuit Type": circuitData["Circuit Type"],
//         "ISP Name": circuitData["ISP Name"],
//         "Download Speed": circuitData["Download Speed"],
//         "Upload Speed": circuitData["Upload Speed"],
//         "ISP Contact No": circuitData["ISP Contact No"],
//         "Service Level": circuitData["Service Level"],
//         "Account Number": circuitData["Account Number"],
//         "Location Phone": locationData["Location Phone"],
//         "Location Address": locationData["Location Address"],
//         Timezone: locationData["Time Zone"],
//         Street: locationData["Street"],
//         City: locationData["City"],
//         State: locationData["State"],
//         "Zip code": locationData["Zip code"],
//       };
//     });
//   }

//   // Create normalized arrays and merge them
//   const combinedData = useMemo(() => {
//     // Wait until all data are fully loaded
//     if (loading || assetLoading || circuitLoading) {
//       return []; // return empty until everything is ready
//     }

//     // If any dataset is missing, also skip merge
//     if (!data.length || !assetData.length || !circuitData.length) {
//       return [];
//     }

//     return mergeAssetData(assetData, circuitData, data);
//   }, [loading, assetLoading, circuitLoading, data, assetData, circuitData]);

//   console.log("all combined Data ", combinedData);

//   // Combined loading and counts
//   const combinedLoading = loading || assetLoading || circuitLoading;
//   // const combinedLoadedCount = (locationLoadedCount || 0) + (assetLoadedCount || 0) + (circuitLoadedCount || 0);

//   if (error)
//     return (
//       <div>
//         <AuthErrorCard message={String(error)} />
//       </div>
//     );
//   if (assetError)
//     return (
//       <div>
//         <AuthErrorCard message={String(error)} />
//       </div>
//     );
//   if (circuitError)
//     return (
//       <div>
//         <AuthErrorCard message={String(error)} />
//       </div>
//     );

//   return (
//     <div>
//       <GridDataProvider>
//         <MyNavbar />
//         <div className=" mt-3">
//           <Routes>
//             <Route
//               path="location"
//               element={
//                 <GridLocation
//                   data={data}
//                   loading={loading}
//                   loadedCount={loadedCount}
//                 />
//               }
//             />
//             <Route
//               path="circuits"
//               element={
//                 <GridCircuits
//                   data={circuitData}
//                   loading={circuitLoading}
//                   loadedCount={circuitLoadedCount}
//                 />
//               }
//             />
//             <Route
//               path="assets"
//               element={
//                 <GridAssets
//                   data={assetData}
//                   loading={assetLoading}
//                   loadedCount={assetLoadedCount}
//                 />
//               }
//             />
//             <Route
//               path="combined"
//               element={
//                 <GridCombinedData
//                   data={combinedData}
//                   loading={combinedLoading}
//                 />
//               }
//             />
//             {/* default redirect */}
//             <Route path="" element={<Navigate to="location" replace />} />
//             {/* 404 fallback */}
//             <Route path="*" element={<div>Page not found</div>} />
//           </Routes>
//         </div>
//       </GridDataProvider>
//     </div>
//   );
// }

// export default SearchApp;

import React, { useMemo, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

import MyNavbar from "./Components/Nav";
import GridLocation from "./Components/GridLocation";
import GridCircuits from "./Components/GridCircuits";
import GridAssets from "./Components/GridAssets";
import GridCombinedData from "./Components/GridCombinedData";
import AuthErrorCard from "./AuthErrorCard";

import { useFetchJsonForLocation } from "./Components/useFetchJsonForLocation";
import { useFetchJsonForAssets } from "./Components/useFetchJsonForAssets";
import { useFetchJsonForCircuits } from "./Components/useFetchJsonForCircuits";
import { GridDataProvider } from "./Components/GridDataContext";
import '@atlaskit/css-reset';


function SearchApp({ userEmail }) {
  const [custData, setCustData] = useState({ email: null, companies: [] });

  /* ---------------- FETCH USER + COMPANIES ---------------- */
  useEffect(() => {
    function getEmailAndCompanies(data) {
      let email = null;
      let companies = [];

      if (!data || !Array.isArray(data.attributes)) {
        return { email, companies };
      }

      data.attributes.forEach(attr => {
        // Email
        if (attr.objectTypeAttributeId === "120") {
          email = attr.objectAttributeValues?.[0]?.value || null;
        }

        // Companies
        if (attr.objectTypeAttributeId === "125") {
          companies = attr.objectAttributeValues
            .filter(v => v.referencedObject)
            .map(v => ({
              id: v.referencedObject.id,
              key: v.referencedObject.objectKey,
              name: v.referencedObject.name,
            }));
        }
      });

      return { email, companies };
    }

    async function fetchUserCompanies() {
      try {
        const payload = {
          query: `objectType = "External Employees" AND "Email" = "${userEmail}"`,
          startAt: 0,
          maxResults: 1000,
        };

        const response = await axios.post("/api/assets", payload, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });

        const values = response?.data?.values || [];
        if (values.length) {
          const userData = getEmailAndCompanies(values[0]);
          setCustData(userData);
        }
      } catch (err) {
        console.error("Failed to fetch user companies", err);
      }
    }

    fetchUserCompanies();
  }, [userEmail]);

  /* ---------------- PAYLOADS ---------------- */
  const workspaceId = "95aaeb5c-8417-4a83-811c-735e4c08c346";

  // const locationPayload = useMemo(
  //   () => ({
  //     query: 'objectType = "Location List"',
  //     workspaceId,
  //     startAt: 0,
  //   }),
  //   []
  // );

  const locationPayload = useMemo(() => {
    const companyNames = custData.companies
      .map(c => `"${c.name}"`)
      .join(", ");

    return {
      query: companyNames
        ? `objectType = "Location List"
           AND "Customer Name".Name IN (${companyNames})`
        : `objectType = "Location List"`,
      workspaceId,
      startAt: 0,
    };
  }, [custData.companies]);

  const shouldFetchLocations = custData.companies.length > 0;


  // const assetsPayload = useMemo(
  //   () => ({
  //     query: 'objectType = "Assets List"',
  //     workspaceId,
  //     startAt: 0,
  //   }),
  //   []
  // );
const assetsPayload = useMemo(() => {
    const companyNames = custData.companies
      .map(c => `"${c.name}"`)
      .join(", ");

    return {
      query: companyNames
        ? `objectType = "Assets List"
           AND "Customer Name".Name IN (${companyNames})`
        : `objectType = "Assets List"`,
      workspaceId,
      startAt: 0,
    };
  }, [custData.companies]);

const shouldFetchAssets = custData.companies.length > 0;

///////////////////////////////////////////////////////////////////////////////////////////////
  const circuitPayload = useMemo(() => {
    const companyNames = custData.companies
      .map(c => `"${c.name}"`)
      .join(", ");

    return {
      query: companyNames
        ? `objectType = "Circuit List"
           AND "Customer Name".Name IN (${companyNames})`
        : `objectType = "Circuit List"`,
      workspaceId,
      startAt: 0,
    };
  }, [custData.companies]);

  const shouldFetchCircuits = custData.companies.length > 0;

  /* ---------------- FETCH DATA ---------------- */
  const { data, loading, error, loadedCount } =
    useFetchJsonForLocation(shouldFetchLocations?locationPayload:null);

  const { assetData, assetLoading, assetError, assetLoadedCount } =
    useFetchJsonForAssets(shouldFetchAssets ? assetsPayload : null);

  const {
    circuitData,
    circuitLoading,
    circuitError,
    circuitLoadedCount,
  } = useFetchJsonForCircuits(
    shouldFetchCircuits ? circuitPayload : null
  );

  /* ---------------- MERGE DATA ---------------- */
  function mergeAssetData(assets, circuits, locations) {
    return assets.map(asset => {
      const circuit =
        circuits.find(c => c["Circuit Name"] === asset["Circuit Name"]) || {};
      const location =
        locations.find(l => l["Location"] === asset["Location"]) || {};

      return {
        "Assets Name": asset["Assets Name"],
        "Customer Name": asset["Customer Name"],
        Location: asset["Location"],
        "Circuit Name": asset["Circuit Name"],
        "Make/Model": asset["Make/Model"],
        Type: asset["Type"],
        "Monitored IP": asset["Monitored IP"],
        "Public Usage Range": asset["Public Usage Range"],
        "Public Gateway IP": asset["Public Gateway"],
        "Public Subnet Mask": asset["Public Mask"],
        "Circuit Type": circuit["Circuit Type"],
        "ISP Name": circuit["ISP Name"],
        "Download Speed": circuit["Download Speed"],
        "Upload Speed": circuit["Upload Speed"],
        "ISP Contact No": circuit["ISP Contact No"],
        "Service Level": circuit["Service Level"],
        "Account Number": circuit["Account Number"],
        "Location Phone": location["Location Phone"],
        "Location Address": location["Location Address"],
        Timezone: location["Time Zone"],
        Street: location["Street"],
        City: location["City"],
        State: location["State"],
        "Zip code": location["Zip code"],
      };
    });
  }

  const combinedData = useMemo(() => {
    if (loading || assetLoading || circuitLoading) return [];
    if (!data.length || !assetData.length || !circuitData.length) return [];
    return mergeAssetData(assetData, circuitData, data);
  }, [
    loading,
    assetLoading,
    circuitLoading,
    data,
    assetData,
    circuitData,
  ]);

  const combinedLoading = loading || assetLoading || circuitLoading;

  /* ---------------- ERROR HANDLING ---------------- */
  if (error || assetError || circuitError) {
    return (
      <AuthErrorCard
        message={String(error || assetError || circuitError)}
      />
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <GridDataProvider>
      <MyNavbar />
      <div className="mt-3">
        <Routes>
          <Route
            path="location"
            element={
              <GridLocation
                data={data}
                loading={loading}
                loadedCount={loadedCount}
              />
            }
          />
          <Route
            path="circuits"
            element={
              <GridCircuits
                data={circuitData}
                loading={circuitLoading}
                loadedCount={circuitLoadedCount}
              />
            }
          />
          <Route
            path="assets"
            element={
              <GridAssets
                data={assetData}
                loading={assetLoading}
                loadedCount={assetLoadedCount}
              />
            }
          />
          <Route
            path="combined"
            element={
              <GridCombinedData
                data={combinedData}
                loading={combinedLoading}
              />
            }
          />
          <Route path="" element={<Navigate to="location" replace />} />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </div>
    </GridDataProvider>
  );
}

export default SearchApp;
