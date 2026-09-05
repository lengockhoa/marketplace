var objToTranslate = {};

export const translate = async (page = "") => {
  const body = {
    schema: get_schema(),
    table: "translation",
    columns: ["origin", "local"],
    conditions: { "lang": getSession("language")},
    order_by: ["page"],
  };
  let resp = await request("select", body);
  state.objToTranslate = {};
  if (resp?.length > 0) {
    for (let i = 0; i < resp.length; i++) {
      if(!(resp[i]['origin'] in objToTranslate)){
        state.objToTranslate[resp[i]['origin']] = resp[i]['local'];
      }
    }
  }
};

export const t = (str) => {
  if(str in state.objToTranslate){
    return state.objToTranslate[str];
  } else {
    return str;
  }
};