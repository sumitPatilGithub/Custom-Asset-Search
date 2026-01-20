
// import { invoke } from '@forge/bridge';
// import { useState, useEffect } from 'react';
// import { transformInsightObjects } from '../operations/FetchLocationData';

// export const useFetchJsonForLocation = (payload, limit, opts = {}) => {
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

//     const pageSize = opts.pageSize ?? 500;
//     // create a copy so we can safely mutate startAt
//     const pagePayload = { ...payload, startAt: payload.startAt ?? 0, maxResults: pageSize };

//     // local counter to avoid stale closure issues with loadedCount inside loop
//     let localLoaded = 0;

//     const fetchPages = async () => {
//       try {
//         let response = await invoke('getAssetsData', pagePayload);

//         const pageValues = response && response.values ? response.values : [];
//         const structuredPage = transformInsightObjects(pageValues);

//         if (cancelled) return;

//         localLoaded += structuredPage.length;
//         setData(prev => {
//           const merged = [...prev, ...structuredPage];
//           return limit ? merged.slice(0, limit) : merged;
//         });
//         setLoadedCount(localLoaded);

//         while (!response?.isLast && !cancelled) {
//           // Stop if we've reached the requested limit
//           if (limit && localLoaded >= limit) break;

//           pagePayload.startAt = (pagePayload.startAt ?? 0) + pageSize;
//           response = await invoke('getAssetsData', pagePayload);

//           const nextValues = response && response.values ? response.values : [];
//           const structuredNext = transformInsightObjects(nextValues);

//           if (cancelled) return;

//           localLoaded += structuredNext.length;
//           setData(prev => {
//             const merged = [...prev, ...structuredNext];
//             return limit ? merged.slice(0, limit) : merged;
//           });
//           setLoadedCount(localLoaded);
//         }
//       } catch (err) {
//         if (!cancelled) setError(err);
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     };

//     fetchPages();

//     return () => {
//       cancelled = true;
//     };
//   }, [JSON.stringify(payload), limit, opts.pageSize]);

//   return { data, loading, error, loadedCount };
// };
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
fetchPages();

    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(payload), limit, opts.pageSize]);

  return { data, loading, error, loadedCount };
};
