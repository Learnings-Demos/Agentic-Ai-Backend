import { ThreadStatus } from "../../utils/enums";

export interface CreateThreadRequest {
  thread_id: string;
  title: string;
  status: ThreadStatus;
}

export type UpdateThreadRequest = Partial<
  Pick<CreateThreadRequest, "title" | "status">
> & {
  updatedAt?: Date;
};
