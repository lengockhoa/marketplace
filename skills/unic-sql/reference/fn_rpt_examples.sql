-- =============================================
-- REPORT FUNCTION EXAMPLES
-- Pattern: fn_rpt_<name> - Returns TABLE
-- =============================================

-- Example 1: Simple Report Function
DROP FUNCTION IF EXISTS qas.fn_rpt_billing;
CREATE OR REPLACE FUNCTION qas.fn_rpt_billing()
    RETURNS TABLE
            (
                modern_trade       VARCHAR,
                branch             VARCHAR,
                agreement_number   VARCHAR,
                attach_file        VARCHAR,
                attach_image       VARCHAR,
                type_of_media      VARCHAR,
                type_of_media_text VARCHAR,
                start_date         VARCHAR,
                due_date           VARCHAR,
                status             VARCHAR,
                amount             NUMERIC(16, 2),
                paid_amount        NUMERIC(16, 2),
                incoming_bill      NUMERIC(16, 2),
                agreement_period   VARCHAR,
                status_name        VARCHAR,
                request_type       VARCHAR,
                request_date       VARCHAR,
                paid_status        VARCHAR,
                paid_status_name   VARCHAR,
                billing_number     VARCHAR,
                remark             VARCHAR,
                created_on         VARCHAR
            )
AS
$$
BEGIN
    RETURN QUERY
        SELECT a.modern_trade::VARCHAR,
               a.branch::VARCHAR,
               a.agreement_number::VARCHAR,
               a.attach_file::VARCHAR,
               a.attach_image::VARCHAR,
               a.type_of_media::VARCHAR,
               a.type_of_media_text::VARCHAR,
               a.start_date::VARCHAR,
               a.due_date::VARCHAR,
               a.status::VARCHAR,
               a.amount::NUMERIC(16, 2),
               a.paid_amount::NUMERIC(16, 2),
               a.incoming_bill::NUMERIC(16, 2),
               a.agreement_period::VARCHAR,
               a.status_name::VARCHAR,
               a.request_type::VARCHAR,
               a.request_date::VARCHAR,
               a.paid_status::VARCHAR,
               a.paid_status_name::VARCHAR,
               b.billing_number::VARCHAR,
               b.remark::VARCHAR,
               b.created_on
        FROM qas.v_billing b
                 LEFT JOIN qas.v_agreement a ON a.agreement_number = b.agreement_number
        ORDER BY b.created_on DESC, b.request_date DESC;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM qas.fn_rpt_billing();


-- Example 2: Complex Report with UNION ALL
DROP FUNCTION IF EXISTS qas.fn_rpt_output;
CREATE OR REPLACE FUNCTION qas.fn_rpt_output()
    RETURNS TABLE
            (
                modern_trade       VARCHAR,
                branch             VARCHAR,
                agreement_number   VARCHAR,
                attach_file        VARCHAR,
                attach_image       VARCHAR,
                type_of_media      VARCHAR,
                type_of_media_text VARCHAR,
                start_date         VARCHAR,
                due_date           VARCHAR,
                status             VARCHAR,
                amount             VARCHAR,
                paid_amount        VARCHAR,
                incoming_bill      VARCHAR,
                agreement_period   VARCHAR,
                status_name        VARCHAR,
                request_type       VARCHAR,
                request_date       VARCHAR,
                paid_status        VARCHAR,
                paid_status_name   VARCHAR,
                billing_number     VARCHAR,
                remark             VARCHAR,
                created_on         VARCHAR,
                progress           VARCHAR,
                payment_progress   VARCHAR
            )
AS
$$
BEGIN
    RETURN QUERY
        SELECT *
        FROM (
                 -- Case 1: billing_count = 1
                 SELECT a.modern_trade::VARCHAR,
                        a.branch::VARCHAR,
                        a.agreement_number::VARCHAR,
                        a.attach_file::VARCHAR,
                        a.attach_image::VARCHAR,
                        a.type_of_media::VARCHAR,
                        a.type_of_media_text::VARCHAR,
                        a.start_date::VARCHAR,
                        a.due_date::VARCHAR,
                        a.status::VARCHAR,
                        a.amount::NUMERIC(16, 2)::VARCHAR,
                        a.paid_amount::NUMERIC(16, 2)::VARCHAR,
                        a.incoming_bill::NUMERIC(16, 2)::VARCHAR,
                        a.agreement_period::VARCHAR,
                        a.status_name::VARCHAR,
                        (CASE WHEN a.is_adhoc = TRUE THEN 'Adhoc' ELSE 'On Plan' END)::VARCHAR AS request_type,
                        a.request_date::VARCHAR,
                        a.paid_status::VARCHAR,
                        a.paid_status_name::VARCHAR,
                        b.billing_number::VARCHAR,
                        a.remark::VARCHAR,
                        a.created_on,
                        a.progress::NUMERIC(16, 2)::VARCHAR,
                        a.payment_progress::VARCHAR
                 FROM qas.v_billing b
                          LEFT JOIN qas.v_agreement a ON a.agreement_number = b.agreement_number
                 WHERE a.billing_count = 1

                 UNION ALL

                 -- Case 2: billing_count > 1 (main record)
                 SELECT a.modern_trade::VARCHAR,
                        a.branch::VARCHAR,
                        a.agreement_number::VARCHAR,
                        a.attach_file::VARCHAR,
                        a.attach_image::VARCHAR,
                        a.type_of_media::VARCHAR,
                        a.type_of_media_text::VARCHAR,
                        a.start_date::VARCHAR,
                        a.due_date::VARCHAR,
                        a.status::VARCHAR,
                        a.amount::NUMERIC(16, 2)::VARCHAR,
                        a.paid_amount::NUMERIC(16, 2)::VARCHAR,
                        a.incoming_bill::NUMERIC(16, 2)::VARCHAR,
                        a.agreement_period::VARCHAR,
                        a.status_name::VARCHAR,
                        (CASE WHEN a.is_adhoc = TRUE THEN 'Adhoc' ELSE 'On Plan' END)::VARCHAR AS request_type,
                        a.request_date::VARCHAR,
                        a.paid_status::VARCHAR,
                        a.paid_status_name::VARCHAR,
                        ''::VARCHAR,  -- billing_number (empty for parent)
                        ''::VARCHAR,  -- remark
                        a.created_on,
                        a.progress::NUMERIC(16, 2)::VARCHAR,
                        a.payment_progress::VARCHAR
                 FROM qas.v_agreement a
                 WHERE a.billing_count > 1

                 UNION ALL

                 -- Case 3: billing_count > 1 (child records)
                 SELECT ''::VARCHAR AS modern_trade,
                        ''::VARCHAR AS branch,
                        b.agreement_number AS agreement_number,
                        ''::VARCHAR AS attach_file,
                        ''::VARCHAR AS attach_image,
                        ''::VARCHAR AS type_of_media,
                        ''::VARCHAR AS type_of_media_text,
                        ''::VARCHAR AS start_date,
                        ''::VARCHAR AS due_date,
                        ''::VARCHAR AS status,
                        b.amount::NUMERIC(16, 2)::VARCHAR,
                        ''::VARCHAR AS paid_amount,
                        ''::VARCHAR AS incoming_bill,
                        ''::VARCHAR AS agreement_period,
                        ''::VARCHAR AS status_name,
                        ''::VARCHAR AS request_type,
                        b.request_date::VARCHAR,
                        ''::VARCHAR AS paid_status,
                        ''::VARCHAR AS paid_status_name,
                        b.billing_number::VARCHAR,
                        ''::VARCHAR AS remark,
                        ''::VARCHAR AS created_on,
                        ''::VARCHAR AS progress,
                        ''::VARCHAR AS payment_progress
                 FROM qas.v_billing b
                          LEFT JOIN qas.v_agreement a ON a.agreement_number = b.agreement_number
                 WHERE a.billing_count > 1

                 UNION ALL

                 -- Case 4: billing_count = 0
                 SELECT a.modern_trade::VARCHAR,
                        a.branch::VARCHAR,
                        a.agreement_number::VARCHAR,
                        a.attach_file::VARCHAR,
                        a.attach_image::VARCHAR,
                        a.type_of_media::VARCHAR,
                        a.type_of_media_text::VARCHAR,
                        a.start_date::VARCHAR,
                        a.due_date::VARCHAR,
                        a.status::VARCHAR,
                        a.amount::NUMERIC(16, 2)::VARCHAR,
                        a.paid_amount::NUMERIC(16, 2)::VARCHAR,
                        a.incoming_bill::NUMERIC(16, 2)::VARCHAR,
                        a.agreement_period::VARCHAR,
                        a.status_name::VARCHAR,
                        (CASE WHEN a.is_adhoc = TRUE THEN 'Adhoc' ELSE 'On Plan' END)::VARCHAR AS request_type,
                        a.request_date::VARCHAR,
                        a.paid_status::VARCHAR,
                        a.paid_status_name::VARCHAR,
                        b.billing_number::VARCHAR,
                        a.remark::VARCHAR,
                        a.created_on,
                        a.progress::NUMERIC(16, 2)::VARCHAR,
                        a.payment_progress::VARCHAR
                 FROM qas.v_agreement a
                          LEFT JOIN qas.v_billing b ON a.agreement_number = b.agreement_number
                 WHERE a.billing_count = 0
             ) AS t
        ORDER BY agreement_number DESC, t.created_on DESC;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM qas.fn_rpt_output();
