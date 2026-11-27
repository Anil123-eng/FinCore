# Assessment 11: Secure Financial CI/CD

## Objective
Automate quality checks and secure build controls for changes to the FinCore application.

## Requirements
- Run reproducible builds and relevant tests for pull requests and main-branch changes.
- Include security checks for dependencies, secrets, and container images as required.
- Keep credentials out of workflow source and control deployment/release permissions.
- Assessment 11 implementation is reserved for later manual work; no workflow code was changed for this documentation task.

No standalone handbook is present locally; the task brief supplies the requirements summary.

## Existing workflow
The workflow path is `.github/workflows/ci.yml`. The inspected job is named `build-test`, runs on `windows-latest`, and is configured for pushes and pull requests targeting `main`. Its steps include Python 3.12 setup and analytics dependency installation, Node.js 20 setup, frontend `npm ci`, frontend build/lint, backend TypeScript check, a Python import smoke check, and `docker compose config`.

## Execution and tests
GitHub Actions runs on a matching push or pull request. Locally, individual checks can be run from their project folders:
```powershell
cd frontend; npm ci; npm run build; npm run lint
cd ..\backend; npm install; npm run build
cd ..\analytics; python -m pip install -r requirements.txt
```
These commands have not been presented as a successful pipeline run.

## Status and limitations
The workflow does not show dependency, secret, or image scanning, nor a deployment/release stage. Its commands and Compose configuration still require validation. A pre-existing local change to the workflow file was present during this task and is intentionally not included in this documentation change.
