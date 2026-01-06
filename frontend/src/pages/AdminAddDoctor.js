    if (name === "specializations") {
      const newSpecializations = value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "");
      const uniqueSpecializations = [];
      let duplicateFound = false;
      for (const spec of newSpecializations) {
        if (!uniqueSpecializations.includes(spec)) {
          uniqueSpecializations.push(spec);
        } else {
          duplicateFound = true;
        }
      }
      if (duplicateFound) {
        alert("Duplicate specialization detected and removed.");
      }
      processedValue = uniqueSpecializations.join(", ");
    }