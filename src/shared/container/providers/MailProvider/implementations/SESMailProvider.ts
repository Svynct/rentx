import nodemailer, { Transporter } from "nodemailer";
import { SES } from "aws-sdk";
import { injectable } from "tsyringe";
import handlebars from "handlebars";
import fs from "fs";

import { IMailProvider } from "../IMailProvider";

@injectable()
class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    this.client = nodemailer.createTransport({
      SES: new SES({
        apiVersion: "2010-12-01",
        region: process.env.AWS_REGION
      })
    })
  }

  async sendMail(to: string, subject: string, variables: any, path: string): Promise<void> {
    const templateFileContent = fs.readFileSync(path).toString("utf-8");

    const templateParse = handlebars.compile(templateFileContent);

    const templateHtml = templateParse(variables);

    const message = await this.client.sendMail({
      to,
      from: "Rentx <rentx@svynct.dev>",
      subject,
      html: templateHtml
    });

    console.log("message sent: %s", message.messageId);
    console.log("preview url: %s", nodemailer.getTestMessageUrl(message));
  }
}

export { SESMailProvider };