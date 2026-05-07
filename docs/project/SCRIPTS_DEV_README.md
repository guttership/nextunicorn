# DEV-ONLY scripts

This folder may contain helper scripts for local development and testing. These scripts are not meant to be used or invoked in production. They exist only to aid local testing and should be removed before merging or advertised.

- `backfill-origin.js` — (was) used temporarily to backfill origin flags for ideas in local DB.
- `simulate-votes.js` — (was) a dev-only script to simulate votes locally to test community validation logic.
- `simulate-api-votes.js` — (was) same as above but using API calls to test validation.
- `create-community-idea.js` — (was) helper to quickly create a community idea in the local DB.

If a script is required for CI or automated tests, convert it into a proper test case and add necessary guard checks (NODE_ENV=development) and checks to avoid running in CI/prod.

If you need any of these dev scripts for local debugging, copy them locally rather than committing them to the repository.
