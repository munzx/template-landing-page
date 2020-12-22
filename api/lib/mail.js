const sgMail = require('@sendgrid/mail');

sgMail.setApiKey("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");

function mail(email, fullname, code){
	const msg = {
	  to: email,
	  from: 'noreply@dubaioutletmall.com',
	  subject: 'Verification',
	  text: `Dear ${fullname}, Congratulations! Santa has left a surprise gift for you. show this message at the customer service desk to receive your gift!.Registration Code: ${code}. Wish you a pleasant shopping experience!`,
	  html: `<p>Dear ${fullname},</p><p>Congratulations! Santa has left a surprise gift for you.</p><br/><p>Show this message at the customer service desk to receive your gift!.</p><br/><p>Registration Code: <strong>${code}</strong></p><br/><p>Wish you a pleasant shopping experience!<br/>Dubai Outlet Mall Team</p>`,
	};

	return sgMail.send(msg);
}

module.exports = mail;
