export function extractAssetInfo(assetArray) {
  return assetArray.map(obj => {
    const attrs = obj.attributes;

    const getAttr = (id) => {
      const found = attrs.find(a => a.objectTypeAttributeId == id);
      if (!found) return "";
      const val = found.objectAttributeValues?.[0];
      return val?.displayValue || val?.value || "";
    };

    return {
      "Assets Name": obj.label || "",
      "Customer Name": getAttr(92),       // referencedObject.label = Customer
      "Location": getAttr(93),            // referencedObject.label = Location
      "Circuit Name": getAttr(162),       // Circuit Object Label
      "Make/Model": getAttr(94),
      "Type": getAttr(95),
      "Monitored IP": getAttr(96),
      "Public Usage Range": getAttr(97),
      "Public Gateway": getAttr(98),
      "Public Mask": getAttr(99)
    };
  });
}
