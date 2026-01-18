export const get_agreement_by_id = async (id_agreement) => {
  let data = {
    schema: get_schema(),
    table: "v_agreement",
    conditions: JSON.stringify({ id_agreement: id_agreement }),
  };
  const tmp = await request("/select", data, "get");
  if (tmp.length > 0) {
    return tmp[0];
  }
  return {};
};
export const get_agreement_by_number = async (agreement_number) => {
  let data = {
    schema: get_schema(),
    table: "v_agreement",
    conditions: JSON.stringify({ agreement_number: agreement_number }),
  };
  const tmp = await request("/select", data, "get");
  if (tmp.length > 0) {
    return tmp[0];
  }
  return {};
};
export const get_lang_list = async () => {
  let data = {
    schema: get_schema(),
    table: "lang_list",
  };
  return await request("/select", data, "get");
};
export const get_lang_list_dropdown = async () => {
  let data = {
    schema: get_schema(),
    table: "lang_list",
  };
  let resp = await request("/select", data, "get");
  return convertToDropdownValue(resp, "code", "name");
};

export const get_usergroup_list = async () => {
  let data = {
    schema: get_schema(),
    table: "usergroup",
  };
  return await request("/select", data, "get");
};
export const get_usergroup_list_dropdown = async () => {
  let data = {
    schema: get_schema(),
    table: "usergroup",
  };
  let resp = await request("/select", data, "get");
  return convertToDropdownValue(resp, "code", "name");
};

export const get_user_list = async () => {
  let data = {
    schema: get_schema(),
    table: "user",
  };
  return await request("/select", data, "get");
};
export const get_user_list_dropdown = async () => {
  let data = {
    schema: get_schema(),
    table: "user",
  };
  let resp = await request("/select", data, "get");
  return convertToDropdownValue(resp, "email", "fullname");
};

export const get_token_list = async () => {
  let data = {
    schema: get_schema(),
    table: "token",
  };
  return await request("/select", data, "get");
};

export const get_notification_list = async () => {
  let data = {
    schema: get_schema(),
    table: "notification",
  };
  return await request("/select", data, "get");
};

export const get_modern_trade_list = async () => {
  let data = {
    schema: get_schema(),
    table: "modern_trade",
  };
  return await request("/select", data, "get");
};
export const get_modern_trade_list_dropdown = async () => {
  let data = {
    schema: get_schema(),
    table: "modern_trade",
  };
  let resp = await request("/select", data, "get");
  return convertToDropdownValue(resp, "name", "name");
};

export const get_branch_list = async () => {
  let data = {
    schema: get_schema(),
    table: "branch",
  };
  return await request("/select", data, "get");
};
export const get_branch_list_dropdown = async () => {
  let data = {
    schema: get_schema(),
    table: "branch",
  };
  let resp = await request("/select", data, "get");
  return convertToDropdownValue(resp, "name", "name");
};

export const get_type_of_media_list = async () => {
  let data = {
    schema: get_schema(),
    table: "type_of_media",
  };
  return await request("/select", data, "get");
};

export const get_type_of_media_list_dropdown = async () => {
  let data = {
    schema: get_schema(),
    table: "type_of_media",
  };
  let resp = await request("/select", data, "get");
  return convertToDropdownValue(resp, "name", "name");
};
export const get_type_of_media_by_id = async (id) => {
  let data = {
    schema: get_schema(),
    table: "type_of_media",
    conditions: JSON.stringify({ id_type_of_media: id }),
  };
  let resp = await request("/select", data, "get");
  if (resp.length > 0) {
    return resp[0];
  } else {
    return {};
  }
};
export const get_type_of_media_by_name = async (name) => {
  let data = {
    schema: get_schema(),
    table: "type_of_media",
    conditions: JSON.stringify({ name: name }),
  };
  let resp = await request("/select", data, "get");
  if (resp.length > 0) {
    return resp[0];
  } else {
    return {};
  }
};

export const get_agreement_period_list = async () => {
  let data = {
    schema: get_schema(),
    table: "agreement_period",
  };
  return await request("/select", data, "get");
};
export const get_agreement_period_list_dropdown = async () => {
  let data = {
    schema: get_schema(),
    table: "agreement_period",
  };
  let resp = await request("/select", data, "get");
  return convertToDropdownValue(resp, "name", "name");
};
export const get_agreement_period_list_dropdown_month = async () => {
  let data = {
    schema: get_schema(),
    table: "agreement_period",
    conditions: JSON.stringify({ type: "month" }),
    order_by: ["LENGTH(name) asc", "name asc"],
  };
  let resp = await request("/select", data, "get");
  return convertToDropdownValue(resp, "name", "name");
};
export const get_agreement_period_list_dropdown_year = async () => {
  let data = {
    schema: get_schema(),
    table: "agreement_period",
    conditions: JSON.stringify({ type: "year" }),
    order_by: ["name asc"],
  };
  let resp = await request("/select", data, "get");
  return convertToDropdownValue(resp, "name", "name");
};

export const get_permission_create_of_group_agreement = async (usergroup) => {
  let conditions = { "(in)usergroup": usergroup, menu: "Agreement", can_create: true };
  let data = {
    schema: get_schema(),
    table: "permission",
    conditions: JSON.stringify(conditions),
  };
  let resp = await request("/select", data, "get");
  if (resp.length > 0) {
    return true;
  }
  return false;
};
export const get_permission_create_of_group_billing = async (usergroup) => {
  let conditions = { "(in)usergroup": usergroup, menu: "Billing", "can_create": true };
  let data = {
    schema: get_schema(),
    table: "permission",
    conditions: JSON.stringify(conditions),
  };
  let resp = await request("/select", data, "get");
  if (resp.length > 0) {
    return true;
  }
  return false;
};

export const get_permission_create_of_group_collect_point = async (usergroup) => {
  let conditions = { "(in)usergroup": usergroup, menu: "Collect Point", "can_create": true };
  let data = {
    schema: get_schema(),
    table: "permission",
    conditions: JSON.stringify(conditions),
  };
  let resp = await request("/select", data, "get");
  if (resp.length > 0) {
    return true;
  }
  return false;
};
