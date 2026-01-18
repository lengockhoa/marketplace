---
name: unic-sql
description: PostgreSQL SQL writing conventions for UNIC projects. Use when writing SQL functions, views, tables, or queries.
triggers: ["sql", "postgresql", "postgres", "function", "view", "table", "query", "fn_", "v_"]
---

# UNIC SQL Skill

PostgreSQL conventions for UNIC projects. **AI suggests SQL only. User runs manually via psql.**

## Reference Files

For complete examples, see:
- [fn_rpt_examples.sql](reference/fn_rpt_examples.sql) - Report function patterns
- [fn_get_examples.sql](reference/fn_get_examples.sql) - Get functions with permissions
- [utility_functions.sql](reference/utility_functions.sql) - Utility functions & templates

## Data Types (ONLY 3 TYPES)

| Type | Use for |
|------|---------|
| `VARCHAR` | Text, dates, timestamps, JSON, UUIDs |
| `NUMERIC(16,2)` | All numbers (use precision 16,2 for money) |
| `BOOLEAN` | True/false only |

**NEVER use:** DATE, TIMESTAMP, INTEGER, BIGINT, JSON, JSONB, UUID, TEXT

## Naming Conventions

| Object | Pattern | Example |
|--------|---------|---------|
| Table | `snake_case` | `users`, `order_items` |
| Primary Key | `id_<table_name>` | `id_users`, `id_collect_point` |
| View | `v_<name>` | `v_billing`, `v_agreement` |
| Function | `fn_<name>` | `fn_get_users`, `fn_rpt_billing` |
| Report Function | `fn_rpt_<name>` | `fn_rpt_output`, `fn_rpt_billing` |
| Get Function | `fn_get_<name>` | `fn_get_collect_point` |
| Global Function | `glb_fn_<name>` | `glb_fn_convert_query_to_json` |

## Table Structure

```sql
CREATE TABLE schema_name.table_name (
    id_table_name VARCHAR DEFAULT uuid_in(overlay(overlay(md5(random()::text || ':' || random()::text) placing '4' from 13) placing to_hex(floor(random() * (11 - 8 + 1) + 8)::int)::text from 17)::cstring) PRIMARY KEY,
    -- columns here (VARCHAR, NUMERIC, BOOLEAN only)
    created_on VARCHAR DEFAULT TO_CHAR(date_trunc('second', now() AT TIME ZONE 'Asia/Ho_Chi_Minh'), 'YYYY-MM-DD HH24:MI:SS')::character varying
);
```

## Function Return Types (IMPORTANT)

**Only 3 return types allowed:**

| Return Type | When to Use |
|-------------|-------------|
| `RETURNS SETOF view_name` | **Most common** - view must exist first |
| `RETURNS SETOF table_name` | Return from existing table |
| `RETURNS JSONB` | Dynamic/unclear structure |

## Workflow (MANDATORY)

```
Step 1: CREATE VIEW first (separate SQL file/statement)
           ↓
Step 2: CREATE FUNCTION with RETURNS SETOF view_name
```

**NEVER:**
- Create view inside function
- Use `RETURNS TABLE` - always create view instead

```sql
-- GOOD: View exists separately, function references it
CREATE VIEW schema_name.v_report AS SELECT ...;  -- Step 1 (run first)
CREATE FUNCTION fn_get() RETURNS SETOF schema_name.v_report ...;  -- Step 2

-- BAD: RETURNS TABLE
CREATE FUNCTION fn_get() RETURNS TABLE (col1 VARCHAR) ...;
```

## Function Patterns

### Pattern 1: RETURNS SETOF VIEW (Preferred)

**Step 1: Create view first**
```sql
CREATE OR REPLACE VIEW schema_name.v_report_name AS
SELECT a.column1::VARCHAR,
       a.column2::VARCHAR,
       a.amount::NUMERIC(16, 2),
       a.created_on::VARCHAR
FROM schema_name.table_name a
WHERE a.deleted_at IS NULL;
```

**Step 2: Create function returning SETOF view**
```sql
DROP FUNCTION IF EXISTS schema_name.fn_rpt_name;
CREATE OR REPLACE FUNCTION schema_name.fn_rpt_name()
    RETURNS SETOF schema_name.v_report_name
AS
$$
BEGIN
    RETURN QUERY
        SELECT * FROM schema_name.v_report_name
        ORDER BY created_on DESC;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM schema_name.fn_rpt_name();
```

### Pattern 2: RETURNS SETOF (Get Functions with Parameters)

Use when returning data from a view with user-specific logic.

```sql
DROP FUNCTION IF EXISTS schema_name.fn_get_name;
CREATE OR REPLACE FUNCTION schema_name.fn_get_name(_username VARCHAR)
    RETURNS SETOF schema_name.v_view_name
AS
$$
DECLARE
    v_role VARCHAR;
    v_is_admin BOOLEAN := FALSE;
    t_can_edit BOOLEAN := FALSE;
BEGIN
    -- Get user role
    SELECT usergroup INTO v_role FROM schema_name.user WHERE username = _username;

    -- Check permissions
    IF v_role LIKE '%Admin%' THEN
        v_is_admin = TRUE;
    END IF;

    -- Get permission from table
    SELECT can_edit INTO t_can_edit
    FROM schema_name.permission
    WHERE usergroup IN (SELECT jsonb_array_elements_text(v_role::jsonb))
      AND menu = 'Menu Name'
      AND can_edit IS TRUE;

    IF t_can_edit IS NULL THEN
        t_can_edit = FALSE;
    END IF;

    RETURN QUERY
    SELECT c.id_table,
           c.column1,
           c.column2,
           -- Computed columns with CASE
           (CASE WHEN v_is_admin AND c.status = 'DRAFT' THEN TRUE ELSE FALSE END) AS can_edit,
           t_can_edit AS can_edit_after_approved,
           c.created_on
    FROM schema_name.v_view_name c
    ORDER BY c.created_on DESC;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM schema_name.fn_get_name('user@example.com');
```

### Pattern 3: UNION ALL (Complex Reports)

Use for combining multiple result sets.

```sql
DROP FUNCTION IF EXISTS schema_name.fn_rpt_complex;
CREATE OR REPLACE FUNCTION schema_name.fn_rpt_complex()
    RETURNS TABLE
            (
                column1 VARCHAR,
                column2 VARCHAR,
                amount  VARCHAR
            )
AS
$$
BEGIN
    RETURN QUERY
        SELECT *
        FROM (
            -- First query
            SELECT a.column1::VARCHAR,
                   a.column2::VARCHAR,
                   a.amount::NUMERIC(16, 2)::VARCHAR
            FROM schema_name.v_table1 a
            WHERE a.count = 1

            UNION ALL

            -- Second query (with empty placeholders)
            SELECT ''::VARCHAR AS column1,
                   b.column2::VARCHAR,
                   b.amount::NUMERIC(16, 2)::VARCHAR
            FROM schema_name.v_table2 b
            WHERE b.count > 1
        ) AS t
        ORDER BY t.column1 DESC;
END;
$$ LANGUAGE plpgsql;
```

### Pattern 4: RETURNS JSONB (Dynamic/Unclear Structure)

Use when return structure is unclear or dynamic.

```sql
DROP FUNCTION IF EXISTS schema_name.fn_get_dynamic_data;
CREATE OR REPLACE FUNCTION schema_name.fn_get_dynamic_data(_param VARCHAR)
    RETURNS JSONB
AS
$$
DECLARE
    result JSONB := '[]';
BEGIN
    -- Build JSON from query
    SELECT jsonb_agg(row_to_json(t))
    INTO result
    FROM (
        SELECT * FROM schema_name.v_table
        WHERE column = _param
    ) t;

    RETURN COALESCE(result, '[]'::JSONB);
END;
$$ LANGUAGE plpgsql;

SELECT schema_name.fn_get_dynamic_data('value');
```

**Alternative: Use utility function**
```sql
SELECT public.glb_fn_convert_query_to_json('SELECT * FROM schema_name.table WHERE status = ''active''');
```

### Pattern 5: Utility Functions

```sql
-- Convert query result to JSON
DROP FUNCTION IF EXISTS public.glb_fn_convert_query_to_json;
CREATE OR REPLACE FUNCTION public.glb_fn_convert_query_to_json(query_text TEXT)
    RETURNS JSONB
AS $$
DECLARE
    result JSONB := '[]';
    row_data RECORD;
BEGIN
    FOR row_data IN EXECUTE query_text LOOP
        result := result || jsonb_build_array(row_to_json(row_data));
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Usage
SELECT public.glb_fn_convert_query_to_json('SELECT * FROM schema_name.table_name');
```

## Key Rules

### Always Do

1. **DROP before CREATE** - Always drop function before recreating
2. **Explicit casting** - Use `::VARCHAR`, `::NUMERIC(16,2)`, `::BOOLEAN`
3. **DECLARE variables** - Initialize with `:= FALSE` or `:= ''`
4. **NULL checks** - `IF variable IS NULL THEN variable = FALSE; END IF;`
5. **ORDER BY** - Always at the end of RETURN QUERY

### CASE WHEN Pattern

```sql
-- Boolean result
(CASE WHEN condition THEN TRUE ELSE FALSE END) AS column_name

-- String result
(CASE WHEN is_adhoc = TRUE THEN 'Adhoc' ELSE 'On Plan' END)::VARCHAR AS request_type

-- Multiple conditions
(CASE
    WHEN v_is_admin1 AND c.status = 'DRAFT' THEN TRUE
    WHEN v_is_admin2 AND c.status = 'DRAFT1' THEN TRUE
    ELSE FALSE
END) AS can_save
```

### JSONB Array Extraction

```sql
-- Extract array elements from JSONB string
SELECT jsonb_array_elements_text(usergroup::jsonb)

-- Use in WHERE clause
WHERE usergroup IN (SELECT jsonb_array_elements_text(v_role::jsonb))

-- Access JSONB object
(t.detail::jsonb -> 0 ->>'doc_date')::VARCHAR
```

### Empty String Placeholders

When UNION ALL requires matching columns:

```sql
SELECT ''::VARCHAR AS column1,
       ''::VARCHAR AS column2,
       data.real_column::VARCHAR
FROM schema_name.table data
```

## View Pattern

```sql
CREATE OR REPLACE VIEW schema_name.v_view_name AS
SELECT t.id_table,
       t.column1,
       t.column2,
       -- Computed columns
       COALESCE(t.amount, 0)::NUMERIC(16,2) AS amount,
       t.created_on
FROM schema_name.table_name t
WHERE t.deleted_at IS NULL;
```

## Common Patterns

```sql
-- Date comparison (VARCHAR)
WHERE created_on >= '2024-01-01' AND created_on <= '2024-12-31'

-- LIKE pattern for roles
WHERE usergroup LIKE '%"Admin"%'
WHERE usergroup LIKE '%Collect Point Admin 1%'

-- Pagination
LIMIT 20 OFFSET 0

-- Soft delete
WHERE deleted_at IS NULL

-- Join without FK
FROM schema_name.v_billing b
LEFT JOIN schema_name.v_agreement a ON a.agreement_number = b.agreement_number
```

## Function Testing

Always include test query after function:

```sql
-- After function definition
SELECT * FROM schema_name.fn_function_name();

-- With parameters
SELECT * FROM schema_name.fn_get_data('user@example.com');

-- With filter
SELECT * FROM schema_name.fn_get_data('user@example.com')
WHERE id_column = 'uuid-value';
```
