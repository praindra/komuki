// server/utils/whatsapp.js
const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

exports.sendWhatsAppMessage = async (to, message) => {
    try {
        await client.messages.create({
            from: `whatsapp:${process.env.WHATSAPP_SENDER_NUMBER}`,
            to: `whatsapp:${to}`,
            body: message
        });
        console.log(`WhatsApp message sent to ${to}`);
    } catch (error) {
        console.error(`Error sending WhatsApp message to ${to}:`, error.message);
        throw new Error('Failed to send WhatsApp message.');
    }
};