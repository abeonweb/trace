# AI-Assisted Issue Resolution: 

## Description
An internal engineering tool that helps development teams retain issue context, identify recurring problems, and resolve bugs faster by maintaining a structured history of issues, root causes, and resolutions across a shared codebase.

## Problem Statement
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


## Local Development
- Run "docker compose up -d"
- Start the app
- No local Postgres installation required


## Architecture
- Domain: business rules
- Application: use cases
- Lib: infrastructure