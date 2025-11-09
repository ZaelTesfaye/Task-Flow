export interface CreateTaskDTO {
  title: string;
  description: string;
  assignedTo: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: "active" | "complete" | "canceled";
  categoryId?: string;
}

export interface RequestTaskUpdateDTO {
  updateDescription: string;
  newStatus: "active" | "complete" | "canceled";
}

export interface AcceptPendingUpdateDTO {
  newStatus: "active" | "complete" | "canceled";
}
