import 'server-only';

import { NumberVerificationTemplate } from './templates/number-verification';
import { ResetPasswordTextTemplate } from './templates/reset-password';
import { WHATSAPP_SENDER } from '@/lib/constants';
import type { ComponentProps } from 'react';
import { logger } from './logger';
import { env } from '@/env';

export enum TextTemplate {
  TextVerification = 'TextVerification',
  PasswordReset = 'PasswordReset',
}

export type PropsMap = {
  [TextTemplate.TextVerification]: ComponentProps<
    typeof NumberVerificationTemplate
  >;
  [TextTemplate.PasswordReset]: ComponentProps<
    typeof ResetPasswordTextTemplate
  >;
};

const getTextTemplate = <T extends TextTemplate>(
  template: T,
  props: PropsMap[NoInfer<T>],
) => {
  switch (template) {
    case TextTemplate.TextVerification:
      return {
        body: NumberVerificationTemplate(
          props as PropsMap[TextTemplate.TextVerification],
        ),
      };
    case TextTemplate.PasswordReset:
      return {
        body: ResetPasswordTextTemplate(
          props as PropsMap[TextTemplate.PasswordReset],
        ),
      };
    default:
      throw new Error('Invalid text template');
  }
};

// WhatsApp API configuration (works with Twilio, WhatsApp Business API, etc.)
const whatsappConfig = {
  accountSid: 'sampleAccountSid', // Replace with actual Account SID
  authToken: 'sampleAuthToken', // Replace with actual Auth Token
  apiUrl: 'https://api.twilio.com/2010-04-01',
};

// Generic WhatsApp client (can be replaced with specific SDK)
const sendWhatsAppMessage = async (to: string, body: string, from: string) => {
  const response = await fetch(
    `${whatsappConfig.apiUrl}/Accounts/${whatsappConfig.accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${whatsappConfig.accountSid}:${whatsappConfig.authToken}`,
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        To: `whatsapp:${to}`,
        From: `whatsapp:${from}`,
        Body: body,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to send WhatsApp message: ${response.statusText}`);
  }

  return response.json();
};

export const sendText = async <T extends TextTemplate>(
  to: string,
  template: T,
  props: PropsMap[NoInfer<T>],
) => {
  if (env.MOCK_SEND_TEXT) {
    logger.info(
      '📱 WhatsApp message sent to:',
      to,
      'with template:',
      template,
      'and props:',
      props,
    );
    return;
  }

  const { body } = getTextTemplate(template, props);
  return sendWhatsAppMessage(to, body, WHATSAPP_SENDER);
};
