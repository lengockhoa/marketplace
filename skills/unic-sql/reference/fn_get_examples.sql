-- =============================================
-- GET FUNCTION EXAMPLES
-- Pattern: fn_get_<name> - Returns SETOF view
-- With user permissions and computed columns
-- =============================================

-- Example 1: Get with Role-based Permissions
DROP FUNCTION IF EXISTS qas.fn_get_collect_point;
CREATE OR REPLACE FUNCTION qas.fn_get_collect_point(_username VARCHAR)
    RETURNS SETOF qas.v_collect_point
AS
$$
DECLARE
    v_role              VARCHAR;
    v_is_admin1         BOOLEAN := FALSE;
    v_is_admin2         BOOLEAN := FALSE;
    t_can_edit_after_approved BOOLEAN := FALSE;
BEGIN
    -- Get user role
    SELECT usergroup INTO v_role FROM qas.user WHERE username = _username;

    -- Check admin roles
    IF v_role LIKE '%Collect Point Admin 1%' THEN
        v_is_admin1 = TRUE;
    END IF;

    IF v_role LIKE '%Collect Point Admin 2%' THEN
        v_is_admin2 = TRUE;
    END IF;

    -- Get permission from permission table
    SELECT can_edit_after_approved INTO t_can_edit_after_approved
    FROM qas.permission
    WHERE usergroup IN (SELECT jsonb_array_elements_text(v_role::jsonb))
      AND menu = 'Collect Point'
      AND can_edit_after_approved IS TRUE;

    -- NULL check
    IF t_can_edit_after_approved IS NULL THEN
        t_can_edit_after_approved = FALSE;
    END IF;

    RETURN QUERY
        SELECT c.id_collect_point,
               c.running_no,
               c.receipt_no,
               c.date_receipt,
               c.date_of_upload,
               c.stamp_product,
               c.status,
               c.history,
               c.created_on,
               c.username,
               c.remark,
               c.remark_admin2,
               c.attach_file,
               c.attach_image,
               c.id_sub_dealer,
               c.name_of_store,
               c.crm_user_id,
               c.sub_dealer_province,
               c.store_region,
               c.id_dealer,
               c.name_of_seller,
               c.region1_salesrep,
               c.region3_division,
               c.customer_code,
               c.total_point,
               c.total_amount,
               -- Computed permission columns
               (CASE WHEN (v_is_admin1 AND c.status = 'DRAFT') OR (v_is_admin2 AND c.status = 'DRAFT1') THEN TRUE ELSE FALSE END) AS can_edit_quantity,
               (CASE WHEN v_is_admin2 AND c.status = 'DRAFT1' THEN TRUE ELSE FALSE END) AS can_edit_multiplier,
               (CASE WHEN (v_is_admin1 AND c.status = 'DRAFT') OR (v_is_admin2 AND c.status = 'DRAFT1') THEN TRUE ELSE FALSE END) AS can_save,
               t_can_edit_after_approved AS can_edit_after_approved,
               c.detail,
               c.approved_date,
               c.approved_by
        FROM qas.v_collect_point c
        ORDER BY c.created_on DESC;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM qas.fn_get_collect_point('khoaln@scg.com');


-- Example 2: Get with Multiple Permission Flags
DROP FUNCTION IF EXISTS qas.fn_get_review_transaction_4_not_eligible;
CREATE OR REPLACE FUNCTION qas.fn_get_review_transaction_4_not_eligible(_username VARCHAR)
    RETURNS SETOF qas.v_review_transaction
AS
$$
DECLARE
    t_usergroup               VARCHAR;
    t_can_edit_after_approved BOOLEAN := FALSE;
    t_can_reject              BOOLEAN := FALSE;
    t_can_not_eligible        BOOLEAN := FALSE;
    t_can_confirm             BOOLEAN := FALSE;
    t_can_approve             BOOLEAN := FALSE;
    t_can_save                BOOLEAN := FALSE;
BEGIN
    -- Get user group
    SELECT usergroup INTO t_usergroup FROM qas.user WHERE username = _username;

    -- Get base permission
    SELECT can_edit_after_approved INTO t_can_edit_after_approved
    FROM qas.permission
    WHERE usergroup IN (SELECT jsonb_array_elements_text(t_usergroup::jsonb))
      AND menu = 'Collect Point'
      AND can_edit_after_approved IS TRUE;

    IF t_can_edit_after_approved IS NULL THEN
        t_can_edit_after_approved = FALSE;
    END IF;

    -- Role-based permission overrides
    IF t_usergroup LIKE '%"Collect Point Admin 1"%' THEN
        t_can_edit_after_approved = FALSE;
        t_can_reject = TRUE;
        t_can_not_eligible = FALSE;
        t_can_confirm = TRUE;
        t_can_approve = FALSE;
    END IF;

    IF t_usergroup LIKE '%"Collect Point Admin 2"%' THEN
        t_can_edit_after_approved = FALSE;
        t_can_reject = TRUE;
        t_can_not_eligible = FALSE;
        t_can_confirm = FALSE;
        t_can_approve = TRUE;
    END IF;

    RETURN QUERY
        SELECT t.id_review_transaction,
               t.running_no,
               t.image_name,
               t.image_name_show,
               t.user_id,
               t.ref_id,
               t.last_name,
               t.first_name,
               t.id_sub_dealer,
               t.name_of_store,
               t.post_code,
               t.sub_dealer_province,
               t.store_region,
               t.address,
               t.survey_date,
               t.date_of_upload,
               -- JSONB access with fallback
               (CASE
                    WHEN t.doc_date <> '' THEN t.doc_date
                    ELSE (CASE
                              WHEN (t.detail::jsonb -> 0 ->> 'doc_date')::VARCHAR <> ''
                                  THEN (t.detail::jsonb -> 0 ->> 'doc_date')::VARCHAR
                              ELSE ''
                        END)
                   END) AS doc_date,
               t.detail,
               t.is_confirm,
               t.confirm_user,
               t.confirm_time,
               t.is_reject,
               t.reject_by,
               t.reject_time,
               t.reject_reason,
               t.not_eligible,
               t.not_eligible_username,
               t.not_eligible_time,
               t.is_approved,
               t.approved_by,
               t.approved_time,
               -- Permission flags
               t_can_edit_after_approved AS can_edit_after_approved,
               t_can_reject AS can_reject,
               t_can_not_eligible AS can_not_eligible,
               t_can_confirm AS can_confirm,
               t_can_approve AS can_approve,
               (CASE WHEN t_can_edit_after_approved AND is_reject IS TRUE THEN TRUE ELSE FALSE END) AS can_save,
               t.doc_number,
               t.doc_number_show,
               t.customer_id,
               t.dealer_code,
               t.dealer_name,
               t.username,
               t.created_on,
               t.total_get_point,
               t.total_get_point_amount,
               t.status,
               t.last_changed_time,
               t.history,
               t.remark
        FROM qas.v_review_transaction t
        WHERE t.not_eligible = TRUE
        ORDER BY t.last_changed_time DESC;
END;
$$ LANGUAGE plpgsql;

SELECT * FROM qas.fn_get_review_transaction_4_not_eligible('hungdq@scg.com')
WHERE id_review_transaction = '6639d394-4576-4013-a8b0-8e40cbab9c6d';
