import nodemailer, { Transporter } from 'nodemailer';
import Email from 'email-templates';

let transporter: Transporter = nodemailer.createTransport({
  service: 'Yandex',
  secure: true,
  auth: {
    user: 'emre.aybey@pabeda.com.tr',
    pass: process.env.EMAIL_PASSWORD,
  },
});

const email = new Email({
  views: { root: './src/email-templates', options: { extension: 'ejs' } },
  message: {
    from: 'emre.aybey@pabeda.com.tr',
  },
  // juiceResources: {
  //   preserveImportant: true,
  //   webResources: {
  //     // view folder path, it will get css from `email-templates/style.css`
  //     relativeTo: path.resolve('email-templates'),
  //   },
  // },
  preview: false,
  send: true,
  transport: transporter,
});

export default email;
