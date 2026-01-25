import { PasswordResetRecoveryCodeForm, PasswordResetTOTPForm } from './forms';

export default function ResetPassword2FAComponents() {
  return (
    <>
      <h1>Two-factor authentication</h1>
      <p>Enter the code from your authenticator app.</p>
      <PasswordResetTOTPForm />
      <section>
        <h2>Use your recovery code instead</h2>
        <PasswordResetRecoveryCodeForm />
      </section>
    </>
  );
}
