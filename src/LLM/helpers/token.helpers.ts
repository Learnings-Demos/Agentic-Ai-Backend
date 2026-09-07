import { decode, encode } from "@toon-format/toon";

/* -------------------------------------------------------------------------- */
/*                                Encode Toon                                 */
/* -------------------------------------------------------------------------- */
export const encodeToon = (data: any) => {
  return encode(normalizeMessages(data));
};

/* -------------------------------------------------------------------------- */
/*                          Normalize State Messages                          */
/* -------------------------------------------------------------------------- */
export const normalizeMessages = (messages: any) => {
  function getRole(msg: any) {
    if (msg._getType) return msg._getType(); // Standard LangChain method
    if (msg.constructor && msg.constructor.name) {
      const name = msg.constructor.name.replace(/(Chunk|Message)$/i, "");
      return name.toLowerCase(); // 'HumanMessage' -> 'human', 'AIMessageChunk' -> 'ai'
    }
    return msg.role || "unknown";
  }

  // Helper to recursively strip empty objects, arrays, and null/undefined values
  function clean(obj: any) {
    if (obj === null || obj === undefined) return undefined;

    if (Array.isArray(obj)) {
      const cleanedArray: any = obj
        .map(clean)
        .filter((item) => item !== undefined);
      return cleanedArray.length > 0 ? cleanedArray : undefined;
    }

    if (typeof obj === "object") {
      const cleanedObj: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const cleanedValue = clean(value);
        if (cleanedValue !== undefined) {
          // Keep non-empty objects
          if (
            typeof cleanedValue === "object" &&
            !Array.isArray(cleanedValue) &&
            Object.keys(cleanedValue).length === 0
          ) {
            continue;
          }
          cleanedObj[key] = cleanedValue;
        }
      }
      return Object.keys(cleanedObj).length > 0 ? cleanedObj : undefined;
    }

    return obj;
  }

  // Process array of messages
  return messages.map((msg: any) => {
    // Convert class instance to plain object
    const plainMsg = {
      id: msg.id,
      role: getRole(msg),
      content: msg.content,
      additional_kwargs: msg.additional_kwargs,
      response_metadata: msg.response_metadata,
      tool_calls: msg.tool_calls,
      tool_call_chunks: msg.tool_call_chunks,
      invalid_tool_calls: msg.invalid_tool_calls,
      ...msg, // Capture any extra properties
    };

    return clean(plainMsg) || {};
  });
};
