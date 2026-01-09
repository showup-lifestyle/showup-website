# Database Migrations

This directory contains database migration scripts for schema changes and data updates.

## Naming Convention

Migration files should follow this pattern:
```
YYYYMMDD_description.sql
```

Examples:
- `20241201_add_user_preferences.sql`
- `20241215_create_notification_settings.sql`
- `20241220_fix_challenge_status_index.sql`

## Migration Guidelines

### Creating a New Migration

1. **Create a new file** with the current date and descriptive name
2. **Use safe SQL patterns**:
   - `CREATE TABLE IF NOT EXISTS`
   - `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`
   - `CREATE INDEX IF NOT EXISTS`
   - `DROP TABLE IF EXISTS` (use with caution)

3. **Include comments** explaining what the migration does
4. **Test the migration** on a development database first
5. **Update the main README** with a summary of changes

### Migration Template

```sql
-- Migration: YYYYMMDD_description
-- Description: Brief description of what this migration does

-- Add new column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS new_column_name VARCHAR(255);

-- Create new table
CREATE TABLE IF NOT EXISTS new_table (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_new_table_created_at ON new_table(created_at);

-- Add trigger for updated_at
CREATE TRIGGER update_new_table_updated_at
    BEFORE UPDATE ON new_table
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### Applying Migrations

#### Development
For new databases, the `init.sql` file includes all schema changes.

For existing databases, apply migrations manually:
```bash
PGPASSWORD=your_password psql -h localhost -p 6666 -U showup -d showup_db -f database/migrations/YYYYMMDD_description.sql
```

#### Production
1. Backup the database before applying migrations
2. Apply migrations during a maintenance window
3. Test thoroughly on staging first
4. Have a rollback plan

### Rollback Strategy

Each migration should be designed to be reversible. Document rollback procedures:

```sql
-- Rollback for YYYYMMDD_description
-- Remove the new column
ALTER TABLE users DROP COLUMN IF EXISTS new_column_name;

-- Drop the new table
DROP TABLE IF EXISTS new_table;
```

### Best Practices

- **Idempotent**: Migrations should be safe to run multiple times
- **Transactional**: Use transactions for related changes
- **Tested**: Always test on a copy of production data
- **Documented**: Include comments and update this README
- **Minimal**: Keep migrations focused on a single change
- **Backwards Compatible**: Consider application compatibility

### Version Control

- Commit migration files with application code
- Tag releases that include database changes
- Keep migration history for audit purposes