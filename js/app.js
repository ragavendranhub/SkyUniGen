document.addEventListener("DOMContentLoaded", () => {
  const randomOptions = document.getElementById("random-options");
  const uuidOptions = document.getElementById("uuid-options");
  const skyOptions = document.getElementById("sky-values-options");
  const resultsDiv = document.getElementById("results");

  function switchOptions(selected) {
    randomOptions.style.display = selected === "Random" ? "block" : "none";
    uuidOptions.style.display = selected === "UUID" ? "block" : "none";
    skyOptions.style.display = selected === "SkyValues" ? "block" : "none";
    resultsDiv.innerHTML = ""; // Clear old results when switching options
  }

  document.querySelectorAll("input[name='option']").forEach((radio) => {
    radio.addEventListener("change", (e) => switchOptions(e.target.value));
  });

  document.getElementById("generate-btn").addEventListener("click", () => {
    // Clear old results
    resultsDiv.innerHTML = "";

    // Get active settings
    const selectedOption = document.querySelector("input[name='option']:checked").value;
    const count = parseInt(document.getElementById("count").value) || 1;

    let generated = [];
    if (selectedOption === "Random") {
      const includeAlphabets = document.getElementById("include-alphabets").checked;
      const includeNumeric = document.getElementById("include-numeric").checked;
      const includeSpecial = document.getElementById("include-special").checked;
      const length = parseInt(document.getElementById("random-length").value) || 8;

      const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const numeric = "0123456789";
      const special = "!@#$%^&*()";
      let charset = "";

      if (includeAlphabets) charset += alphabet;
      if (includeNumeric) charset += numeric;
      if (includeSpecial) charset += special;

      for (let i = 0; i < count; i++) {
        let value = "";
        for (let j = 0; j < length; j++) {
          value += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        generated.push(value);
      }
    } else if (selectedOption === "UUID") {
      for (let i = 0; i < count; i++) {
        generated.push(crypto.randomUUID());
      }
    } else if (selectedOption === "SkyValues") {
      const skyValue = document.getElementById("sky-dropdown").value;
      const prefix = document.getElementById("sky-prefix").value.trim(); // User-specified prefix

      // Maximum lengths for sky values
      const maxLengths = {
        DEVICE_APPLE: 12,
        EID: 32,
        ICCID: 20,
        IMEI: 15,
        MAC12: 12,
        MAC12OR16: 16,
        MAC16: 16,
        NDS: 16,
        SAGEM10: 10,
        SKY9: 9,
        SKY14: 14,
        SKY17: 17,
      };

      const maxLength = maxLengths[skyValue];

      if (prefix.length > maxLength) {
        alert(`The prefix "${prefix}" exceeds the maximum allowed length (${maxLength}) of the selected format "${skyValue}". Please shorten the prefix.`);
        return;
      }

      const availableLength = maxLength - prefix.length; // Deduct prefix length from max length

      for (let i = 0; i < count; i++) {
        let value = "";

        switch (skyValue) {
          case "DEVICE_APPLE":
            value = prefix + generateDeviceApple(availableLength);
            break;

          case "EID":
            value = prefix + generateEID(availableLength);
            break;

          case "ICCID":
            value = prefix + generateICCID(availableLength);
            break;

          case "IMEI":
            value = prefix + generateIMEI(availableLength);
            break;

          case "MAC12":
            value = prefix + generateMAC(availableLength, 12);
            break;

          case "MAC12OR16":
            value = prefix + generateMAC12OR16(availableLength);
            break;

          case "MAC16":
            value = prefix + generateMAC(availableLength, 16);
            break;

          case "NDS":
            value = prefix + generateNDS(availableLength);
            break;

          case "SAGEM10":
            value = prefix + generateSAGEM10(availableLength);
            break;

          case "SKY9":
            value = prefix + generateSKY9(availableLength);
            break;

          case "SKY14":
            value = prefix + generateSKY14(availableLength);
            break;

          case "SKY17":
            value = prefix + generateSKY17(availableLength);
            break;

          default:
            value = `${prefix}${skyValue}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        }

        generated.push(value);
      }
    }

    // Show results
    generated.forEach((result) => {
      const div = document.createElement("div");
      div.className = "result-item";
      div.textContent = result;
      resultsDiv.appendChild(div);
    });
  });

  // Updated Helper Functions

  function generateDeviceApple(availableLength) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let value = "";
    for (let i = 0; i < availableLength; i++) {
      value += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return value;
  }

  function generateEID(availableLength) {
    let value = "";
    for (let i = 0; i < availableLength; i++) {
      value += Math.floor(Math.random() * 10); // Numeric only
    }
    return value;
  }

  function generateICCID(availableLength) {
    let value = "89"; // ICCID always starts with "89"
    for (let i = 0; i < availableLength - 2; i++) {
      value += Math.floor(Math.random() * 10); // Numeric only
    }
    return value;
  }

  function generateIMEI(availableLength) {
    let value = "";
    for (let i = 0; i < availableLength; i++) {
      value += Math.floor(Math.random() * 10); // Numeric only
    }
    return value;
  }

  function generateMAC(availableLength, totalLength) {
    const charset = "0123456789ABCDEF";
    let value = "";
    for (let i = 0; i < Math.min(availableLength, totalLength); i++) {
      value += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return value;
  }

  function generateMAC12OR16(availableLength) {
    const totalLength = Math.random() > 0.5 ? 12 : 16; // Randomly choose 12 or 16
    return generateMAC(availableLength, totalLength);
  }

  function generateNDS(availableLength) {
    const charset = "ABCDEF0123456789";
    let value = "";
    for (let i = 0; i < availableLength; i++) {
      value += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return value;
  }

  function generateSAGEM10(availableLength) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const hexCharset = "ABCDEF0123456789";
    let value = "";

    // First 2 uppercase letters
    for (let i = 0; i < Math.min(2, availableLength); i++) {
      value += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }

    // Remaining hexadecimal characters
    for (let i = 0; i < availableLength - 2; i++) {
      value += hexCharset.charAt(Math.floor(Math.random() * hexCharset.length));
    }

    return value;
  }

  function generateSKY9(availableLength) {
    const prefix = "D"; // SKY9 always starts with "D"
    let value = "";
    for (let i = 0; i < availableLength - 1; i++) {
      value += Math.floor(Math.random() * 10); // Numeric only
    }
    return prefix + value;
  }

  function generateSKY14(availableLength) {
    const charsetAlphaNumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const charset0C = "0123C";
    const charset0E = "01234E";
    let value = "";

    // Generate parts while respecting available length
    if (availableLength >= 4) {
      for (let i = 0; i < 4; i++) {
        value += charsetAlphaNumeric.charAt(Math.floor(Math.random() * charsetAlphaNumeric.length));
      }
      availableLength -= 4;
    }

    if (availableLength >= 1) {
      value += charset0C.charAt(Math.floor(Math.random() * charset0C.length));
      availableLength--;
    }

    if (availableLength >= 1) {
      value += charset0E.charAt(Math.floor(Math.random() * charset0E.length));
      availableLength--;
    }

    for (let i = 0; i < availableLength; i++) {
      value += Math.floor(Math.random() * 10); // Remaining numeric
    }

    return value;
  }

  function generateSKY17() {
    // Regex-compliant segments based on SKY17 rules
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const alphaNumeric = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const hexDigits = "0123456789ABCDEF";

    // Step 1: Generate segments one by one to comply with regex
    // const part1 = randomString(letters, 2);                // [A-Z]{2}
    // const part2 = randomString(alphaNumeric, 2);          // [A-Z0-9]{2}
    // const part3 = randomString(letters, 2);               // [A-Z]{2}
    // const part4 = randomString(alphaNumeric, 1);          // [A-Z0-9]
    const part1 = "LT"            // [A-Z]{2}
    const part2 = "02"          // [A-Z0-9]{2}
    const part3 = "SK";               // [A-Z]{2}
    const part4 = "7";          // [A-Z0-9]
    const part5 = randomString("0123456789", 2);          // [0-9]{2}
    const part6 = generateRangeValue(0, 53);              // ([0-4][0-9]|5[0-3])
    const part7 = randomString(hexDigits, 5);             // [A-F0-9]{5}

    // Combine parts (without the checksum character yet)
    const partialKey = `${part1}${part2}${part3}${part4}${part5}${part6}${part7}`;

    // Step 2: Calculate Luhn checksum
    const luhnChecksum = calculateLuhnChecksum(partialKey);

    // Step 3: Append checksum to complete the SKY17 key
    const fullKey = partialKey + luhnChecksum;

    // Step 4: Final validation to ensure compliance to regex
    const regex = /^[A-Z]{2}[A-Z0-9]{2}[A-Z]{2}[A-Z0-9][0-9]{2}([0-4][0-9]|5[0-3])[A-F0-9]{5}[A-Z0-9]$/;

    if (!regex.test(fullKey)) {
      throw new Error(`Generated SKY17 value does not match regex: ${fullKey}`);
    }

    return fullKey;
  }

// Helper function to generate random string of specified length from charset
  function randomString(charset, length) {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  }

// Helper function to generate a 2-digit range value (00-53 compliance)
  function generateRangeValue(min, max) {
    const value = Math.floor(Math.random() * (max - min + 1)) + min; // Random number in range
    return value.toString().padStart(2, "0"); // Ensure 2-digit string
  }

  function calculateLuhnChecksum(value) {
    // Character-to-code-point mapping
    const codePointMap = {
      "0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9,
      "A": 10, "B": 11, "C": 12, "D": 13, "E": 14, "F": 15, "G": 16, "H": 17, "I": 18, "J": 19,
      "K": 20, "L": 21, "M": 22, "N": 23, "O": 24, "P": 25, "Q": 26, "R": 27, "S": 28, "T": 29,
      "U": 30, "V": 31, "W": 32, "X": 33, "Y": 34, "Z": 35
    };

    const reverseCodePointMap = Object.entries(codePointMap).reduce((acc, [key, value]) => {
      acc[value] = key;
      return acc;
    }, {});

    // Step 1: Map characters to their code points
    const values = value.split("").map(char => {
      const codePoint = codePointMap[char];
      if (codePoint === undefined) {
        throw new Error(`Invalid character: ${char}`);
      }
      return codePoint;
    });

    // Step 2 & 3: Apply doubling and base-36 adjustments
    const processedValues = values.map((num, index) => {
      // Step 2: Double if the index is even (1-based index calculation)
      const isEvenIndex = (index + 1) % 2 === 0; // 1-based index
      let doubledValue = isEvenIndex ? num * 2 : num;

      // Step 3: Apply base-36 adjustment if value > 36
      if (doubledValue > 36) {
        doubledValue = 1 + (doubledValue - 36);
      }

      return doubledValue;
    });

    // Step 4: Compute the sum of all processed values
    const sum = processedValues.reduce((acc, num) => acc + num, 0);

    // Step 5: Modulo operation
    const modValue = sum % 36;

    // Step 6: Subtract modulo value from 36
    const finalValue = (36 - modValue) % 36;

    // Step 7: Map the final value back to a character
    const checksumCharacter = reverseCodePointMap[finalValue];
    if (!checksumCharacter) {
      throw new Error(`Failed to map checksum value (${finalValue}) to character`);
    }

    return checksumCharacter;
  }

});
