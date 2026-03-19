# AI-Assisted Issue Resolution: 

## Description
An internal engineering tool that helps development teams retain issue context, identify recurring problems, and resolve bugs faster by maintaining a structured history of issues, root causes, and resolutions across a shared codebase.

## Motivation
This project exists because issues in a shared codebase often recur without a structured record of their root causes and resolutions. As a result, developers repeatedly debug the same or similar problems, losing time and context. The lack of a shared history of issues and fixes slows development, increases risk, and makes onboarding new engineers significantly harder.

## Target User
Software engineers working on shared production codebases within small-to-mid sized teams. These users care about resolving issues quickly and safely, maintaining system reliability, and preserving engineering knowledge that would otherwise be lost across pull requests, messages, and individual memory.


## Non-Goals
- AI output is advisory and does not make final engineering decisions
- The system does not automatically apply fixes or modify code
- This is not a replacement for issue tracking tools such as Jira or GitHub Issues
- The tool does not attempt to redesign system architecture


## System Boundaries Section
![System boundaries](<System Boundaries.png>)


## Quick Start
### Local Development
The project assumes you have docker installed on your system
- Run "docker compose up -d"
- Start the app
- No local Postgres installation required

## Usage

### Overview

Trace is a lightweight tool for **logging and retrieving development issues and their resolutions**.  
The MVP focuses on **simple capture and lookup**, without advanced workflows or integrations.

---

### 1. Start the Application

Run the development server:

```bash
npm run dev
```
Then open:
```bash
http://localhost:3000
```

### 2. Log an Issue
Create a new entry whenever you encounter a bug or technical issue.

Typical fields:
- Title – short description of the issue
- Description – what happened and context
- Tags – optional keywords (e.g. auth, api)
- Resolution – leave empty until solved

#### Example
```bash
Title: API timeout on login
Description: Login request hangs for ~10s before failing
Tags: api, auth
```
### 3. Update with Resolution
Once the issue is resolved, update the entry:
- Add the solution
- Include any important notes or edge cases

#### Example
```bash
Resolution: Increased timeout and fixed incorrect endpoint URL
```
### 4. Search and Retrieve
Use the search functionality to find past issues:
- Search by keywords in title or description
- Filter using tags (if available in your MVP)

#### Example searches:
```bash
 login error
 payment timeout 
```

### 5. Example Workflow
```bash
1. Encounter a bug
2. Log it in Trace
3. Fix the issue
4. Update the entry with the resolution
5. Search for it later when needed
```

### 6. Current Limitations (MVP)
```bash
No authentication or multi-user support
No advanced filtering or analytics
No external integrations (e.g., GitHub, Slack)
Data is stored locally (based on current setup)Search for it later when needed
```
### 7. Best Practices
```bash
Keep titles specific and searchable
Use consistent tags
Always add a resolution after fixing
Avoid duplicating entries—update existing ones instead
```

## Architecture
- Domain: business rules
- Application: use cases
- Lib: infrastructure

## Contributing
Hi. If you would like to contribute you can do so by forking the repo and opening pull requests. Please ensure that your code passes the existing tests and linting, and write tests to test your changes if applicable.

All pull requests should be submitted to the main branch.

