import { email, logger } from "../lib/index.js";
import config from "../config/env.config.js";
import { render } from "@react-email/render";
import InvitationToRegisteredUser from "../emails/InvitationToRegisteredUser.js";
import InvitationToNonRegisteredUser from "../emails/InvitationToNonRegisteredUser.js";
import PasswordResetCode from "../emails/PasswordResetCode.js";
import TaskAssignment from "../emails/TaskAssignment.js";

// Get the first frontend URL from the array
const getFrontendUrl = () => {
  const frontendUrls = Array.isArray(config.frontEndUrl) ? config.frontEndUrl : [config.frontEndUrl];
  return frontendUrls[0] || config.frontEndUrl;
};

// Send invitation email to a registered user
export const sendInvitationToRegisteredUser = async (
  inviterName: string,
  inviteeName: string,
  inviteeEmail: string,
  projectTitle: string,
) => {
  const invitationsUrl = `${getFrontendUrl()}/invitations`;

  const emailHtml = await render(
    InvitationToRegisteredUser({
      inviterName,
      inviteeName,
      projectTitle,
      invitationsUrl,
    }),
  );

  try {
    await email.emails.send({
      from: "TaskFlow <no-reply@info.task-flows.tech>",
      to: inviteeEmail,
      subject: `${inviterName} invited you to join "${projectTitle}"`,
      html: emailHtml,
    });
  } catch (error) {
    logger.error("Error sending invitation email to registered user:", error);
    throw error;
  }
};

// Send invitation email to a non-registered user
export const sendInvitationToNonRegisteredUser = async (
  inviterName: string,
  inviteeEmail: string,
  projectTitle: string,
) => {
  const registerUrl = `${getFrontendUrl()}/login`;

  const emailHtml = await render(
    InvitationToNonRegisteredUser({
      inviterName,
      projectTitle,
      registerUrl,
    }),
  );

  try {
    await email.emails.send({
      from: "TaskFlow <no-reply@info.task-flows.tech>",
      to: inviteeEmail,
      subject: `${inviterName} invited you to join "${projectTitle}" on TaskFlow`,
      html: emailHtml,
    });
  } catch (error) {
    logger.error("Error sending invitation email to non-registered user:", error);
    throw error;
  }
};

// Send password reset code email
export const sendPasswordResetCode = async (userName: string, userEmail: string, resetCode: string) => {
  const emailHtml = await render(
    PasswordResetCode({
      userName,
      resetCode,
    }),
  );

  try {
    await email.emails.send({
      from: "TaskFlow <no-reply@info.task-flows.tech>",
      to: userEmail,
      subject: "Password Reset Code - TaskFlow",
      html: emailHtml,
    });
  } catch (error) {
    logger.error("Error sending password reset code email:", error);
    throw error;
  }
};

// Send task assignment notification email
export const sendTaskAssignmentEmail = async (
  assigneeName: string,
  assigneeEmail: string,
  taskTitle: string,
  taskDescription: string,
  projectTitle: string,
  assignerName: string,
  projectId: string,
) => {
  const projectUrl = `${getFrontendUrl()}/project?id=${projectId}`;

  const emailHtml = await render(
    TaskAssignment({
      assigneeName,
      taskTitle,
      taskDescription,
      projectTitle,
      assignerName,
      projectUrl,
    }),
  );

  try {
    await email.emails.send({
      from: "TaskFlow <no-reply@info.task-flows.tech>",
      to: assigneeEmail,
      subject: `New Task Assigned: ${taskTitle}`,
      html: emailHtml,
    });
  } catch (error) {
    logger.error("Error sending task assignment email:", error);
    throw error;
  }
};
