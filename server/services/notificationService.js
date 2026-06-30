const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsApp = process.env.TWILIO_WHATSAPP_NUMBER; // e.g. whatsapp:+14155238886
const twilioSMS = process.env.TWILIO_SMS_NUMBER; // e.g. +1234567890

let client = null;

function getClient() {
  if (!client && accountSid && authToken) {
    client = twilio(accountSid, authToken);
  }
  return client;
}

/**
 * Send SMS notification to a phone number
 * @param {string} to - Recipient phone number (e.g. +91XXXXXXXXXX)
 * @param {string} message - SMS body
 * @returns {Object|null} - Twilio message object or null if not configured
 */
async function sendSMS(to, message) {
  const twilioClient = getClient();
  if (!twilioClient || !twilioSMS) {
    console.log(`[NOTIFY] SMS skipped (Twilio not configured): ${to} - ${message.substring(0, 50)}...`);
    return null;
  }

  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: twilioSMS,
      to: to,
    });
    console.log(`[NOTIFY] SMS sent to ${to}, SID: ${result.sid}`);
    return result;
  } catch (error) {
    console.error(`[NOTIFY] SMS failed to ${to}:`, error.message);
    return null;
  }
}

/**
 * Send WhatsApp notification to a phone number
 * @param {string} to - Recipient phone number (e.g. +91XXXXXXXXXX)
 * @param {string} message - WhatsApp message body
 * @returns {Object|null} - Twilio message object or null if not configured
 */
async function sendWhatsApp(to, message) {
  const twilioClient = getClient();
  if (!twilioClient || !twilioWhatsApp) {
    console.log(`[NOTIFY] WhatsApp skipped (Twilio not configured): ${to} - ${message.substring(0, 50)}...`);
    return null;
  }

  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: twilioWhatsApp,
      to: `whatsapp:${to}`,
    });
    console.log(`[NOTIFY] WhatsApp sent to ${to}, SID: ${result.sid}`);
    return result;
  } catch (error) {
    console.error(`[NOTIFY] WhatsApp failed to ${to}:`, error.message);
    return null;
  }
}

/**
 * Send alert notification via both WhatsApp and SMS
 * @param {string} phone - Recipient phone number
 * @param {Object} alert - Alert object with type, severity, message
 */
async function sendAlertNotification(phone, alert) {
  if (!phone) {
    console.log('[NOTIFY] No phone number provided, skipping notification');
    return;
  }

  const severityEmoji = {
    critical: '\u26a0\ufe0f',
    high: '\ud83d\udea8',
    medium: '\ud83d\udfe1',
    low: '\ud83d\udfe2',
  };

  const emoji = severityEmoji[alert.severity] || '\u2139\ufe0f';

  const smsMessage = `${emoji} FarmGuard Alert [${alert.severity.toUpperCase()}]\n${alert.message}\nPlease check your FarmGuard dashboard for details.`;

  const waMessage = `${emoji} *FarmGuard Alert*\n\n*Severity:* ${alert.severity.toUpperCase()}\n*Type:* ${alert.type.replace(/_/g, ' ')}\n\n${alert.message}\n\n_Please open your FarmGuard dashboard to take action._`;

  // Send both in parallel
  await Promise.allSettled([
    sendSMS(phone, smsMessage),
    sendWhatsApp(phone, waMessage),
  ]);
}

module.exports = {
  sendSMS,
  sendWhatsApp,
  sendAlertNotification,
};
