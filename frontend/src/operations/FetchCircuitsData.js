export function extractCircuitData(objects) {
  return objects.map(obj => {
    const getAttr = (attrId) => {
      const found = obj.attributes.find(a => a.objectTypeAttributeId == attrId);
      return found?.objectAttributeValues?.[0]?.displayValue || "";
    };

    return {
      "Circuit Name": getAttr(76),             // label
      "Customer Name": getAttr(85),            // customer (referenced)
      "Location": getAttr(127),                // location (referenced)
      "Asset Name": getAttr(163),              // modem/device
      "Circuit Type": getAttr(86),             // Cable/Fiber/etc
      "ISP Name": getAttr(87),                 // Comcast
      "Download Speed": getAttr(88),           // 50M
      "Upload Speed": getAttr(89),             // 15M
      "Account #": getAttr(90),                // #8499100450052230
      "ISP Contact No": getAttr(91),           // 1-866-308-1054
      "Service Level": getAttr(157),           // if exists → update attr id
      "Account Number": getAttr(187),          // duplicate account
      "ISP Name (Provider Name)": getAttr(87)  // same as ISP Name unless different field
    };
  });
}
