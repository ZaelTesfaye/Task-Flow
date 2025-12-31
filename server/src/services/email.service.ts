import { email } from "../lib/index.js";
import config from "../config/config.js";

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

  try {
    await email.emails.send({
      from: "TaskFlow <onboarding@resend.dev>",
      to: inviteeEmail,
      subject: `${inviterName} invited you to join "${projectTitle}"`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
              .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">🎉 Project Invitation</h1>
              </div>
              <div class="content">
                <p>Hi ${inviteeName},</p>
                <p><strong>${inviterName}</strong> has invited you to join the project <strong>"${projectTitle}"</strong> on TaskFlow.</p>
                <p>Click the button below to view your invitation and start collaborating:</p>
                <div style="text-align: center;">
                  <a href="${invitationsUrl}" class="button">View Invitation</a>
                </div>
                <p>Or copy this link: <a href="${invitationsUrl}">${invitationsUrl}</a></p>
                <p>Best regards,<br>The TaskFlow Team</p>
              </div>
              <div class="footer">
                <p>This email was sent because someone invited you to a project on TaskFlow.</p>
              </div>
            </div>
          </body>
        </html>
      `,
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

  try {
    await email.emails.send({
      from: "TaskFlow <onboarding@resend.dev>",
      to: inviteeEmail,
      subject: `${inviterName} invited you to join "${projectTitle}" on TaskFlow`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
              .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
              .highlight { background: #fef3c7; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #f59e0b; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">🎉 You're Invited to TaskFlow!</h1>
              </div>
              <div class="content">
                <p>Hello,</p>
                <p><strong>${inviterName}</strong> has invited you to join the project <strong>"${projectTitle}"</strong> on TaskFlow.</p>
                <div class="highlight">
                  <p style="margin: 0;"><strong>📝 Next Steps:</strong></p>
                  <p style="margin: 5px 0 0 0;">Sign up for TaskFlow to accept this invitation and start collaborating on the project.</p>
                </div>
                <p>TaskFlow is a powerful project management platform that helps teams collaborate effectively. Once you sign up, you'll find this invitation waiting for you in your invitations page.</p>
                <div style="text-align: center;">
                  <a href="${registerUrl}" class="button">Sign Up & View Invitation</a>
                </div>
                <p>Or copy this link: <a href="${registerUrl}">${registerUrl}</a></p>
                <p>Best regards,<br>The TaskFlow Team</p>
              </div>
              <div class="footer">
                <p>This email was sent because someone invited you to a project on TaskFlow.</p>
              </div>
            </div>
          </body>
        </html>
      `,
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
  try {
    await email.emails.send({
      from: "TaskFlow <onboarding@resend.dev>",
      to: userEmail,
      subject: "Password Reset Code - TaskFlow",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .code-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #667eea; margin: 20px 0; border-radius: 8px; }
              .warning { background: #fee; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; border-radius: 4px; }
              .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">🔐 Password Reset Request</h1>
              </div>
              <div class="content">
                <p>Hi ${userName},</p>
                <p>We received a request to reset your password for your TaskFlow account. Use the code below to reset your password:</p>
                <div class="code-box">${resetCode}</div>
                <p style="text-align: center; color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
                <div class="warning">
                  <p style="margin: 0; font-weight: bold; color: #dc2626;">⚠️ Security Notice</p>
                  <p style="margin: 5px 0 0 0; font-size: 14px;">If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
                </div>
                <p>Best regards,<br>The TaskFlow Team</p>
              </div>
              <div class="footer">
                <p>This is an automated email. Please do not reply.</p>
              </div>
            </div>
          </body>
        </html>
      `,
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

  try {
    await email.emails.send({
      from: "TaskFlow <onboarding@resend.dev>",
      to: assigneeEmail,
      subject: `New Task Assigned: ${taskTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .task-card { background: white; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
              .task-title { font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 10px; }
              .task-description { color: #6b7280; font-size: 14px; margin-bottom: 15px; }
              .project-badge { display: inline-block; background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
              .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
              .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">📋 New Task Assigned</h1>
              </div>
              <div class="content">
                <p>Hi ${assigneeName},</p>
                <p><strong>${assignerName}</strong> has assigned you a new task in the project <strong>"${projectTitle}"</strong>.</p>
                
                <div class="task-card">
                  <div class="task-title">${taskTitle}</div>
                  <div class="task-description">${taskDescription}</div>
                  <span class="project-badge">📁 ${projectTitle}</span>
                </div>

                <p>Click the button below to view the task and get started:</p>
                <div style="text-align: center;">
                  <a href="${projectUrl}" class="button">View Task in Project</a>
                </div>
                <p>Or copy this link: <a href="${projectUrl}">${projectUrl}</a></p>
                <p>Best regards,<br>The TaskFlow Team</p>
              </div>
              <div class="footer">
                <p>You received this email because you were assigned a task in TaskFlow.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("Error sending task assignment email:", error);
    throw error;
  }
};
