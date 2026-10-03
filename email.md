Build a complete full-stack web application called "Intelligent Email Assistant".

IMPORTANT:
Build this project as a complete working full-stack application, not just a static UI.

TECHNOLOGY STACK:

Frontend:
- React.js
- HTML5
- CSS3
- JavaScript
- React Router for navigation

Backend:
- Node.js
- Express.js

Database:
- MongoDB

API Communication:
- REST API
- Fetch API or Axios

Use a clean and professional folder structure with separate frontend and backend.

PROJECT STRUCTURE:

/frontend
  /src
    /components
    /pages
    /services
    /styles

/backend
  /controllers
  /models
  /routes
  /middleware

Create proper frontend-backend integration.

PROJECT GOAL:

Create an AI-powered email management application that helps users organize, analyze, and manage emails efficiently.

The application should also include Spam and Phishing Email Detection.

IMPORTANT:
First build the application in DEMO MODE using realistic sample email data.

The application must work without requiring a real Gmail account initially.

CORE FEATURES:

1. DASHBOARD

Create a modern dashboard showing:

- Total Emails
- Unread Emails
- Important Emails
- Spam Emails
- Recent Activity

2. EMAIL LIST

Display emails with:

- Sender Name
- Sender Email
- Subject
- Email Preview
- Date and Time
- Read or Unread Status
- Important Status
- Spam Status

Create at least 12 realistic sample emails including:

- Normal Emails
- Important Emails
- Spam Emails
- Suspicious Emails
- Phishing Emails

Store the email data in MongoDB.

3. EMAIL MANAGEMENT

Users should be able to:

- View and Read Emails
- Search Emails
- Mark Emails as Read
- Mark Emails as Unread
- Star Important Emails
- Archive Emails
- Delete Emails

All these actions should update the backend and database properly.

4. EMAIL SEARCH

Allow users to search emails by:

- Sender Name
- Subject
- Keywords

Create a working backend API for email search.

5. SPAM AND PHISHING DETECTION

Analyze every email and classify it as:

- SAFE
- SPAM
- SUSPICIOUS
- PHISHING

Display the reason for the classification.

Check for:

- Suspicious words
- Urgent requests
- Unknown senders
- Suspicious links
- Requests for passwords
- Requests for personal information
- Requests for financial information

Display spam risk levels:

- Low Risk
- Medium Risk
- High Risk

6. AI EMAIL SUMMARY

When the user opens an email, display an AI Analysis section containing:

- Short Summary
- Main Topic
- Important Information
- Required Action
- Important Dates or Deadlines

For Demo Mode, create a functional AI analysis system using the email content.

Structure the backend so a real AI API can be integrated later.

7. AI REPLY GENERATOR

Generate suggested replies for emails.

Provide reply tone options:

- Professional
- Friendly
- Formal
- Concise

Allow users to edit the generated reply before sending.

8. IMPORTANT EMAIL DETECTION

Automatically identify important emails based on their content.

Display important emails separately in the Important section.

9. SIDEBAR NAVIGATION

Create a professional sidebar containing:

- Dashboard
- Inbox
- Important
- Spam
- All Emails
- Search
- Settings

10. EMAIL DETAIL PAGE

When an email is opened, display:

- Sender Information
- Sender Email
- Subject
- Full Email Content
- Date and Time

Also display an AI Analysis Panel containing:

- AI Summary
- Email Category
- Spam Risk
- Important Status
- Required Actions
- Suggested Reply

11. BACKEND API

Create proper REST APIs.

Include APIs for:

GET /api/emails
GET /api/emails/:id
POST /api/emails
PUT /api/emails/:id
DELETE /api/emails/:id
GET /api/emails/search
POST /api/emails/:id/analyze
POST /api/emails/:id/generate-reply

Use proper controllers, routes, and models.

12. DATABASE

Use MongoDB.

Create an Email model containing fields such as:

- senderName
- senderEmail
- subject
- content
- date
- isRead
- isImportant
- isSpam
- spamCategory
- spamRisk
- spamReason
- isArchived

Use environment variables for database configuration.

13. USER INTERFACE

Create a clean, modern and professional user interface.

Use:

- Responsive React components
- HTML5
- CSS3
- Modern dashboard layout
- Professional cards
- Clean typography
- Clear buttons
- Icons
- Responsive design for desktop and mobile
- Loading states
- Error handling

14. FRONTEND AND BACKEND INTEGRATION

Connect the React frontend with the Node.js and Express backend using REST APIs.

Do not keep all data only in the frontend.

Ensure the main email operations communicate with the backend and MongoDB database.

15. GMAIL INTEGRATION ARCHITECTURE

Prepare the application for future Gmail integration.

Use this architecture:

Google Login
→ User Permission and Consent
→ OAuth Token
→ Gmail API
→ Application

IMPORTANT SECURITY REQUIREMENTS:

- Never ask users for their Gmail password.
- Do not expose API keys.
- Do not expose OAuth tokens.
- Do not expose client secrets.
- Store sensitive credentials in environment variables.
- Never store secrets in frontend code.

16. FUNCTIONALITY REQUIREMENT

Do not build only a static design.

Make the following features actually work:

- Email listing
- Opening emails
- Searching emails
- Marking read and unread
- Starring emails
- Archiving emails
- Deleting emails
- Spam detection
- Phishing detection
- Important email detection
- AI email summary
- AI reply generation

17. FINAL REQUIREMENTS

After building the application:

- Test the frontend
- Test the backend APIs
- Test the database connection
- Test all buttons
- Fix errors
- Ensure frontend and backend are properly connected
- Ensure the application is responsive

Create a complete, professional, working full-stack Intelligent Email Assistant application using React.js, HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB.