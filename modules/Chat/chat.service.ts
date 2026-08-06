import { CreateThreadRequest, UpdateThreadRequest } from "./chat.interface";
import ThreadModel from "./chat.model";
import {
  storeThreadToCache,
  storeThreadsListToCache,
  getThreadFromCache,
  getThreadsListFromCache,
  updateThreadCache,
  deleteThreadFromCache,
  deleteThreadFromCacheList,
} from "./cache/thread.cache";

/* -------------------------------------------------------------------------- */
/*                                Create Thread                               */
/* -------------------------------------------------------------------------- */
export const createThread = async (threadData: CreateThreadRequest) => {
  const thread: any = await ThreadModel.create({
    ...threadData,
  });

  /* Write Through Cache */
  await storeThreadToCache(thread.thread_id, thread);

  /* Write Through Cache List too */
  await storeThreadsListToCache([thread]);

  return thread;
};

/* -------------------------------------------------------------------------- */
/*                             Get Thread Details                             */
/* -------------------------------------------------------------------------- */
export const getThreadDetails = async (threadId: string) => {
  /* Check Cache */
  const cachedThread = await getThreadFromCache(threadId);

  if (cachedThread) {
    return cachedThread;
  }

  /* Fetch From DB */
  const thread: any = await ThreadModel.findByPk(threadId);

  if (!thread) return null;

  /* Store In Cache */
  await storeThreadToCache(thread.thread_id, thread);

  return thread;
};

/* -------------------------------------------------------------------------- */
/*                            Get All Threads List                            */
/* -------------------------------------------------------------------------- */
export const getAllThreads = async () => {
  /* Check Cache */
  const cachedThreads = await getThreadsListFromCache();

  if (cachedThreads) {
    return cachedThreads;
  }

  /* Fetch From DB */
  const threads = await ThreadModel.findAll({
    order: [["updatedAt", "DESC"]],
  });

  /* Store In Cache */
  await storeThreadsListToCache(threads);

  return threads;
};

/* -------------------------------------------------------------------------- */
/*                                Update Thread                               */
/* -------------------------------------------------------------------------- */
export const updateThread = async (
  threadId: string,
  threadData: UpdateThreadRequest
) => {
  const thread = await ThreadModel.findByPk(threadId);

  if (!thread) {
    throw new Error("Thread not found..!!");
  }

  /* Update DB */
  const updatedThread: any = await thread.update(threadData);

  /* Write Through Cache */
  await updateThreadCache(updatedThread.thread_id, updatedThread);

  return updatedThread;
};

/* -------------------------------------------------------------------------- */
/*                                Delete Thread                               */
/* -------------------------------------------------------------------------- */
export const deleteThread = async (threadId: string) => {
  const thread = await ThreadModel.findByPk(threadId);

  if (!thread) {
    throw new Error("Thread not found..!!");
  }

  /* Delete From DB */
  await thread.destroy();

  /* Delete Cache */
  await deleteThreadFromCache(threadId);

  /* Delete From Cache List */
  await deleteThreadFromCacheList(threadId);

  return {
    message: "Thread deleted successfully",
  };
};
