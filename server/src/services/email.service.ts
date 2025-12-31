import { email } from "../lib/index.js";
import config from "../config/config.js";

// Consistent email template styles for branding
const getEmailTemplate = (content: string) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6; 
          color: #1f2937; 
          background-color: #f3f4f6;
          margin: 0;
          padding: 20px;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          color: white; 
          padding: 32px 24px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        .logo {
          font-size: 36px;
          margin-bottom: 8px;
        }
        .content { 
          padding: 32px 24px;
          background: white;
        }
        .content p {
          margin: 0 0 16px 0;
          color: #374151;
        }
        .button { 
          display: inline-block; 
          padding: 14px 32px; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white; 
          text-decoration: none; 
          border-radius: 8px; 
          font-weight: 600;
          font-size: 15px;
          transition: transform 0.2s;
        }
        .button:hover {
          transform: translateY(-2px);
        }
        .footer { 
          text-align: center; 
          padding: 24px;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
          font-size: 13px; 
          color: #6b7280;
        }
        .divider {
          height: 1px;
          background: #e5e7eb;
          margin: 24px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">📋</div>
          <h1>TaskFlow</h1>
        </div>
        ${content}
        <div class="footer">
          <p style="margin: 0;">© 2025 TaskFlow. All rights reserved.</p>
          <p style="margin: 8px 0 0 0;">This email was sent by TaskFlow project management platform.</p>
        </div>
      </div>
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
    <div class="content">
      <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 22px;">🎉 You've Been Invited!</h2>
      <p>Hi <strong>${inviteeName}</strong>,</p>
      <p><strong>${inviterName}</strong> has invited you to collaborate on the project <strong>"${projectTitle}"</strong>.</p>
      <p>Accept this invitation to start working together and contributing to the project.</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${invitationsUrl}" class="button">View Invitation →</a>
      </div>
      <p style="font-size: 13px; color: #6b7280;">Or copy this link: <a href="${invitationsUrl}" style="color: #667eea;">${invitationsUrl}</a></p>
    </div>
  `;

  try {
    await email.emails.send({
      from: "TaskFlow <onboarding@resend.dev>",
      to: inviteeEmail,
      subject: `${inviterName} invited you to join "${projectTitle}"`,
      html: getEmailTemplate(content),
    });
  } catch (error) {
    console.error("Error sending invitation email to registered user:", error);
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
    <div class="content">
      <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 22px;">🎉 Welcome to TaskFlow!</h2>
      <p>Hello,</p>
      <p><strong>${inviterName}</strong> has invited you to join the project <strong>"${projectTitle}"</strong> on TaskFlow.</p>
      <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 8px; margin: 24px 0; border-left: 4px solid #f59e0b;">
        <p style="margin: 0 0 8px 0; font-weight: 600; color: #92400e;">📝 Get Started in 2 Steps:</p>
        <ol style="margin: 0; padding-left: 20px; color: #78350f;">
          <li>Create your free TaskFlow account</li>
          <li>Find the invitation waiting in your invitations page</li>
        </ol>
      </div>
      <p>TaskFlow is a powerful project management platform that helps teams collaborate effectively on projects and tasks.</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${registerUrl}" class="button">Sign Up & View Invitation →</a>
      </div>
      <p style="font-size: 13px; color: #6b7280;">Or copy this link: <a href="${registerUrl}" style="color: #667eea;">${registerUrl}</a></p>
    </div>
  `;

  try {
    await email.emails.send({
      from: "TaskFlow <onboarding@resend.dev>",
      to: inviteeEmail,
      subject: `${inviterName} invited you to join "${projectTitle}" on TaskFlow`,
      html: getEmailTemplate(content),
    });
  } catch (error) {
    console.error(
      "Error sending invitation email to non-registered user:",
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
    <div class="content">
      <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 22px;">🔐 Password Reset Request</h2>
      <p>Hi <strong>${userName}</strong>,</p>
      <p>We received a request to reset your password for your TaskFlow account. Use the verification code below to complete the reset:</p>
      <div style="background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%); border: 2px solid #8b5cf6; padding: 24px; text-align: center; border-radius: 12px; margin: 24px 0;">
        <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #6d28d9; font-family: 'Courier New', monospace;">${resetCode}</div>
        <p style="margin: 12px 0 0 0; color: #7c3aed; font-size: 13px; font-weight: 600;">⏱️ Valid for 10 minutes</p>
      </div>
      <div style="background: #fee2e2; border-left: 4px solid #dc2626; padding: 16px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0 0 8px 0; font-weight: 600; color: #991b1b;">⚠️ Security Notice</p>
        <p style="margin: 0; font-size: 14px; color: #7f1d1d;">If you didn't request this password reset, please ignore this email or contact support if you're concerned. Your password will remain unchanged.</p>
      </div>
      <p style="color: #6b7280; font-size: 14px;">Never share this code with anyone. TaskFlow will never ask for your password or verification code via email.</p>
    </div>
  `;

  try {
    await email.emails.send({
      from: "TaskFlow <onboarding@resend.dev>",
      to: userEmail,
      subject: "Password Reset Code - TaskFlow",
      html: getEmailTemplate(content),
    });
  } catch (error) {
    console.error("Error sending password reset code email:", error);
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
    <div class="content">
      <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 22px;">📋 New Task Assigned</h2>
      <p>Hi <strong>${assigneeName}</strong>,</p>
      <p><strong>${assignerName}</strong> has assigned you a new task in <strong>"${projectTitle}"</strong>.</p>
      
      <div style="background: white; border: 2px solid #e5e7eb; border-left: 4px solid #667eea; padding: 20px; margin: 24px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <div style="font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 12px;">✓ ${taskTitle}</div>
        <div style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 16px;">${taskDescription}</div>
        <div style="display: inline-block; background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); color: #1e40af; padding: 6px 14px; border-radius: 16px; font-size: 13px; font-weight: 600;">
          📁 ${projectTitle}
        </div>
      </div>

      <p>Click the button below to view the task details and get started:</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${projectUrl}" class="button">View Task in Project →</a>
      </div>
      <p style="font-size: 13px; color: #6b7280;">Or copy this link: <a href="${projectUrl}" style="color: #667eea;">${projectUrl}</a></p>
    </div>
  `;

  try {
    await email.emails.send({
      from: "TaskFlow <onboarding@resend.dev>",
      to: assigneeEmail,
      subject: `New Task Assigned: ${taskTitle}`,
      html: getEmailTemplate(content),
    });
  } catch (error) {
    console.error("Error sending task assignment email:", error);
    throw error;
  }
};
