# Database

This directory contains database schema files and migrations for the ShowUp application.

## Directory Structure

```
database/
├── init.sql          # Main database initialization script
└── migrations/       # Future database migrations
    └── README.md     # Migration guidelines
```

## Schema Overview

The `init.sql` file contains:

### Core Tables

- **`users`** - User accounts and authentication
- **`sessions`** - JWT refresh tokens
- **`challenges`** - Challenge definitions and status

### Onboarding Tables

- **`onboarding_sessions`** - User onboarding progress tracking
- **`onboarding_analytics`** - Analytics for onboarding flow optimization
- **`ai_conversations`** - AI chat logs for challenge discovery

## Usage

### Development

When running with Docker Compose, the `init.sql` file is automatically mounted and executed when the PostgreSQL container starts for the first time.

### Production

For production deployments, ensure the database is initialized with this script before starting the application.

### Manual Application

If you need to apply changes to an existing database:

```bash
# Using psql directly
PGPASSWORD=your_password psql -h localhost -p 6666 -U showup -d showup_db -f database/init.sql

# Or via Docker
docker cp database/init.sql showup-postgres:/tmp/init.sql
docker exec -i showup-postgres psql -U showup -d showup_db -f /tmp/init.sql
```

## Migration Guidelines

For future schema changes:

1. Create a new migration file in `database/migrations/`
2. Follow the naming convention: `YYYYMMDD_description.sql`
3. Use `IF NOT EXISTS` and `IF EXISTS` clauses for safety
4. Test migrations on a development database first
5. Update this README with the change description

