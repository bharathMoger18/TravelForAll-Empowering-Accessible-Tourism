# TravelForAll — Empowering Accessible Tourism

**A tourism booking platform designed to bring travel experiences, accessibility information, and booking functionality together in one application.**

TravelForAll is a web application developed as a final-year project. It brings together travel-tour discovery, user accounts, reviews, booking workflows, and payment-related functionality in a single platform.

The project is built with Node.js and Express on the server side, MongoDB for data persistence, Mongoose for database modeling, and Pug for server-rendered views. It also includes integrations for payment processing, image management, email delivery, and document generation.

> **Project repository:** [TravelForAll-Empowering-Accessible-Tourism](https://github.com/bharathMoger18/TravelForAll-Empowering-Accessible-Tourism)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Project Objectives](#project-objectives)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Application Architecture](#application-architecture)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [API Overview](#api-overview)
- [Payments and Integrations](#payments-and-integrations)
- [Security Considerations](#security-considerations)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

Planning a trip involves more than finding a destination. Travellers may also need reliable tour information, a way to manage bookings, reviews from other users, and information relevant to their accessibility requirements.

TravelForAll brings these travel-related workflows into one web application. Its backend provides routes and data models for tours, users, reviews, bookings, and accessibility-related functionality, while its view layer uses Pug templates to render web pages.

The application also integrates with external services for payment processing, image handling, and email delivery.

### Project goals

- Provide a central application for discovering and managing travel experiences.
- Support user accounts and authentication.
- Organize tour, review, booking, and accessibility-related data.
- Integrate payment functionality into the booking workflow.
- Support maintainable server-side development through modular routes and database models.
- Apply web security practices such as HTTP security headers, request limiting, input sanitization, and token-based authentication.

## Project Objectives

The project explores the design and implementation of a full-stack web application, including:

1. **Backend development:** Build server-side functionality with Node.js and Express.
2. **Data management:** Model and persist application data with MongoDB and Mongoose.
3. **Server-rendered interfaces:** Use Pug templates to render application views.
4. **Authentication:** Implement user authentication using JSON Web Token-related tooling.
5. **Booking and payment workflows:** Organize booking-related functionality and integrate payment providers.
6. **External service integration:** Support image management and email delivery through dedicated services.
7. **Application security:** Use middleware and supporting libraries to reduce common web application risks.

## Features

### 1. Tour management and discovery

The application includes tour-related functionality for working with travel experiences.

- Tour-related API endpoints.
- Server-side data handling through the Express application.
- Database integration using Mongoose models.
- Pug-based rendering for server-generated pages.

The exact tour filters, sorting options, and administrative capabilities should be documented once verified against the implementation.

### 2. User accounts and authentication

The application contains user-related functionality and authentication components.

- User-related API routes.
- JSON Web Token tooling for authentication workflows.
- Support for user account data.
- Security middleware to help protect incoming requests.

Authentication and authorization rules should be reviewed against the current code before assuming that every route requires authentication.

### 3. Booking functionality

TravelForAll includes a booking-related API module.

- Dedicated booking endpoints.
- Integration with the application's travel and user data.
- Payment-related integration dependencies.

The exact booking lifecycle, cancellation rules, booking status transitions, and payment-confirmation behavior depend on the current implementation.

### 4. Reviews

A dedicated reviews API module provides the foundation for review-related operations.

Reviews can help travellers make more informed decisions. The precise review permissions, rating rules, and relationship between reviews and tours should be confirmed in the source code.

### 5. Accessibility-related functionality

Accessibility is part of the project's focus, and the application includes a dedicated accessibility API module.

This functionality is intended to support accessibility-related travel information and workflows. Specific accessibility fields, filters, standards, and user-facing features should be described only after verifying the implemented data model and views.

### 6. Payment integrations

The project includes Stripe integration and an Instamojo-related configuration.

The codebase also defines a Stripe webhook endpoint for payment-event handling. The actual payment flow, webhook verification, and provider availability should be verified before using the application for real transactions.

### 7. Image handling

The project includes image-processing and upload-related dependencies such as Cloudinary, Multer, and Sharp.

These tools support image storage, upload handling, and image processing. Their exact usage depends on the individual application modules and configuration.

### 8. Email and document generation

The dependency stack includes Nodemailer for email-related functionality and PDFKit for PDF generation.

These integrations provide building blocks for email communication and document creation. The specific messages and documents generated by the application should be confirmed from the implementation.

---

## Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime for the server |
| Express.js | HTTP server and routing framework |
| MongoDB | Document-oriented database |
| Mongoose | MongoDB modeling and data access |
| Pug | Server-rendered HTML templates |
| JSON Web Tokens (JWT) | Token-based authentication tooling |
| Stripe | Payment processing integration |
| Instamojo | Additional payment-provider integration |
| Cloudinary | Image management integration |
| Multer | Multipart file-upload handling |
| Sharp | Image processing |
| Nodemailer | Email delivery integration |
| PDFKit | PDF generation |
| Helmet | HTTP security headers |
| Express rate limiting | Request-rate limiting |
| Input sanitization libraries | Protection against certain unsafe inputs |

The versions and configuration of these dependencies are defined by the repository's `package.json` and lockfile.

---

## Application Architecture

TravelForAll follows a server-side web application architecture.

```text
                  User / Browser
                        |
                        v
                 Express Server
                        |
          +-------------+-------------+
          |             |             |
          v             v             v
      Pug Views     API Routes    Middleware
                        |         - Security
                        |         - Rate limits
                        |         - Sanitization
                        v
                Application Logic
                        |
                        v
                  Mongoose Models
                        |
                        v
                     MongoDB

        External integrations, where configured:
        - Payment providers
        - Cloudinary
        - Email delivery
        - PDF generation
```

### Request lifecycle

1. A browser or API client sends a request to the server.
2. Express receives the request and applies the configured middleware.
3. The relevant route handles the request.
4. Application logic interacts with database models or configured external services.
5. The application returns a rendered view or an API response.

This diagram describes the high-level application structure; exact middleware order and individual service interactions should be checked against the source code.

---

## Getting Started

### Prerequisites

Install or arrange access to the following:

- [Node.js](https://nodejs.org/) — use a version compatible with the project dependencies.
- npm, which is distributed with Node.js.
- A MongoDB database, either locally or through a hosted MongoDB service.
- The required credentials for whichever external integrations you intend to run.

### 1. Clone the repository

```bash
git clone https://github.com/bharathMoger18/TravelForAll-Empowering-Accessible-Tourism.git

cd TravelForAll-Empowering-Accessible-Tourism
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

The server is configured to load environment settings from `config.env`. Create this file locally using the variables required by the current application configuration.

Do not commit the file or place real credentials in the README.

See [Environment Configuration](#environment-configuration) below.

### 4. Start the application

For development:

```bash
npm run dev
```

For the regular application start command:

```bash
npm start
```

The server defaults to port `3000` when no alternative port is configured. Check the startup output and the server configuration for the actual listening address.

Open the local URL corresponding to the configured port in your browser.

---

## Environment Configuration

The application uses environment variables for database access, authentication, payment providers, image management, and email configuration.

Create a local `config.env` file with the variable names expected by the source code.

Typical configuration categories include:

| Category | Configuration purpose |
|---|---|
| Database | MongoDB connection string |
| Server | Port and runtime settings |
| Authentication | JWT secret and token-related settings |
| Stripe | Payment API keys and webhook secret |
| Instamojo | Provider credentials and configuration |
| Cloudinary | Image-service credentials |
| Email | SMTP or email-service settings |

**Important:** These are configuration categories, not a guarantee of the exact variable names required by every module. Verify the names in `server.js`, configuration files, and the relevant service modules before running the application.

The database connection configuration uses a password placeholder replacement pattern, so ensure that the MongoDB connection string follows the format expected by the current code.

### Security rules for configuration

- Never commit `config.env`, `.env`, or any file containing real credentials.
- Use strong, unique authentication secrets.
- Keep payment-provider keys and webhook secrets private.
- Use test credentials when developing payment workflows.
- If credentials have been exposed, rotate them with the corresponding provider.
- Do not paste real secrets into GitHub issues, logs, or public documentation.

---

## Running the Application

### Development mode

```bash
npm run dev
```

Use this command for the development workflow configured in `package.json`.

### Standard start

```bash
npm start
```

Use this command to start the application with its regular start script.

### Build browser-side JavaScript

```bash
npm run build:js
```

This runs the browser-side JavaScript build script defined by the project. Review its configuration before running it if generated assets are important to your working tree.

### Verify available scripts

To inspect the exact commands available in the checked-out version:

```bash
npm run
```

---

## API Overview

The application organizes its API into resource-specific route groups.

The following paths are based on the server route configuration.

| Resource | Base path | Purpose |
|---|---|---|
| Tours | `/api/v1/tours` | Tour-related operations |
| Users | `/api/v1/users` | User-related operations |
| Reviews | `/api/v1/reviews` | Review-related operations |
| Bookings | `/api/v1/bookings` | Booking-related operations |
| Accessibility | `/api/v1/accessibility` | Accessibility-related operations |
| Stripe webhook | `/webhook-checkout` | Payment-provider event handling |

The precise HTTP methods, request bodies, response schemas, and permission requirements are defined by the individual route handlers.

### Example requests

Once the server is running locally, you can check whether the API routes respond:

```bash
curl -i http://localhost:3000/api/v1/tours
```

```bash
curl -i http://localhost:3000/api/v1/users
```

These commands are simple connectivity checks. A route may require authentication, parameters, or a particular HTTP method, so an error response does not necessarily mean that the server is unavailable.

### API documentation

A useful next step is to document each implemented endpoint with:

- HTTP method and full path.
- Authentication requirements.
- Required parameters and request body.
- Example success response.
- Common error responses.
- Authorization and validation rules.

Avoid documenting guessed request or response formats.

---

## Payments and Integrations

### Stripe

Stripe-related dependencies and a webhook route are present in the project.

When configuring Stripe, verify:

- The correct test or live API keys are being used.
- The webhook signing secret is configured correctly.
- Webhook signatures are verified before events are trusted.
- Payment completion and booking state are handled consistently.
- Repeated webhook events do not create duplicate side effects.

These are implementation checks, not claims that every control has already been implemented.

### Instamojo

The project also includes Instamojo-related configuration. Verify the configured endpoints, credentials, and current integration logic before attempting a payment.

### Cloudinary

Cloudinary is included for image-related functionality. Configure the relevant account credentials locally and verify that upload handling and storage settings match the intended environment.

### Email and PDFs

Nodemailer and PDFKit are included in the dependency stack. Configure email credentials and test delivery in a development environment before relying on them for production communication.

---

## Security Considerations

Security-related dependencies in this project include Helmet, rate limiting, sanitization tooling, and JWT-related libraries.

When reviewing or extending the application, pay particular attention to:

- **Secrets management:** Keep environment files and credentials out of version control.
- **Authentication:** Validate token handling, expiration, and secret configuration.
- **Authorization:** Ensure users can only access or modify resources they are permitted to use.
- **Input validation:** Validate incoming parameters, request bodies, and uploaded files.
- **Rate limiting:** Apply suitable limits to sensitive or abuse-prone endpoints.
- **Payment webhooks:** Verify webhook signatures and process events safely.
- **File uploads:** Restrict accepted file types and sizes, and validate uploaded content.
- **Database access:** Use safe query patterns and appropriate validation.
- **Production configuration:** Disable unnecessary debugging and avoid exposing sensitive errors.
- **Personal data:** Do not publish real user records, private uploads, or database exports.

A security library being installed does not by itself prove that every endpoint is secure. Security behavior should be verified through code review and testing.

---

## Project Structure

The following is a high-level guide to the major components. Exact filenames may differ as the repository evolves.

```text
TravelForAll-Empowering-Accessible-Tourism/
├── controllers/          # Request-handling and application logic
├── models/               # Database models
├── routes/               # Application and API route definitions
├── views/                # Pug templates
├── public/               # Browser-accessible static assets
├── utils/                # Shared utilities and integrations
├── dev-data/             # Development data, if included
├── server.js             # Application entry point
├── package.json          # Dependencies and npm scripts
├── package-lock.json     # Dependency lockfile
├── config.env            # Local environment configuration; do not commit
└── README.md             # Project documentation
```

Treat this as an orientation guide and compare it with the actual directory tree before using it as an exact inventory. The environment file should remain local and should not be part of the public repository.

---

## Development Workflow

A typical local development workflow is:

1. Clone the repository.
2. Install dependencies.
3. Configure a local database and the necessary environment variables.
4. Start the application in development mode.
5. Exercise the relevant routes and user workflows.
6. Review the changes before committing.
7. Keep credentials, user data, generated files, and local-only artifacts out of Git.

Before committing changes, inspect the staged files:

```bash
git status --short
git diff --cached --stat
git diff --cached --check
```

To review available npm scripts:

```bash
npm run
```

Run the project's configured build and verification commands before merging substantial changes.

---

## Troubleshooting

### MongoDB connection fails

- Confirm that the database service is running or the hosted database is reachable.
- Verify the connection-string format expected by the application.
- Check the database username and permissions.
- Ensure special characters in credentials are encoded correctly when required.

### Environment variables appear undefined

- Confirm that the local `config.env` file exists.
- Check that the variable names match those read by the code.
- Verify when environment configuration is loaded during server startup.
- Restart the application after changing environment settings.

### Port is already in use

Choose an available port using the configuration mechanism supported by the application, then restart the server.

### Payment integration fails

- Check that the correct provider credentials are configured.
- Confirm that test and live environments are not mixed.
- Review the server logs without exposing secrets.
- Verify webhook configuration and signature handling.

### Image uploads fail

- Check the image-service credentials.
- Review upload size and file-type restrictions.
- Confirm that local storage paths or remote upload settings are configured correctly.

### An API request returns an error

- Confirm the HTTP method and route path.
- Check whether authentication is required.
- Validate request parameters and body fields.
- Review the server logs and route-specific error handling.

---

## Future Improvements

Potential directions for further development include:

- More comprehensive accessibility information and filtering.
- Clearer accessibility details on tour pages.
- Expanded automated testing for authentication, bookings, and payment flows.
- API documentation with verified request and response examples.
- Improved booking status and payment-event observability.
- Additional validation and authorization tests.
- Deployment documentation and environment-specific configuration guidance.
- Sanitized screenshots or a demonstration of the application.

These are potential improvements, not statements that the features are already implemented.

---

## Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make a focused change.
4. Test the affected behavior.
5. Review the diff for credentials, private data, and generated files.
6. Submit a pull request describing the change.

For significant changes, include the motivation, implementation details, and testing performed.

---

## License

No license has been confirmed for this repository. Until a license is added, do not assume that others have permission to redistribute or reuse the project's code.

---

**Built as a final-year project exploring full-stack web development, travel-related workflows, database-backed applications, and third-party service integration.**
