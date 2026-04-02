import { Heading, Hr, Link, Section, Text } from "@react-email/components";
import * as React from "react";
import { Button } from "./components/Button.js";
import { Layout } from "./components/Layout.js";

interface InvitationToRegisteredUserProps {
  inviterName: string;
  inviteeName: string;
  projectTitle: string;
  invitationsUrl: string;
}

export const InvitationToRegisteredUser = ({
  inviterName,
  inviteeName,
  projectTitle,
  invitationsUrl,
}: InvitationToRegisteredUserProps) => {
  return (
    <Layout preview={`${inviterName} invited you to join "${projectTitle}"`}>
      <Heading style={h2}>You've Been Invited!</Heading>

      <Text style={text}>
        Hi <strong>{inviteeName}</strong>,
      </Text>

      <Text style={text}>
        <strong>{inviterName}</strong> has invited you to collaborate on the project <strong>"{projectTitle}"</strong>.
      </Text>

      <Text style={text}>Accept this invitation to start working together and contributing to the project.</Text>

      <Section style={buttonContainer}>
        <Button href={invitationsUrl}>View Invitation</Button>
      </Section>

      <Hr style={hr} />

      <Text style={footer}>
        Or copy this link:{" "}
        <Link href={invitationsUrl} style={link}>
          {invitationsUrl}
        </Link>
      </Text>
    </Layout>
  );
};

export default InvitationToRegisteredUser;

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
