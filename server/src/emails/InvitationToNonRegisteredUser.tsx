import { Heading, Hr, Link, Section, Text } from "@react-email/components";
import * as React from "react";
import { Button } from "./components/Button.js";
import { Layout } from "./components/Layout.js";

interface InvitationToNonRegisteredUserProps {
  inviterName: string;
  projectTitle: string;
  registerUrl: string;
}

export const InvitationToNonRegisteredUser = ({
  inviterName,
  projectTitle,
  registerUrl,
}: InvitationToNonRegisteredUserProps) => {
  return (
    <Layout preview={`${inviterName} invited you to join "${projectTitle}" on TaskFlow`}>
      <Heading style={h2}>Welcome to TaskFlow!</Heading>

      <Text style={text}>Hello,</Text>

      <Text style={text}>
        <strong>{inviterName}</strong> has invited you to join the project{" "}
        <strong>"{projectTitle}"</strong> on TaskFlow.
      </Text>

      <Text style={text}>
        <strong>Get Started:</strong>
      </Text>

      <Section style={listSection}>
        <Text style={listItem}>1. Create your free TaskFlow account</Text>
        <Text style={listItem}>2. Find the invitation waiting in your invitations page</Text>
      </Section>

      <Text style={text}>
        TaskFlow is a project management platform that helps teams collaborate effectively on
        projects and tasks.
      </Text>

      <Section style={buttonContainer}>
        <Button href={registerUrl}>Sign Up &amp; View Invitation</Button>
      </Section>

      <Hr style={hr} />

      <Text style={footer}>
        Or copy this link:{" "}
        <Link href={registerUrl} style={link}>
          {registerUrl}
        </Link>
      </Text>
    </Layout>
  );
};

export default InvitationToNonRegisteredUser;

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

const listSection = {
  margin: "16px 0",
};

const listItem = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "8px 0",
  paddingLeft: "8px",
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
