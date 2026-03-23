# DIGIT Assignment - Advanced Node.js

## Features
- MongoDB persistence
- IDGen integration (fallback supported)
- Workflow integration (mock)
- Validation using Joi
- DIGIT-style APIs

## Run
npm install
npm start

## Env
MONGO_URI=
IDGEN_URL=
WORKFLOW_URL=

## APIs
POST /advocate/_create
POST /advocate/_update
POST /advocate/_search

## Notes
- Replace URLs with actual DIGIT services for full compliance
- Add Kafka for persister if needed