export const getUserObjByUsername = async (manhanvien) => {
    let to_return = {};
    let data = {
      schema: get_schema(),
      table: "nhanvien",
      conditions: JSON.stringify({ username: manhanvien }),
    };
    const resp = await request("/select", data, "get");
    if (resp.length > 0) {
        to_return = resp[0];
    }
    return to_return;
  };

export const getSalesupByUsername = async (manhanvien) => {
  let masalesup = "";
  let data = {
    schema: get_schema(),
    table: "nhanvien",
    columns: ["masalesup"],
    conditions: JSON.stringify({ username: manhanvien }),
  };
  const resp = await request("/select", data, "get");
  if (resp.length > 0) {
    masalesup = resp[0].masalesup;
  }
  return masalesup;
};

export const getFullnameByUsername = async (manhanvien) => {
    let tennhanvien = "";
    let data = {
      schema: get_schema(),
      table: "nhanvien",
      columns: ["tennhanvien"],
      conditions: JSON.stringify({ username: manhanvien }),
    };
    const resp = await request("/select", data, "get");
    if (resp.length > 0) {
        tennhanvien = resp[0].tennhanvien;
    }
    return tennhanvien;
  };

  export const sendNotiToUser = async (username, data = {}) => {
    let noti_send = data;
    let notiobj = await get_noti_token_list(username);
    const android_list = notiobj.android;
    const ios_list = notiobj.ios;
    noti_send['os'] = 'android3';
    noti_send['token'] = android_list;
    requestSendnoti(noti_send);
    noti_send['os'] = 'ios';
    noti_send['token'] = ios_list;
    requestSendnoti(noti_send);
    let to_save_noti = {
      username: username,
      title: data.title,
      message: data.message,
      os: data.os,
      token: data.token,
    }
    saveNotiToServer(to_save_noti);
  };

  export const saveNotiToServer = async (data = {}) => {
    data['send_time'] = dayjs().format("YYYY-MM-DD HH:mm:ss");
    data['schema'] = get_schema();
    data['table'] = 'notification';
    await request("/save", data);
  };