import { Heading, Hr, Section, Text } from "@react-email/components";
import * as React from "react";
import { Layout } from "./components/Layout.js";

interface PasswordResetCodeProps {
  userName: string;
  resetCode: string;
}

export const PasswordResetCode = ({ userName, resetCode }: PasswordResetCodeProps) => {
  return (
    <Layout preview="Password Reset Request - TaskFlow">
      <Heading style={h2}>Password Reset Request</Heading>

      <Text style={text}>
        Hi <strong>{userName}</strong>,
      </Text>

      <Text style={text}>
        We received a request to reset your password for your TaskFlow account. Use the verification code below:
      </Text>

      <Section style={codeContainer}>
        <Text style={code}>{resetCode}</Text>
      </Section>

      <Text style={text}>This code will expire in 10 minutes.</Text>

      <Hr style={hr} />

      <Text style={securityNotice}>
        <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your
        password will remain unchanged.
      </Text>

      <Text style={footer}>Never share this code with anyone.</Text>
    </Layout>
  );
};

export default PasswordResetCode;

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

const codeContainer = {
  backgroundColor: "#f8f9fa",
  border: "1px solid #dee2e6",
  borderRadius: "5px",
  padding: "20px",
  textAlign: "center" as const,
  margin: "24px 0",
};

const code = {
  color: "#007bff",
  fontSize: "32px",
  fontWeight: "bold",
  letterSpacing: "8px",
  margin: "0",
  fontFamily: "monospace",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
};

const securityNotice = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "16px 0",
};

const footer = {
  color: "#6b7280",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "16px 0",
};
