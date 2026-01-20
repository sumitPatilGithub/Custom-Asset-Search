

// import { invoke } from '@forge/bridge';
// import { useState, useEffect } from 'react';
// import { extractCircuitData } from '../operations/FetchCircuitsData';



// export const useFetchJsonForCircuits = (payload, limit, opts = {}) => {
//   const [circuitData, setCircuitData] = useState([]);
//   const [circuitLoading, setCircuitLoading] = useState(false);
//   const [circuitError, setCircuitError] = useState(null);
//   const [circuitLoadedCount, setCircuitLoadedCount] = useState(0);

//   useEffect(() => {
//     if (!payload) return;

//     let cancelled = false;
//     setCircuitLoading(true);
//     setCircuitError(null);
//     setCircuitData([]);
//     setCircuitLoadedCount(0);

//     const pageSize = opts.pageSize ?? 300;
//     // create a copy so we can safely mutate startAt
//     const pagePayload = { ...payload, startAt: payload.startAt ?? 0, maxResults: pageSize };

//     // local counter to avoid stale closure issues with loadedCount inside loop
//     let localLoaded = 0;

//     const fetchPages = async () => {
//       try {
//         let response = await invoke('getAssetsData', pagePayload);

//         console.log("Respose Circuits",response);
        

//         const pageValues = response && response.values ? response.values : [];
//         const structuredPage = extractCircuitData(pageValues);

//         if (cancelled) return;

//         localLoaded += structuredPage.length;
//         setCircuitData(prev => {
//           const merged = [...prev, ...structuredPage];
//           return limit ? merged.slice(0, limit) : merged;
//         });
//         setCircuitLoadedCount(localLoaded);

//         while (!response?.isLast && !cancelled) {
//           // Stop if we've reached the requested limit
//           if (limit && localLoaded >= limit) break;

//           pagePayload.startAt = (pagePayload.startAt ?? 0) + pageSize;
//           response = await invoke('getAssetsData', pagePayload);

//           const nextValues = response && response.values ? response.values : [];
//           const structuredNext = extractCircuitData(nextValues);

//           if (cancelled) return;

//           localLoaded += structuredNext.length;
//           setCircuitData(prev => {
//             const merged = [...prev, ...structuredNext];
//             return limit ? merged.slice(0, limit) : merged;
//           });
//           setCircuitLoadedCount(localLoaded);
//         }
//       } catch (err) {
//         if (!cancelled) setCircuitError(err);
//         console.log("Error",err);
        
//       } finally {
//         if (!cancelled) setCircuitLoading(false);
//       }
//     };

//     fetchPages();

//     return () => {
//       cancelled = true;
//     };
//   }, [JSON.stringify(payload), limit, opts.pageSize]);

//   return { circuitData, circuitLoading, circuitError, circuitLoadedCount };
// };
// import { invoke } from "@forge/bridge";
import { useState, useEffect } from "react";
import { extractCircuitData } from "../operations/FetchCircuitsData";
import axios from "axios";

export const useFetchJsonForCircuits = (payload, limit, opts = {}) => {
  const [circuitData, setCircuitData] = useState([]);
  const [circuitLoading, setCircuitLoading] = useState(false);
  const [circuitError, setCircuitError] = useState(null);
  const [circuitLoadedCount, setCircuitLoadedCount] = useState(0);
  const BACKEND_URL = process.env.BACKEND_URL;
  useEffect(() => {
    if (!payload) return;

    let cancelled = false;
    setCircuitLoading(true);
    setCircuitError(null);
    setCircuitData([]);
    setCircuitLoadedCount(0);

    const pageSize = opts.pageSize ?? 1000;
    // create a copy so we can safely mutate startAt
    const pagePayload = {
      ...payload,
      startAt: payload.startAt ?? 0,
      maxResults: pageSize,
    };

    // local counter to avoid stale closure issues with loadedCount inside loop
    let localLoaded = 0;

    const fetchPages = async () => {
      try {
        let response = await axios.post(
          `/api/assets`,
          pagePayload,
          {
            withCredentials: true, // sends cookies
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Respose Circuits", response);

        const pageValues = response && response.data.values ? response.data.values : [];
        const structuredPage = extractCircuitData(pageValues);

        if (cancelled) return;

        localLoaded += structuredPage.length;
        setCircuitData((prev) => {
          const merged = [...prev, ...structuredPage];
          return limit ? merged.slice(0, limit) : merged;
        });
        setCircuitLoadedCount(localLoaded);

        while (!response?.data.isLast && !cancelled) {
          // Stop if we've reached the requested limit
          if (limit && localLoaded >= limit) break;

          pagePayload.startAt = (pagePayload.startAt ?? 0) + pageSize;
          response = await axios.post(
          `/api/assets`,
          pagePayload,
          {
            withCredentials: true, // sends cookies
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

          const nextValues = response && response.data.values ? response.data.values : [];
          const structuredNext = extractCircuitData(nextValues);

          if (cancelled) return;

          localLoaded += structuredNext.length;
          setCircuitData((prev) => {
            const merged = [...prev, ...structuredNext];
            return limit ? merged.slice(0, limit) : merged;
          });
          setCircuitLoadedCount(localLoaded);
        }
      } catch (err) {
        if (!cancelled) setCircuitError("Please login again.");
        console.log("Error", err);
      } finally {
        if (!cancelled) setCircuitLoading(false);
      }
    };

    fetchPages();

    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(payload), limit, opts.pageSize]);

  return { circuitData, circuitLoading, circuitError, circuitLoadedCount };
};