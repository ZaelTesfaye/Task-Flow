import { email } from "../lib/index.js";
import config from "../config/config.js";

// Simple email template with sky blue theme
const getEmailTemplate = (content: string) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      ${content}
    </body>
  </html>
`;

/**
 * Send invitation email to a registered user
 */
export const sendInvitationToRegisteredUser = async (
  inviterName: string,
  inviteeName: string,
  inviteeEmail: string,
  projectTitle: string,
) => {
  const invitationsUrl = `${config.frontEndUrl}/invitations`;

  const content = `
    <h2>You've Been Invited!</h2>
    <p>Hi <strong>${inviteeName}</strong>,</p>
    <p><strong>${inviterName}</strong> has invited you to collaborate on the project <strong>"${projectTitle}"</strong>.</p>
    <p>Accept this invitation to start working together and contributing to the project.</p>
    <div style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px; padding: 20px; text-align: center; margin: 20px 0;">
      <a href="${invitationsUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: 600;">View Invitation</a>
    </div>
    <p style="font-size: 12px; color: #666;">Or copy this link: <a href="${invitationsUrl}">${invitationsUrl}</a></p>
  `;

  try {
    await email.emails.send({
      from: "TaskFlow <no-reply@info.task-flows.tech>",
      to: inviteeEmail,
      subject: `${inviterName} invited you to join "${projectTitle}"`,
      html: getEmailTemplate(content),
    });
    console.log(`✅ Invitation email sent successfully to ${inviteeEmail}`);
  } catch (error) {
    console.error(
      "❌ Error sending invitation email to registered user:",
      error,
    );
    throw error;
  }
};

/**
 * Send invitation email to a non-registered user
 */
export const sendInvitationToNonRegisteredUser = async (
  inviterName: string,
  inviteeEmail: string,
  projectTitle: string,
) => {
  const registerUrl = `${config.frontEndUrl}/login`;

  const content = `
    <h2>Welcome to TaskFlow!</h2>
    <p>Hello,</p>
    <p><strong>${inviterName}</strong> has invited you to join the project <strong>"${projectTitle}"</strong> on TaskFlow.</p>
    <p><strong>Get Started:</strong></p>
    <ol>
      <li>Create your free TaskFlow account</li>
      <li>Find the invitation waiting in your invitations page</li>
    </ol>
    <p>TaskFlow is a project management platform that helps teams collaborate effectively on projects and tasks.</p>
    <div style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px; padding: 20px; text-align: center; margin: 20px 0;">
      <a href="${registerUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: 600;">Sign Up & View Invitation</a>
    </div>
    <p style="font-size: 12px; color: #666;">Or copy this link: <a href="${registerUrl}">${registerUrl}</a></p>
  `;

  try {
    await email.emails.send({
      from: "TaskFlow <no-reply@info.task-flows.tech>",
      to: inviteeEmail,
      subject: `${inviterName} invited you to join "${projectTitle}" on TaskFlow`,
      html: getEmailTemplate(content),
    });
    console.log(
      `✅ Invitation email sent successfully to ${inviteeEmail} (new user)`,
    );
  } catch (error) {
    console.error(
      "❌ Error sending invitation email to non-registered user:",
      error,
    );
    throw error;
  }
};

/**
 * Send password reset code email
 */
export const sendPasswordResetCode = async (
  userName: string,
  userEmail: string,
  resetCode: string,
) => {
  const content = `
    <h2>Password Reset Request</h2>
    <p>Hi <strong>${userName}</strong>,</p>
    <p>We received a request to reset your password for your TaskFlow account. Use the verification code below:</p>
    <div style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px; padding: 20px; text-align: center; margin: 20px 0;">
      <h3 style="color: #007bff; font-size: 24px; margin: 0; letter-spacing: 4px;">${resetCode}</h3>
    </div>
    <p>This code will expire in 10 minutes.</p>
    <p style="font-size: 14px; color: #666;"><strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
    <p style="font-size: 12px; color: #666;">Never share this code with anyone.</p>
  `;

  try {
    await email.emails.send({
      from: "TaskFlow <no-reply@info.task-flows.tech>",
      to: userEmail,
      subject: "Password Reset Code - TaskFlow",
      html: getEmailTemplate(content),
    });
    console.log(`✅ Password reset email sent successfully to ${userEmail}`);
  } catch (error) {
    console.error("❌ Error sending password reset code email:", error);
    throw error;
  }
};

/**
 * Send task assignment notification email
 */
export const sendTaskAssignmentEmail = async (
  assigneeName: string,
  assigneeEmail: string,
  taskTitle: string,
  taskDescription: string,
  projectTitle: string,
  assignerName: string,
  projectId: string,
) => {
  const projectUrl = `${config.frontEndUrl}/project?id=${projectId}`;

  const content = `
    <h2>New Task Assigned</h2>
    <p>Hi <strong>${assigneeName}</strong>,</p>
    <p><strong>${assignerName}</strong> has assigned you a new task in <strong>"${projectTitle}"</strong>.</p>
    <div style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-left: 4px solid #007bff; border-radius: 5px; padding: 20px; margin: 20px 0;">
      <h3 style="margin: 0 0 10px 0; color: #1f2937;">${taskTitle}</h3>
      <p style="margin: 0; color: #666;">${taskDescription}</p>
    </div>
    <p>Click the button below to view the task details:</p>
    <div style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px; padding: 20px; text-align: center; margin: 20px 0;">
      <a href="${projectUrl}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: 600;">View Task in Project</a>
    </div>
    <p style="font-size: 12px; color: #666;">Or copy this link: <a href="${projectUrl}">${projectUrl}</a></p>
  `;

  try {
    await email.emails.send({
      from: "TaskFlow <no-reply@info.task-flows.tech>",
      to: assigneeEmail,
      subject: `New Task Assigned: ${taskTitle}`,
      html: getEmailTemplate(content),
    });
    console.log(
      `✅ Task assignment email sent successfully to ${assigneeEmail}`,
    );
  } catch (error) {
    console.error("❌ Error sending task assignment email:", error);
    throw error;
  }
};
