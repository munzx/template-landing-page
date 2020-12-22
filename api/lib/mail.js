const sgMail = require('@sendgrid/mail');

sgMail.setApiKey("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");

function mail(email, fullname, code){
	const msg = {
	  to: email,
	  from: 'noreply@dubaioutletmall.com',
	  subject: 'Verification',
	  text: `Dear ${fullname}, Congratulations! Santa has left a surprise gift for you. show this message at the customer service desk to receive your gift!. Wishing you a happy shopping!`,
	  html: `<p>Dear ${fullname},</p>><p>Congratulations!<br/> Santa has left a surprise gift for you.</p><p> show this message at the customer service desk to receive your gift!.</p><br/><p>Wishing you a happy shopping!<br/>Dubai Outlet Mall Team</p>`,
	};

	return sgMail.send(msg);
}

module.exports = mail;
