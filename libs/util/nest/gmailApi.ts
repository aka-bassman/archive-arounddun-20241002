import { Logger } from "@core/common";
import { type Transporter, createTransport } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

export interface GmailOptions {
  address: string;
  service: "gmail";
  auth: { user: string; pass: string };
}

export class GmailApi {
  readonly #logger = new Logger("GmailApi");
  readonly #options: GmailOptions;
  readonly #mailer: Transporter<SMTPTransport.SentMessageInfo>;
  constructor(options: GmailOptions) {
    this.#options = options;
    this.#mailer = createTransport(options);
  }
  static getHtmlContent(id: string, password: string, serviceName: string) {
    return `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
          <head>
              <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
              <title>weekly report</title>
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body>
          <table border="0" cellpadding="0" cellspacing="0">
              <tr>
                  <td>
                    You can access the ${serviceName} with the temporarily issued password. Please change your password after logging in.<br />     
                    <br />
                    Email : ${id}
                    <br />
                    Temporal Password: ${password}
                  </td>
              </tr>
          </table>
          </body>
      </html>
      `;
  }
  async sendMail(mail: { to: string; subject: string; html: string; from?: string }) {
    const res = await this.#mailer.sendMail({ from: this.#options.address, ...mail });
    return !!res.accepted.length;
  }
  async sendPasswordResetMail(to: string, password: string, serviceName: string) {
    const html = GmailApi.getHtmlContent(to, password, serviceName);
    await this.sendMail({ to, subject: "Password Reset", html });
    return true;
  }
}
