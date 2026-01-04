// import { invoke } from '@forge/bridge';
// import { useState, useEffect,useRef } from 'react';
// import { transformInsightObjects } from '../operations/FetchLocationData';

// /**
//  * Fetch example Json data
//  * Not recommended for production use!
//  */
// export const useFetchJson = (payload, limit) => {
//     const [data, setData] = useState();
//     const [loading, setLoading] = useState(false);
//     useEffect(() => {
//         const fetchData = async () => {
//             setLoading(true);

//             // Note error handling is omitted here for brevity
//             let response = await invoke("getCircuits",payload);
//             payload.startAt=500
//             // const json = await response.json();
//             console.log("objects",response);
//             const values=[];
//             values.push(response.values)
//             while(!response.data.isLast)
//             {
//                 response = await invoke("getCircuits",payload);
//                 payload.startAt+=500
//                 console.log("looping ",payload.startAt,"==>",response);

//                 values.push(response.values)

//             }
//             const flatValues=values.flat()
//             const structuredData=transformInsightObjects(flatValues)
//             console.log("structuredData",structuredData);

//             const data = limit ? json.slice(0, limit) : structuredData;
//             setLoading(false);
//             setData(data);

//         };
//         fetchData();
//     }, [ limit]);
//     return { data, loading };
// };

// import { invoke } from '@forge/bridge';
// import { useState, useEffect } from 'react';
// import { transformInsightObjects } from '../operations/FetchLocationData';

// /**
//  * Progressive fetch hook: fetches pages and appends them to `data` as each page arrives.
//  *
//  * @param {Object} payload - initial payload (will not be mutated)
//  *   Recommended to include any filters etc. Do NOT pass a new object each render or JSON.stringify will change.
//  * @param {number} [limit] - optional total item limit (stop early when reached)
//  * @param {Object} [opts] - optional settings: { pageSize } (default 500)
//  *
//  * Returns { data, loading, error, loadedCount }.
//  */
// export const useFetchJson = (payload, limit, opts = {}) => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [loadedCount, setLoadedCount] = useState(0);

//   useEffect(() => {
//     if (!payload) return;

//     let cancelled = false;
//     setLoading(true);
//     setError(null);
//     setData([]);
//     setLoadedCount(0);

//     // do not mutate incoming payload
//     const pageSize = opts.pageSize ?? 500;
//     const pagePayload = { ...payload, startAt: payload.startAt ?? 0, maxResults: pageSize };

//     const fetchPages = async () => {
//       try {
//         // first page
//         let response = await invoke('getCircuits', pagePayload);

//         // safe extraction and transform per-page
//         const pageValues = response && response.values ? response.values : [];
//         const structuredPage = transformInsightObjects(pageValues);

//         if (cancelled) return;
//         setData(prev => {
//           const merged = [...prev, ...structuredPage];
//           // apply global limit if provided
//           return limit ? merged.slice(0, limit) : merged;
//         });
//         setLoadedCount(prev => prev + structuredPage.length);
//         // setLoading(false)
//         // keep fetching while not last and not cancelled and limit not reached
//         while (!response.isLast && !cancelled) {
//           // stop if we've reached the requested limit
//           if (limit && (loadedCount + 0) >= limit) break;

//           pagePayload.startAt = (pagePayload.startAt ?? 0) + pageSize;
//           response = await invoke('getCircuits', pagePayload);

//           const nextValues = response && response.values ? response.values : [];
//           const structuredNext = transformInsightObjects(nextValues);

//           if (cancelled) return;

//           setData(prev => {
//             const merged = [...prev, ...structuredNext];
//             return limit ? merged.slice(0, limit) : merged;
//           });
//           setLoadedCount(prev => prev + structuredNext.length);
//         }
//       } catch (err) {
//         if (!cancelled) setError(err);
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     };

//     fetchPages();

//     // cleanup to avoid state updates after unmount or cancel
//     return () => {
//       cancelled = true;
//     };
//     // NOTE: We stringify payload so the effect runs only when payload content changes (not on object identity)
//     // If you prefer, pass a stable payloadRef from the caller to avoid stringify costs.
//   }, [JSON.stringify(payload), limit, opts.pageSize]);

//   return { data, loading, error, loadedCount };
// };

// UseFetchJson.jsx
// import { invoke } from "@forge/bridge";
import { useState, useEffect } from "react";
import { transformInsightObjects } from "../operations/FetchLocationData";
import axios from "axios";

export const useFetchJsonForLocation = (payload, limit, opts = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const BACKEND_URL = process.env.BACKEND_URL;
  useEffect(() => {
    if (!payload) return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    setData([]);
    setLoadedCount(0);

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
        let response =  await axios.post(
          `/api/assets`,
          pagePayload,
          {
            withCredentials: true, // sends cookies
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const pageValues = response && response.data.values ? response.data.values : [];
        const structuredPage = transformInsightObjects(pageValues);

        if (cancelled) return;

        localLoaded += structuredPage.length;
        setData((prev) => {
          const merged = [...prev, ...structuredPage];
          return limit ? merged.slice(0, limit) : merged;
        });
        setLoadedCount(localLoaded);

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
          const structuredNext = transformInsightObjects(nextValues);

          if (cancelled) return;

          localLoaded += structuredNext.length;
          setData((prev) => {
            const merged = [...prev, ...structuredNext];
            return limit ? merged.slice(0, limit) : merged;
          });
          setLoadedCount(localLoaded);
        }
      } catch (err) {
        if (!cancelled) setError("Please login again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };


//     const fetchPages = async () => {
//   try {
//     let response = await axios.post(
//       "http://localhost:4000/api/assets",
//       pagePayload,
//       { withCredentials: true }
//     );

//     let pageValues = response?.data?.values ?? [];
//     let isLast = response?.data?.isLast;

//     const structuredPage = transformInsightObjects(pageValues);

//     localLoaded += structuredPage.length;
//     setData(prev => {
//       const merged = [...prev, ...structuredPage];
//       return limit ? merged.slice(0, limit) : merged;
//     });
//     setLoadedCount(localLoaded);

//     while (!isLast && !cancelled) {
//       if (limit && localLoaded >= limit) break;

//       pagePayload.startAt += pageSize;

//       response = await axios.post(
//         "http://localhost:4000/api/assets",
//         pagePayload,
//         { withCredentials: true }
//       );

//       pageValues = response?.data?.values ?? [];
//       isLast = response?.data?.isLast;

//       const structuredNext = transformInsightObjects(pageValues);

//       localLoaded += structuredNext.length;
//       setData(prev => {
//         const merged = [...prev, ...structuredNext];
//         return limit ? merged.slice(0, limit) : merged;
//       });
//       setLoadedCount(localLoaded);
//     }
//   } catch (err) {
//     if (!cancelled) setError(err);
//   } finally {
//     if (!cancelled) setLoading(false);
//   }
// };

    fetchPages();

    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(payload), limit, opts.pageSize]);

  return { data, loading, error, loadedCount };
};
