/**
 * transformInsightObjects - flatten Insight objects into requested fields
 *
 * Returns array of objects with these exact keys:
 * Location,
 * Customer Name,
 * Asset Name,
 * Circuit Name,
 * Location Phone,
 * Location Address,
 * Time Zone,
 * Street,
 * City,
 * State,
 * Zip code
 *
 * Works with attributes that are plain values or referenced objects.
 */
export function transformInsightObjects(input) {

    console.log("Input",input);
    
  const items = Array.isArray(input) ? input : [input];

  const safeFirst = (attr) => {
    if (!attr || !Array.isArray(attr.objectAttributeValues)) return null;
    const v = attr.objectAttributeValues[0];
    if (!v) return null;
    if (v.referencedType && v.referencedObject) {
      // prefer human name fields on referenced object
      return v.referencedObject.name ?? v.referencedObject.label ?? v.value ?? null;
    }
    return v.displayValue ?? v.value ?? null;
  };

  const findAttrById = (obj, id) => {
    if (!obj || !Array.isArray(obj.attributes)) return null;
    const str = String(id);
    return obj.attributes.find(a =>
      String(a.id) === str || String(a.objectTypeAttributeId) === str
    ) ?? null;
  };

  const findAnyReferenced = (obj, matchFn) => {
    if (!obj || !Array.isArray(obj.attributes)) return null;
    return obj.attributes.find(a => {
      const v = a.objectAttributeValues && a.objectAttributeValues[0];
      return v && v.referencedType && matchFn(v.referencedObject);
    }) ?? null;
  };

  const extractPhone = (raw) => {
    if (!raw) return null;
    // pattern like "Name @ 123-456-7890" or just a phone inside text
    const atSplit = raw.split(/\s*@\s*/);
    if (atSplit.length === 2) {
      return atSplit[1].trim();
    }
    const phoneMatch = raw.match(/(\+?\d[\d\-\s\(\)]{6,}\d)/);
    return phoneMatch ? phoneMatch[0].trim() : raw;
  };

  return items.map(obj => {
    // Known attribute IDs from your examples:
    // 84 -> Location label
    // 100 -> Customer (referenced)
    // 160 -> Asset (referenced)
    // 161 -> Circuit (referenced)
    // 101 -> Contact (Name @ Phone)
    // 103 -> Full address
    // 102 -> Time zone
    // 222 -> Street
    // 220 -> City
    // 223 -> State
    // 221 -> Zip

    const attr84 = findAttrById(obj, 84);
    const attr100 = findAttrById(obj, 100);
    const attr160 = findAttrById(obj, 160);
    const attr161 = findAttrById(obj, 161);
    const attr101 = findAttrById(obj, 101);
    const attr103 = findAttrById(obj, 103);
    const attr102 = findAttrById(obj, 102);
    const attr222 = findAttrById(obj, 222);
    const attr220 = findAttrById(obj, 220);
    const attr223 = findAttrById(obj, 223);
    const attr221 = findAttrById(obj, 221);

    // Additional fallback: if asset/circuit not at known ids, try to find referenced object by objectType name
    const assetAttr = attr160 || findAnyReferenced(obj, ro => /asset/i.test(ro.name || ro.label || ''));
    const circuitAttr = attr161 || findAnyReferenced(obj, ro => /circuit/i.test(ro.name || ro.label || ''));

    const location = safeFirst(attr84) || obj.name || obj.label || null;
    const customerName = safeFirst(attr100) || null;
    const assetName = safeFirst(assetAttr) || null;
    const circuitName = safeFirst(circuitAttr) || null;
    const locationPhone = extractPhone(safeFirst(attr101));
    const locationAddress = safeFirst(attr103) || [safeFirst(attr222), safeFirst(attr220), safeFirst(attr223), safeFirst(attr221)]
      .filter(Boolean).join(' ') || null;
    const timeZone = safeFirst(attr102) || null;
    const street = safeFirst(attr222) || null;
    const city = safeFirst(attr220) || null;
    const state = safeFirst(attr223) || null;
    const zip = safeFirst(attr221) || null;

    return {
      "Location": location,
      "Customer Name": customerName,
      "Asset Name": assetName,
      "Circuit Name": circuitName,
      "Location Phone": locationPhone,
      "Location Address": locationAddress,
      "Time Zone": timeZone,
      "Street": street,
      "City": city,
      "State": state,
      "Zip code": zip
    };
  });
}
