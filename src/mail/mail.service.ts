import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendResetPasswordEmail(
    to: string,
    subject: string,
    template: string,
    context: any,
  ) {
    try {
      await this.mailerService.sendMail({
        from: `Ecommerce-Nest.JS <${process.env.EMAIL_USERNAME}>`,
        to,
        subject,
        template, // Template file (e.g., 'order-confirmation')
        context,
      });
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendOrderNotification(
    to: string,
    subject: string,
    template: string,
    context: any,
  ) {
    try {
      await this.mailerService.sendMail({
        from: `Ecommerce-Nest.JS <${process.env.EMAIL_USERNAME}>`,
        to,
        subject,
        template,
        context,
      });
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendOrderEmails(
    customerEmail: string,
    storeOwnerEmail: string,
    orderDetails: any,
  ) {
    // notify the store owner
    await this.sendOrderNotification(
      storeOwnerEmail,
      'order successfully registered',
      'customer-notification',
      orderDetails,
    );

    // notify the customer
    await this.sendOrderNotification(
      customerEmail,
      'New Order Received',
      'admin-notification',
      orderDetails,
    );
  }
}
