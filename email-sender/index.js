// npm install nodemailer

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jay.gohil.info@gmail.com',
    pass: "jay-gohil-password"
  }
});

var mailOptions = {
  from: 'jay.gohil.info@gmail.com',
  to: 'jay.gict19@sot.pdpu.ac.in',
  // to: 'jay.gict19@sot.pdpu.ac.in, jay.hict19@sot.pdpu.ac.in', // For sending to multiple recipients
  subject: 'My first email using Node.js!',
  text: 'Well that was fun!'
  // html: '<h1>Woah</h1><p>That was fun!</p>' // For sending html-based content
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent successfully: ' + info.response);
  }
});
