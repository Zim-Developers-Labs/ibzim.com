import 'server-only';

import twilio from 'twilio';
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
  accountSid: 'AC1c8ca549f22c45b2f0942437b6b788a2', // Replace with actual Account SID
  authToken: env.TWILIO_AUTH_TOKEN, // Replace with actual Auth Token
};

const sendWhatsAppMessage = async (to: string, body: string) => {
  const verificationCode = body.slice(0, 8);

  if (!verificationCode) {
    throw new Error('Verification code is required for WhatsApp messages');
  }

  const client = twilio(whatsappConfig.accountSid, whatsappConfig.authToken);

  try {
    // Use 'await' instead of .then()
    const message = await client.messages.create({
      from: `whatsapp:${WHATSAPP_SENDER}`,
      contentSid: 'HX229f5a04fd0510ce1b071852155d3e75', // verification message template SID
      contentVariables: `{"1":"${verificationCode}"}`,
      to: `whatsapp:${to}`,
    });

    console.log(message.sid);
    console.log(message.body);
    console.log(message.errorMessage);
    console.log(message.sid);
    console.log(verificationCode, 'verification code sent via WhatsApp');
  } catch (error) {
    // Handle errors appropriately
    console.error('Twilio Error:', error);
    throw error; // Re-throw so the calling function knows it failed
  }
};

const nationalTextConfig = {
  accountSid: 'SMS X Managed',
  authToken: env.SMSX_API_TOKEN,
  apiUrl: 'https://portal.smsx.app/api/v3/',
};

const sendNationalText = async (to: string, body: string, from: string) => {
  const response = await fetch(`${nationalTextConfig.apiUrl}sms/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${nationalTextConfig.authToken}`,
      Accept: 'application/json',
    },
    body: JSON.stringify({
      recipient: to,
      sender_id: from,
      type: 'plain',
      message: body,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send national SMS: ${response.statusText}`);
  }

  return response.json();
};

const internationalTextConfig = {
  accountSid: 'AC1c8ca549f22c45b2f0942437b6b788a2',
  authToken: env.TWILIO_AUTH_TOKEN,
};

const sendInternationalText = async (
  to: string,
  body: string,
  from: string,
) => {
  console.log('using international text config');
  const client = twilio(from, internationalTextConfig.authToken);

  client.verify.v2
    .services('VAe3f146a99fd6e6e64b23adad2e9869ac')
    .verifications.create({ to, channel: 'sms' })
    .then((verification: any) =>
      console.log(verification.status, 'verification status'),
    )
    .catch((error: any) => console.error('Error sending SMS:', error));
};

export const sendText = async <T extends TextTemplate>(
  to: string,
  template: T,
  props: PropsMap[NoInfer<T>],
  verificationMethod: 'sms' | 'whatsapp',
  countryCode: string,
  verificationCode?: string,
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

  if (verificationMethod === 'sms') {
    if (countryCode === 'ZW') {
      //SMSX for Zimbabwe
      return sendNationalText(to, body, nationalTextConfig.accountSid);
    }
    // TWilio for international SMS
    return sendInternationalText(to, body, internationalTextConfig.accountSid);
  }

  // Twilio WhatsApp API
  return sendWhatsAppMessage(to, body);
};
