import CryptoJS from "crypto-js";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// Add decryption utility
const decryptApiKey = (encryptedKey: string): string => {
  const ENCRYPTION_KEY =
    process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "fallback-encryption-key";
  const bytes = CryptoJS.AES.decrypt(encryptedKey, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const sendToGoHighLevel = async (
  formData: any,
  countryCode: string,
  paymentStatus: string,
  encryptedApiKey: string,
  productName?: string // Change description to productName
) => {
  let retries = 0;

  const attemptSend = async () => {
    try {
      // Decrypt the API key
      const apiKey = decryptApiKey(encryptedApiKey);

      // Create tags array with payment status and product name
      const tags = [paymentStatus];
      if (productName) {
        // Clean and format the product name for use as a tag
        const productTag = productName
          .replace(/[^a-zA-Z0-9\s-]/g, "") // Remove special characters
          .trim()
          .replace(/\s+/g, "-") // Replace spaces with hyphens
          .toLowerCase();
        tags.push(productTag);
      }

      const payload = {
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
        phone: `${countryCode}${formData.phoneNumber}`,
        address1: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        tags: tags.join(","), // Join tags with comma
        customField: {
          trxn_hash: formData.trxn_hash || "",
          wallet_address: formData.wallet_address || "",
          payment_status: formData.payment_status || "incomplete",
          product_name: productName || "", // Add product name to custom fields
        },
      };

      const response = await fetch(
        "https://rest.gohighlevel.com/v1/contacts/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`, // Use the decrypted API key
          },
          body: JSON.stringify(payload),
        }
      );

  
      // Handle rate limiting (429 Too Many Requests)
      if (response.status === 429) {
        // Rate limit hit - wait and retry if under max retries
        if (retries < MAX_RETRIES) {
          retries++;
          console.log(
            `Rate limit hit, retrying (${retries}/${MAX_RETRIES})...`
          );
          // Exponential backoff - wait longer with each retry
          await new Promise((resolve) =>
            setTimeout(resolve, RETRY_DELAY_MS * Math.pow(2, retries))
          );
          return attemptSend();
        } else {
          throw new Error("Rate limit exceeded after multiple retries");
        }
      }

      if (!response.ok) {
        // Check if response can be parsed as JSON
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          try {
            const errorData = await response.json();
            throw new Error(
              errorData.message ||
                `Error: ${response.status} ${response.statusText}`
            );
          } catch (jsonError) {
            // If JSON parsing fails, use text response
            const errorText = await response.text();
            throw new Error(
              `Error ${response.status}: ${errorText || response.statusText}`
            );
          }
        } else {
          // Handle non-JSON error responses
          const errorText = await response.text();
          throw new Error(
            `Error ${response.status}: ${errorText || response.statusText}`
          );
        }
      }

      return await response.json();
    } catch (error) {
      console.error("GoHighLevel API error:", error);
      throw error;
    }
  };

  return attemptSend();
};
