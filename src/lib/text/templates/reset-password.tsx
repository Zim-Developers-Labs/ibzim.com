export type ResetPasswordTextTemplateProps = {
  resetLink: string;
  userName?: string;
};

export const ResetPasswordTextTemplate = ({
  resetLink,
  userName,
}: ResetPasswordTextTemplateProps): string => {
  return `Hi${userName ? ` ${userName}` : ''}! 👋

You requested to reset your password. Click the link below to reset it:

${resetLink}

This link will expire in 1 hour. If you didn't request this, please ignore this message.`;
};
