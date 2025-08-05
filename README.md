🚀 Swagger Upload Service

A Node.js-based microservice that allows users to upload and validate Swagger (OpenAPI) specifications in JSON or YAML format.
It includes user authentication, role-based authorization, file uploads, and a CI/CD pipeline that builds and deploys the app automatically to an EC2 instance using GitLab CI/CD.

📋 Features
✅ User registration & login with JWT-based authentication.
✅ Role-based access control (user and admin).
✅ Admins can upload Swagger files (YAML/JSON) or paste raw text.
✅ Validates Swagger content and provides meaningful feedback.
✅ REST APIs built with Express.js.
✅ Data persistence with MongoDB & Mongoose.
✅ Password hashing with bcrypt.
✅ File uploads handled by multer.
✅ YAML parsing with js-yaml.
✅ CORS enabled for front-end integration.
✅ Environment variables managed via dotenv.

🐳 CI/CD & Deployment
This project comes with a GitLab CI/CD pipeline that:
1️⃣ Builds the Node.js application into a Docker image.
2️⃣ Tags the image with the current commit SHA.
3️⃣ Pushes the Docker image to Docker Hub.
4️⃣ Pulls the image from Docker Hub on an EC2 instance.
5️⃣ Runs the container on EC2, exposing the API to the public.

🛠️ Tech Stack & Libraries
Node.js (v21)
Express.js
MongoDB + Mongoose
JWT for authentication
bcrypt for password hashing
multer for file uploads
js-yaml for YAML validation
dotenv for environment variables
CORS for cross-origin requests
Docker for containerization
GitLab CI/CD for automated build & deployment
Docker Hub for image registry
AWS EC2 for hosting the application

🗃️ CI/CD Pipeline Overview

✅ When you push to the main branch:
Build stage
Uses Docker-in-Docker to build the app as an image.
Logs in to Docker Hub.
Tags and pushes the image to Docker Hub.
Deploy stage
Runs on a GitLab runner already installed on the EC2 instance.
Pulls the image from Docker Hub.
Removes any existing container.
Runs the new container on EC2.

The EC2 runner is registered with GitLab and listens for jobs tagged with ec2-runner.


📦 API Endpoints

| Method | Endpoint                    | Description                     |
| ------ | --------------------------- | ------------------------------- |
| POST   | `/api/auth/register`        | Register a user                 |
| POST   | `/api/auth/login`           | Login & get JWT                 |
| POST   | `/api/admin/upload-swagger` | Admin-only: Upload Swagger spec |

🔗 Notes
Ensure your EC2 instance has a GitLab runner installed & registered with the tag ec2-runner.
Ensure your Docker Hub credentials (DOCKER_USERNAME & DOCKER_PASSWORD) are set in GitLab CI/CD variables.
The pipeline runs on main branch.