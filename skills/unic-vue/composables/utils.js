import _dayjs from 'dayjs';
export function dayjs(...args) {
  return _dayjs(...args)
};

export const formatDate = (date, type) => {
  if (check_is_null_or_blank(date)) {
    return "";
  }
  if (type === "time") {
    return dayjs(date).format("HH:mm:ss");
  }
  if (type === "datetime") {
    return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
  }
  if (type === "date") {
    return dayjs(date).format("YYYY-MM-DD");
  }
  if (type === "read_date") {
    return dayjs(date).format("DD/MM/YYYY");
  }
  if (type === "read_datetime") {
    return dayjs(date).format("DD/MM/YYYY HH:mm:ss");
  }
  return dayjs(date).format("YYYY-MM-DD");
};

export const getDateList = (fromDate, toDate) => {
  const end = dayjs(toDate);
  const dateArray = [];
  let currentDate = dayjs(fromDate);
  while (currentDate.isBefore(end) || currentDate.isSame(end, "day")) {
    let formattedDate = currentDate.format("YYYY-MM-DD");
    dateArray.push(formattedDate);
    currentDate = currentDate.add(1, "day");
  }
  return dateArray;
};

export const formatNumber = (num, separator = ".", decimal = 2) => {
  if (check_is_null_or_blank(num)) {
    return "";
  }
  num = parseFloat(num);
  return num.toFixed(decimal).replace(/\B(?=(\d{3})+(?!\d))/g, separator);
};

export const screen_height = () => {
  if (process.client) {
    return window.innerHeight;
  }
};

export const arraysContainAllElements = (arr1, arr2) => {
  return arr2.every((element) => arr1.includes(element));
};

export const bodautiengviet = (str) => {
  str = str.toString().toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
  str = str.replace(/ + /g, " ");
  str = str.trim();
  return str;
};

export const remove_html = (lst, col) => {
  for (let i = 0; i < lst.length; i++) {
    for (let j = 0; j < col.length; j++) {
      if (!check_is_null_or_blank(lst[i][col[j]])) {
        if (typeof lst[i][col[j]] === "string") {
          if (lst[i][col[j]].includes("<a")) {
            lst[i][col[j]] = remove_a_tag(lst[i][col[j]]);
          }
        }
      }
    }
  }
  return lst;
};

export const check_is_null_or_blank = (value) => {
  if (value == null) {
    return true;
  }
  let to_return = typeof value === "undefined" || value === "undefined" || value === undefined || value === "" || value == {};
  if (typeof value === "object") {
    if (value.length == 0) {
      to_return = true;
    }
    if (Object.keys(value).length === 0) {
      to_return = true;
    }
  }
  return to_return;
};

export const check_is_zero = (value) => {
  if (isNaN(value)) {
    return false;
  }
  return typeof value === "undefined" || value === "0" || value === "0.00" || value === 0 || value == 0;
};

export const move_to_top = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

export const go_to_page = (page, query = "") => {
  const router = useRouter();
  if (query === "") {
    router.push({ path: page });
  } else {
    router.push({ path: page, query: query });
  }
};

export const go_back = (page) => {
  const router = useRouter();
  if (window.history.length > 1) {
    router.back(); // Go back to the previous page
  } else {
    if (check_is_null_or_blank(page)) {
      go_to_page("/");
    } else {
      go_to_page(page);
    }
  }
};

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

import { message } from "ant-design-vue";
export const show_message = (type, content, duration = 3) => {
  message[type]({
    content: content,
    duration: duration,
  });
};

export const convertToDropdownValue = (lst, value_col, label_col) => {
  let to_return = lst.map((obj) => {
    return {
      value: obj[value_col],
      label: t(obj[label_col]),
    };
  });
  return to_return;
};

export const convertListToObject = (lst, key_col, value_col) => {
  let to_return = {};
  lst.map((obj) => {
    to_return[obj[key_col]] = obj[value_col];
  });
  return to_return;
};

export const convertListToListOfField = (lst, key_col) => {
  let to_return = [];
  lst.map((obj) => {
    to_return.push(obj[key_col]);
  });
  return to_return;
};
export function sortListByValueAsc(list) {
  return list.sort((a, b) => {
    const aValue = parseInt(a.value);
    const bValue = parseInt(b.value);
    return aValue - bValue;
  });
}
