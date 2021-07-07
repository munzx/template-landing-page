const sgMail = require('@sendgrid/mail');

sgMail.setApiKey("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");

function mail(email, fullname, code){
	const msg = {
	  to: email,
	  from: 'noreply@dubaioutletmall.com',
	  subject: 'Verification',
	  text: `Dear ${fullname}, Thank you for registering. Please present the following generated code to any customer service desk along with your shopping invoice to enter the draw. Wishing you a happy shopping!`,
	  html: `<p>Dear ${fullname},</p><br/>Thank you for registering!<br/><p>Please present the following generated <strong>code</strong> to any customer service desk along with your shopping invoice to enter the draw.</p><br/><p><strong>${code}</strong></p><br/><p>Wishing you a happy shopping!<br/>Dubai Outlet Mall Team</p>`,
	};

	return sgMail.send(msg);
}

module.exports = mail;