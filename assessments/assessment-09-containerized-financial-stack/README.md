# Assessment 9: Containerized Financial Stack

## Objective
Run the frontend, API, analytics service, database, cache, and worker components in a repeatable, health-checked container environment.

## Requirements
- Provide fit-for-purpose Dockerfiles and Compose services.
- Configure service networking, persistence, health checks, and non-root execution.
- Keep deployment secrets out of source and provide environment-specific configuration.
- Assessment 9 implementation is reserved for later manual work; this README records the current state only.

The task brief is the available requirements source; no standalone handbook is present locally.

## Existing files and configuration
- Compose: `infrastructure/docker/docker-compose.yml`
- Dockerfiles: `infrastructure/docker/{frontend,backend,analytics,db}/Dockerfile`
- Environment template: `infrastructure/docker/.env.example`
- The current Compose file defines frontend, backend, analytics, and `db` services with ports 3000, 3001, 8000, and 5432, plus PostgreSQL and frontend node_modules volumes.

## Validation and run commands
From the repository root:
```powershell
docker compose -f infrastructure/docker/docker-compose.yml config
docker compose -f infrastructure/docker/docker-compose.yml up --build
```
Compose validation/build has not been reported as successful.

## Status and limitations
The current Compose build contexts resolve to `infrastructure/frontend`, `infrastructure/backend`, `infrastructure/analytics`, and `infrastructure/db`, which do not match the repository's top-level project folders. The `db` context is missing, and there is no Redis or worker service. The example configuration contains the literal database password `password`; it is unsuitable for deployment. No health checks, private-network restrictions, verified non-root configuration, HTTPS setup, or migration mount are shown. Containers are therefore not verified as runnable or production-secure.
