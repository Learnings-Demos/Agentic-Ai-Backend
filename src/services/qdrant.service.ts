import qdrantClient from "../../config/llm/qdrant";

/* -------------------------------------------------------------------------- */
/*                         Creates a Qdrant collection                        */
/* -------------------------------------------------------------------------- */
export const createCollection = async (
  vectorSize: number,
  collectionName: string
) => {
  const collection = await qdrantClient.collectionExists(collectionName);

  if (collection.exists) {
    return {
      message: `Collection '${collectionName}' already exists`,
    };
  }

  const result = await qdrantClient.createCollection(collectionName, {
    vectors: {
      size: vectorSize,
      distance: "Cosine",
    },
  });

  return result;
};

/* -------------------------------------------------------------------------- */
/*                          Drop a Qdrant Collection                          */
/* -------------------------------------------------------------------------- */
export const dropCollection = async (collectionName: string) => {
  await qdrantClient.deleteCollection(collectionName);
};

/* -------------------------------------------------------------------------- */
/*            Stores vectors and their associated payload/metadata            */
/* -------------------------------------------------------------------------- */
export const storeData = async (
  points: {
    id: string | number;
    vector: number[];
    payload?: Record<string, unknown>;
  }[],
  collectionName: string
) => {
  const result = await qdrantClient.upsert(collectionName, {
    wait: true,
    points,
  });

  return result;
};

/* -------------------------------------------------------------------------- */
/*             Searches for vectors similar to the supplied vector            */
/* -------------------------------------------------------------------------- */
export const searchData = async (
  vector: number[],
  collectionName: string,
  limit: number = 10
) => {
  const results = await qdrantClient.query(collectionName, {
    query: vector,
    limit,
    with_payload: true,
  });

  return results;
};
