export type NumberVerificationTemplateProps = {
  verificationCode: string;
  userName?: string;
};

export const NumberVerificationTemplate = ({
  verificationCode,
  userName,
}: NumberVerificationTemplateProps): string => {
  return `Hi${userName ? ` ${userName}` : ''}! 👋

Your verification code is: ${verificationCode}

This code will expire in 10 minutes. Please do not share this code with anyone.

If you didn't request this code, please ignore this message.`;
};
