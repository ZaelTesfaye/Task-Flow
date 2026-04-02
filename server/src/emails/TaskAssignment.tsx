import { Heading, Hr, Link, Section, Text } from "@react-email/components";
import * as React from "react";
import { Button } from "./components/Button.js";
import { Layout } from "./components/Layout.js";

interface TaskAssignmentProps {
  assigneeName: string;
  taskTitle: string;
  taskDescription: string;
  projectTitle: string;
  assignerName: string;
  projectUrl: string;
}

export const TaskAssignment = ({
  assigneeName,
  taskTitle,
  taskDescription,
  projectTitle,
  assignerName,
  projectUrl,
}: TaskAssignmentProps) => {
  return (
    <Layout preview={`New Task Assigned: ${taskTitle}`}>
      <Heading style={h2}>New Task Assigned</Heading>

      <Text style={text}>Hi <strong>{assigneeName}</strong>,</Text>

      <Text style={text}>
        <strong>{assignerName}</strong> has assigned you a new task in{" "}
        <strong>"{projectTitle}"</strong>.
      </Text>

      <Section style={taskCard}>
        <Heading style={taskTitle_style}>{taskTitle}</Heading>
        <Text style={taskDescription_style}>{taskDescription}</Text>
      </Section>

      <Text style={text}>Click the button below to view the task details:</Text>

      <Section style={buttonContainer}>
        <Button href={projectUrl}>View Task in Project</Button>
      </Section>

      <Hr style={hr} />

      <Text style={footer}>
        Or copy this link:{" "}
        <Link href={projectUrl} style={link}>
          {projectUrl}
        </Link>
      </Text>
    </Layout>
  );
};

export default TaskAssignment;

const h2 = {
  color: "#1f2937",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "30px 0",
};

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
};

const taskCard = {
  backgroundColor: "#f8f9fa",
  border: "1px solid #dee2e6",
  borderLeft: "4px solid #007bff",
  borderRadius: "5px",
  padding: "20px",
  margin: "24px 0",
};

const taskTitle_style = {
  color: "#1f2937",
  fontSize: "20px",
  fontWeight: "600",
  margin: "0 0 10px 0",
};

const taskDescription_style = {
  color: "#6b7280",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
};

const footer = {
  color: "#6b7280",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "16px 0",
};

const link = {
  color: "#007bff",
  textDecoration: "underline",
};
