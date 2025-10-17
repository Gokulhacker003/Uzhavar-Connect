Local server with local email storage

This server exposes a POST /api/send-email endpoint which accepts form payloads and stores email details locally without actually sending emails. All submissions are persisted for admin review.

Quick setup

1. Install dependencies:
   npm install

2. Create a .env file in this folder using the example:
   - Copy `.env.example` -> `.env` and fill in the values

.env variables

- TO_EMAIL: Recipient for form submissions (used in logs only)
- ADMIN_KEY: Password for accessing admin submission reviews

Features

- All form submissions are stored in `data/submissions.json`
- Email details are logged to `data/email.log` 
- Admin can review submissions at `/admin/submissions` with password
- No actual emails are sent - everything stays local

Testing

1. Start the server: `node index.js`
2. Submit any form from the React app
3. Check the server console: you'll see "Email details stored locally:" 
4. Review stored submissions in the admin panel

Security

- Do not commit `.env` with real credentials.
- For production, use secure secret storage (Azure Key Vault / AWS Secrets Manager / environment variables in your host) and secure authentication for the admin UI.

Troubleshooting

- Authentication errors: double-check SMTP_USER and SMTP_PASS and provider docs.
- Port/connection errors: ensure outbound SMTP connections are allowed from your host.
- If using Gmail and you see an authentication or permission error, verify App Password and that the FROM header is permitted.

