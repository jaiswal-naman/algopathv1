"""
Email service for sending verification and password reset emails
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional


# Email configuration
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "noreply@algopath.com")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")


class EmailService:
    """Handle sending emails for authentication."""

    @staticmethod
    def send_email(to_email: str, subject: str, html_content: str) -> bool:
        """Send an email using SMTP."""
        # Skip sending if SMTP is not configured
        if not SMTP_USER or not SMTP_PASSWORD:
            print(f"[EMAIL] Would send to {to_email}: {subject}")
            print(f"[EMAIL] Content: {html_content}")
            return True

        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = FROM_EMAIL
            msg['To'] = to_email

            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)

            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.send_message(msg)

            print(f"[EMAIL] Successfully sent to {to_email}")
            return True
        except Exception as e:
            print(f"[EMAIL] Error sending email: {str(e)}")
            return False

    @staticmethod
    def send_verification_email(to_email: str, token: str, user_name: Optional[str] = None) -> bool:
        """Send email verification link."""
        verification_url = f"{FRONTEND_URL}/verify-email?token={token}"
        
        name_greeting = f"Hi {user_name}," if user_name else "Hi there,"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to AlgoPath!</h1>
                </div>
                <div class="content">
                    <p>{name_greeting}</p>
                    <p>Thank you for signing up for AlgoPath. To complete your registration, please verify your email address by clicking the button below:</p>
                    <p style="text-align: center;">
                        <a href="{verification_url}" class="button">Verify Email Address</a>
                    </p>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; color: #666;">{verification_url}</p>
                    <p>This link will expire in 24 hours.</p>
                    <p>If you didn't create an account with AlgoPath, you can safely ignore this email.</p>
                </div>
                <div class="footer">
                    <p>© 2026 AlgoPath by NITROUS. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return EmailService.send_email(to_email, "Verify Your AlgoPath Account", html_content)

    @staticmethod
    def send_password_reset_email(to_email: str, token: str, user_name: Optional[str] = None) -> bool:
        """Send password reset link."""
        reset_url = f"{FRONTEND_URL}/reset-password?token={token}"
        
        name_greeting = f"Hi {user_name}," if user_name else "Hi there,"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset Request</h1>
                </div>
                <div class="content">
                    <p>{name_greeting}</p>
                    <p>We received a request to reset your password for your AlgoPath account. Click the button below to create a new password:</p>
                    <p style="text-align: center;">
                        <a href="{reset_url}" class="button">Reset Password</a>
                    </p>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; color: #666;">{reset_url}</p>
                    <p>This link will expire in 1 hour.</p>
                    <p><strong>If you didn't request a password reset, please ignore this email.</strong> Your password will remain unchanged.</p>
                </div>
                <div class="footer">
                    <p>© 2026 AlgoPath by NITROUS. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return EmailService.send_email(to_email, "Reset Your AlgoPath Password", html_content)
