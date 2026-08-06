import { redisClient } from "../../../config/redis";

const REDIS_KEYS = {
  THREAD: "thread",
  THREAD_LIST: "threads:list",
};

const THREAD_CACHE_TTL = 60 * 60 * 24;

/* -------------------------------------------------------------------------- */
/*                            Store Single Thread                             */
/* -------------------------------------------------------------------------- */

export const storeThreadToCache = async (
  threadId: string,
  threadDetails: any
) => {
  const key = `${REDIS_KEYS.THREAD}:${threadId}`;

  await redisClient.set(key, JSON.stringify(threadDetails), {
    EX: THREAD_CACHE_TTL,
  });
};

/* -------------------------------------------------------------------------- */
/*                            Get Single Thread                               */
/* -------------------------------------------------------------------------- */

export const getThreadFromCache = async (threadId: string) => {
  const key = `${REDIS_KEYS.THREAD}:${threadId}`;

  const thread = await redisClient.get(key);

  return thread ? JSON.parse(thread) : null;
};

/* -------------------------------------------------------------------------- */
/*                            Delete Single Thread                            */
/* -------------------------------------------------------------------------- */

export const deleteThreadFromCache = async (threadId: string) => {
  const key = `${REDIS_KEYS.THREAD}:${threadId}`;

  await redisClient.del(key);
};

/* -------------------------------------------------------------------------- */
/*                        Delete Thread From Cache List                       */
/* -------------------------------------------------------------------------- */

export const deleteThreadFromCacheList = async (threadId: string) => {
  const cachedThreads = await getThreadsListFromCache();

  if (!cachedThreads) return;

  const updatedThreads = cachedThreads.filter(
    (thread: any) => thread.thread_id !== threadId
  );

  await storeThreadsListToCache(updatedThreads);
};

/* -------------------------------------------------------------------------- */
/*                           Store Threads List                               */
/* -------------------------------------------------------------------------- */

export const storeThreadsListToCache = async (threads: any[]) => {
  await redisClient.set(REDIS_KEYS.THREAD_LIST, JSON.stringify(threads), {
    EX: THREAD_CACHE_TTL,
  });
};

/* -------------------------------------------------------------------------- */
/*                            Get Threads List                                */
/* -------------------------------------------------------------------------- */

export const getThreadsListFromCache = async () => {
  const threads = await redisClient.get(REDIS_KEYS.THREAD_LIST);

  return threads ? JSON.parse(threads) : null;
};

/* -------------------------------------------------------------------------- */
/*                           Update Thread Cache                              */
/* -------------------------------------------------------------------------- */

export const updateThreadCache = async (
  threadId: string,
  threadDetails: any
) => {
  await storeThreadToCache(threadId, threadDetails);
};

/* -------------------------------------------------------------------------- */
/*                         Update Thread In Cache List                        */
/* -------------------------------------------------------------------------- */

export const updateThreadInCacheList = async (
  threadId: string,
  updatedThread: any
) => {
  const cachedThreads = await getThreadsListFromCache();

  if (!cachedThreads) return;

  const updatedThreads = cachedThreads.map((thread: any) =>
    thread.thread_id === threadId ? updatedThread : thread
  );

  await storeThreadsListToCache(updatedThreads);
};
