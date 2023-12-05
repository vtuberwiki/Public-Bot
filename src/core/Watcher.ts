import { fDate } from 'developer-toolkit-utils';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';


let Template = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error Page</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .card-title {
      font-size: 24px;
      margin: 0;
    }

    .card-text {
      font-size: 16px;
      margin: 10px 0;
    }

    .error-details {
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      padding: 10px;
      margin-top: 20px;
      border-radius: 10px;
      /* Add rounded corners */
    }

    .stack-trace {
      white-space: pre-wrap;
      font-size: 14px;
      margin: 10px 0;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="card">
      <div class="card-body">
        <h1 class="card-title">%{type}</h1>
        <p class="card-text">%{message}</p>

        <div class="error-details">
          <h4 class="card-title">Error Details</h4>
          <h4 class="stack-title">Stack Trace</h4>
          <p class="stack-trace">%{stack}</p>
        </div>
      </div>
    </div>
  </div>
</body>

</html>
`;

const getEmails = async () => {
    let emails = path.join(__dirname, '..', '..', '.github', '.mail');

    if (fs.existsSync(emails)) {
        // Read the contents of the file and split it by semicolon
        const emailContent = fs.readFileSync(emails, 'utf8');
        return emailContent.split(';');
    } else {
        return [];
    }
};

const sendEmails = async (message: string, errorType: string, stack: any) => {
    try {
        console.log(`${errorType}: ${message}\n${stack}`);
        if (process.env.environment === 'development') return;

        const transporter = nodemailer.createTransport({
            host: "smtp.porkbun.com",
            port: 465,
            secure: true,
            auth: {
                user: "watcher@vtubers.wiki",
                pass: process.env.emailPassword,
            },
        });

        const emails = await getEmails();

        const mailPromises = [];

        for (const email of emails) {
            const info = {
                from: 'watcher@vtubers.wiki',
                to: email,
                subject: `Discord Bot Error: ${fDate(new Date())}`,
                html: Template.replace('%{message}', message)
                    .replace('%{type}', errorType)
                    .replace('%{stack}', stack),

            };


            const mailPromise = transporter.sendMail(info)
                .then(() => console.log(`Error email sent to ${email}!`))
                .catch(err => console.error(err));

            mailPromises.push(mailPromise);
        }

        await Promise.all(mailPromises);

        transporter.close();
    } catch (error) {
        console.error(error);
    }
}

export async function StartWatching() {
    process.on('unhandledRejection', (reason, p) => {
        console.error('Unhandled Rejection at:', p, 'reason:', reason);
        const errorType = 'Unhandled Rejection';
        const stack = reason instanceof Error ? (reason as Error).stack : reason;
        const message = reason instanceof Error ? (reason as Error).message : reason;
        sendEmails(message as string, errorType, stack);
    });

    process.on('uncaughtException', (error, origin) => {
        console.error('Uncaught Exception:', error, 'origin:', origin);
        const errorType = 'Uncaught Exception';
        const stack = error.stack;
        const message = error.message;
        sendEmails(message, errorType, stack);
    });
}