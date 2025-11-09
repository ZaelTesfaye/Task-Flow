import React from 'react';
import { TaskStatus, TaskStatusSelectProps } from '@/types/project';
import { TASK_STATUS_COLORS } from '@/constants/project';

const TaskStatusSelect: React.FC<TaskStatusSelectProps> = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as TaskStatus)}
      className={`text-xs px-2 py-1 rounded-full ${TASK_STATUS_COLORS[value]} border-0 outline-none cursor-pointer bg-transparent`}
    >
      <option value="active">Active</option>
      <option value="complete">Complete</option>
      <option value="canceled">Canceled</option>
    </select>
  );
};

export default TaskStatusSelect;