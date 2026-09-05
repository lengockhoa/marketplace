-- =============================================
-- UTILITY FUNCTION EXAMPLES
-- Pattern: glb_fn_<name> - Global utility functions
-- =============================================

-- Convert Query Result to JSON
DROP FUNCTION IF EXISTS public.glb_fn_convert_query_to_json;
CREATE OR REPLACE FUNCTION public.glb_fn_convert_query_to_json(query_text TEXT)
    RETURNS JSONB
AS
$$
DECLARE
    result   JSONB := '[]';
    row_data RECORD;
BEGIN
    FOR row_data IN EXECUTE query_text
        LOOP
            result := result || jsonb_build_array(row_to_json(row_data));
        END LOOP;

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Usage
SELECT public.glb_fn_convert_query_to_json('SELECT * FROM qas.collect_point');


-- =============================================
-- TABLE STRUCTURE TEMPLATE
-- =============================================

CREATE TABLE schema_name.table_name
(
    -- Primary key with UUID
    id_table_name VARCHAR DEFAULT uuid_in(overlay(overlay(md5(random()::text || ':' || random()::text) placing '4' from 13) placing to_hex(floor(random() * (11 - 8 + 1) + 8)::int)::text from 17)::cstring) PRIMARY KEY,

    -- VARCHAR columns
    name          VARCHAR,
    status        VARCHAR,
    description   VARCHAR,

    -- NUMERIC columns
    amount        NUMERIC(16, 2),
    quantity      NUMERIC(16, 2),

    -- BOOLEAN columns
    is_active     BOOLEAN DEFAULT TRUE,
    is_deleted    BOOLEAN DEFAULT FALSE,

    -- Audit columns
    created_on    VARCHAR DEFAULT TO_CHAR(date_trunc('second', now() AT TIME ZONE 'Asia/Ho_Chi_Minh'), 'YYYY-MM-DD HH24:MI:SS')::character varying,
    created_by    VARCHAR,
    updated_on    VARCHAR,
    updated_by    VARCHAR,
    deleted_at    VARCHAR
);


-- =============================================
-- VIEW TEMPLATE
-- =============================================

CREATE OR REPLACE VIEW schema_name.v_table_name AS
SELECT t.id_table_name,
       t.name,
       t.status,
       t.description,
       COALESCE(t.amount, 0)::NUMERIC(16, 2)  AS amount,
       COALESCE(t.quantity, 0)::NUMERIC(16, 2) AS quantity,
       t.is_active,
       t.created_on,
       t.created_by
FROM schema_name.table_name t
WHERE t.deleted_at IS NULL
  AND t.is_deleted = FALSE;


-- =============================================
-- INDEX TEMPLATES
-- =============================================

-- Single column index
CREATE INDEX idx_table_column ON schema_name.table_name (column_name);

-- Composite index
CREATE INDEX idx_table_col1_col2 ON schema_name.table_name (column1, column2 DESC);

-- Partial index (soft delete)
CREATE INDEX idx_table_active ON schema_name.table_name (status) WHERE deleted_at IS NULL;
