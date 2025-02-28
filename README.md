# JellyM8 API

Welcome to the JellyM8 API! A mini-api to power-up Jelly-m8 frontend. Please note that it's demo, may not work as expected, be secure.

## Technologies Used
- **Backend**: 
  - Express
  - Zod
  - Drizzle
  - Docker
  - PostgreSQL

## Getting Started with Docker

Using Docker is highly recommended to simplify the setup process. Follow the steps below to build and run the application using Docker:

### Build and Run

```bash
sudo docker compose -f docker-compose.dev.yaml up --build
```

## Installation

1. **Environment Configuration**: 
   - Rename the `.env.example` file to `.env` and update it with your environment variables or leave as is, should work.

2. **Install Dependencies**: 
   - Use the following command to install the necessary dependencies:

   ```bash
   pnpm install
   ```

## Development

To start the development server with Hot Module Replacement (HMR), run:

```bash
pnpm run dev
```

The application will be accessible at: [http://localhost:5000/api/v1](http://localhost:5000/api/v1).

## Production Deployment with Docker

You can easily deploy the container on Render for free. The deployment process is automated, so you won't need to take any additional steps.

