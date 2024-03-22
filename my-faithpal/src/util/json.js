export default function addJSON(obj1, obj2) {
    // Create a new object to hold the combined properties
    var combined = {};

    // Copy properties from obj1 to combined
    for (var attr in obj1) {
        if (obj1.hasOwnProperty(attr)) {
            combined[attr] = obj1[attr];
        }
    }

    // Copy properties from obj2 to combined, avoiding duplicates
    for (var attr in obj2) {
        if (obj2.hasOwnProperty(attr) && !combined.hasOwnProperty(attr)) {
            combined[attr] = obj2[attr];
        }
    }

    return combined;
}
