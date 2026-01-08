export type NumberVerificationTemplateProps = {
  verificationCode: string;
  userName?: string;
};

export const NumberVerificationTemplate = ({
  verificationCode,
}: NumberVerificationTemplateProps): string => {
  return `${verificationCode} is your IBZIM code. Don't share it.`;
};
