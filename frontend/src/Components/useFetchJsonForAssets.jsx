// import { invoke } from "@forge/bridge";
// import { useState, useEffect } from "react";
// import { extractAssetInfo } from "../operations/FetchAssetsData";
// export const useFetchJsonForAssets = (payload, limit, opts = {}) => {
//   const [assetData, setAssetData] = useState([]);
//   const [assetLoading, setAssetLoading] = useState(false);
//   const [assetError, setAssetError] = useState(null);
//   const [assetLoadedCount, setAssetLoadedCount] = useState(0);

//   const BACKEND_URL = process.env.BACKEND_URL;
//   useEffect(() => {
//     if (!payload) return;

//     let cancelled = false;
//     setAssetLoading(true);
//     setAssetError(null);
//     setAssetData([]);
//     setAssetLoadedCount(0);

//     const pageSize = opts.pageSize ?? 500;
//     // create a copy so we can safely mutate startAt
//     const pagePayload = {
//       ...payload,
//       startAt: payload.startAt ?? 0,
//       maxResults: pageSize,
//     };

//     // local counter to avoid stale closure issues with loadedCount inside loop
//     let localLoaded = 0;

//     const fetchPages = async () => {
//       try {
//         // let response = await invoke('getAssetsData', pagePayload);
//         let response = await invoke('getAssetsData', pagePayload);
//         console.log("Respose Assets", response);

//         const pageValues = response && response.values ? response.values : [];
//         const structuredPage = extractAssetInfo(pageValues);

//         if (cancelled) return;

//         localLoaded += structuredPage.length;
//         setAssetData((prev) => {
//           const merged = [...prev, ...structuredPage];
//           return limit ? merged.slice(0, limit) : merged;
//         });
//         setAssetLoadedCount(localLoaded);

//         while (!response?.isLast && !cancelled) {
//           // Stop if we've reached the requested limit
//           if (limit && localLoaded >= limit) break;

//           pagePayload.startAt = (pagePayload.startAt ?? 0) + pageSize;
//           // response = await invoke("getAssetsData", pagePayload);
//           response = await invoke('getAssetsData', pagePayload);
//           const nextValues = response && response.values ? response.values : [];
//           const structuredNext = extractAssetInfo(nextValues);

//           if (cancelled) return;

//           localLoaded += structuredNext.length;
//           setAssetData((prev) => {
//             const merged = [...prev, ...structuredNext];
//             return limit ? merged.slice(0, limit) : merged;
//           });
//           setAssetLoadedCount(localLoaded);
//         }
//       } catch (err) {
//         if (!cancelled) setAssetError(err);
//       } finally {
//         if (!cancelled) setAssetLoading(false);
//       }
//     };

//     fetchPages();

//     return () => {
//       cancelled = true;
//     };
//   }, [payload, limit, opts.pageSize]);

//   return { assetData, assetLoading, assetError, assetLoadedCount };
// };


import { useState, useEffect } from "react";
import { extractAssetInfo } from "../operations/FetchAssetsData";
import axios from "axios";
export const useFetchJsonForAssets = (payload, limit, opts = {}) => {
  const [assetData, setAssetData] = useState([]);
  const [assetLoading, setAssetLoading] = useState(false);
  const [assetError, setAssetError] = useState(null);
  const [assetLoadedCount, setAssetLoadedCount] = useState(0);

  const BACKEND_URL = process.env.BACKEND_URL;
  useEffect(() => {
    if (!payload) return;

    let cancelled = false;
    setAssetLoading(true);
    setAssetError(null);
    setAssetData([]);
    setAssetLoadedCount(0);

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
        // let response = await invoke('getAssetsData', pagePayload);
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
        console.log("Respose Assets", response);

        const pageValues = response && response.data.values ? response.data.values : [];
        const structuredPage = extractAssetInfo(pageValues);

        if (cancelled) return;

        localLoaded += structuredPage.length;
        setAssetData((prev) => {
          const merged = [...prev, ...structuredPage];
          return limit ? merged.slice(0, limit) : merged;
        });
        setAssetLoadedCount(localLoaded);

        while (!response?.data.isLast && !cancelled) {
          // Stop if we've reached the requested limit
          if (limit && localLoaded >= limit) break;

          pagePayload.startAt = (pagePayload.startAt ?? 0) + pageSize;
          // response = await invoke("getAssetsData", pagePayload);
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
          const structuredNext = extractAssetInfo(nextValues);

          if (cancelled) return;

          localLoaded += structuredNext.length;
          setAssetData((prev) => {
            const merged = [...prev, ...structuredNext];
            return limit ? merged.slice(0, limit) : merged;
          });
          setAssetLoadedCount(localLoaded);
        }
      } catch (err) {
        if (!cancelled) setAssetError("Please login again.");
      } finally {
        if (!cancelled) setAssetLoading(false);
      }
    };

    fetchPages();

    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(payload), limit, opts.pageSize]);

  return { assetData, assetLoading, assetError, assetLoadedCount };
};

