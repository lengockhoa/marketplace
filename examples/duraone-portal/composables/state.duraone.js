export const state = reactive({
  username: "",
  fullname: "",
  language: "",
  usergroup: "",
  page_header: "",
  homepage: "/agreement/agreementtodo",
  loading: false,
  loading_count: 0,
  screen_height: 0,
  is_update: false,
  objToTranslate: {},
});

export const baseurl = () => {
  var url = window.location.host;
  if (url.includes("qas")) {
    return "https://qas.duraoneportal.com/";
  }
  if (url.includes("localhost")) {
    return "https://qas.duraoneportal.com/";
    // return "https://duraoneportal.com/";
    // return "http://localhost:7778/";
  }
  return "https://duraoneportal.com/";
};
export const get_schema = () => {
  var url = window.location.host;
  if (url.includes("qas")) {
    return "qas";
  } 
  if(url.includes("localhost")){
    return "qas";
    // return "prd";
  }
  return "prd";
};

export const menu_prd = reactive([
  {
    link: "agreement_management",
    name: "Agreement Management",
    icon: "fas fa-file-signature",
    sub_menu: [
      {
        name: "Todo Agreement",
        link: "/agreement/agreementtodo",
        icon: "fas fa-history",
      },
      {
        name: "All Agreement",
        link: "/agreement/agreementall",
        icon: "fas fa-th-list",
      },
      {
        name: "Pending Agreement",
        link: "/agreement/agreementpending",
        icon: "fas fa-spinner",
      },
      {
        name: "Approved Agreement",
        link: "/agreement/agreementapproved",
        icon: "fas fa-check",
      },
      {
        name: "Rejected Agreement",
        link: "/agreement/agreementrejected",
        icon: "fas fa-ban",
      },
    ],
  },
  {
    link: "billing_management",
    name: "Billing Management",
    icon: "fas fa-file-invoice-dollar",
    sub_menu: [
      {
        name: "Todo Billing",
        link: "/billing/todo",
        icon: "fas fa-history",
      },
      {
        name: "All Billing",
        link: "/billing/all",
        icon: "fas fa-th-list",
      },
    ],
  },
  {
    link: "collect_point_management",
    name: "Collect Point",
    icon: "fas fa-coins",
    sub_menu: [
      {
        name: "Summary",
        link: "/collect_point/summary",
        icon: "fas fa-list",
      },
      {
        name: "All Transactions",
        link: "/collect_point/transactions",
        icon: "fas fa-check",
      },
      {
        name: "Review Transactions",
        link: "/collect_point/reviewtransaction",
        icon: "fas fa-search-location",
      },
      {
        name: "Confirmed Transactions",
        link: "/collect_point/reviewtransaction/confirm",
        icon: "fas fa-check-double",
      },
      {
        name: "Ineligible Transactions",
        link: "/collect_point/reviewtransaction/not_eligible",
        icon: "fas fa-times",
      },
      {
        name: "BuzzeeBee Report",
        link: "/collect_point/reviewtransaction/buzzeebee_report",
        icon: "fab fa-hubspot",
      },
      {
        name: "Report",
        link: "/collect_point/report",
        icon: "fas fa-server",
      },
    ],
  },
  {
    link: "report",
    name: "Report",
    icon: "fas fa-chart-bar",
    sub_menu: [
      {
        name: "Output Report",
        link: "/report/master",
        icon: "fas fa-server",
      },
      {
        name: "Agreement",
        link: "/report/agreement",
        icon: "fas fa-file-signature",
      },
      {
        name: "Billing",
        link: "/report/billing",
        icon: "fas fa-file-invoice-dollar",
      },
    ],
  },
  {
    link: "master_data",
    name: "Master Data",
    icon: "fas fa-th",
    sub_menu: [
      {
        name: "Agreement Period",
        link: "/master/agreementperiod",
        icon: "fas fa-clock",
      },
      {
        name: "Type of Media",
        link: "/master/typeofmedia",
        icon: "fas fa-photo-video",
      },
      {
        name: "Modern Trade",
        link: "/master/moderntrade",
        icon: "fas fa-exchange-alt",
      },
      {
        name: "Branch",
        link: "/master/branch",
        icon: "fas fa-code-branch",
      },
      {
        name: "User",
        link: "/master/users",
        icon: "fas fa-user",
      },
      {
        name: "Permission",
        link: "/master/permission",
        icon: "fas fa-lock",
      },
      {
        name: "Translation",
        link: "/master/translation",
        icon: "fas fa-language",
      },
      {
        name: "Sub Dealer",
        link: "/master/subdealer",
        icon: "fas fa-users",
      },
      {
        name: "Dealer",
        link: "/master/dealer",
        icon: "fas fa-users",
      },
      {
        name: "Production Group",
        link: "/master/productgroup",
        icon: "fas fa-anchor",
      },
      {
        name: "Product",
        link: "/master/product",
        icon: "fas fa-battery-full",
      },
      {
        name: "Postal - Region",
        link: "/master/postcode",
        icon: "fas fa-map-marker-alt",
      },
    ],
  },
]);

export const menu_qas = reactive([
  {
    link: "agreement_management",
    name: "Agreement Management",
    icon: "fas fa-file-signature",
    sub_menu: [
      {
        name: "Todo Agreement",
        link: "/agreement/agreementtodo",
        icon: "fas fa-history",
      },
      {
        name: "All Agreement",
        link: "/agreement/agreementall",
        icon: "fas fa-th-list",
      },
      {
        name: "Pending Agreement",
        link: "/agreement/agreementpending",
        icon: "fas fa-spinner",
      },
      {
        name: "Approved Agreement",
        link: "/agreement/agreementapproved",
        icon: "fas fa-check",
      },
      {
        name: "Rejected Agreement",
        link: "/agreement/agreementrejected",
        icon: "fas fa-ban",
      },
    ],
  },
  {
    link: "billing_management",
    name: "Billing Management",
    icon: "fas fa-file-invoice-dollar",
    sub_menu: [
      {
        name: "Todo Billing",
        link: "/billing/todo",
        icon: "fas fa-history",
      },
      {
        name: "All Billing",
        link: "/billing/all",
        icon: "fas fa-th-list",
      },
    ],
  },
  {
    link: "collect_point_management",
    name: "Collect Point",
    icon: "fas fa-coins",
    sub_menu: [
      {
        name: "Summary",
        link: "/collect_point/summary",
        icon: "fas fa-list",
      },
      {
        name: "All Transactions",
        link: "/collect_point/transactions",
        icon: "fas fa-check",
      },
      {
        name: "Review Transactions",
        link: "/collect_point/reviewtransaction",
        icon: "fas fa-search-location",
      },
      {
        name: "Confirmed Transactions",
        link: "/collect_point/reviewtransaction/confirm",
        icon: "fas fa-check-double",
      },
      {
        name: "Ineligible Transactions",
        link: "/collect_point/reviewtransaction/not_eligible",
        icon: "fas fa-times",
      },
      {
        name: "BuzzeeBee Report",
        link: "/collect_point/reviewtransaction/buzzeebee_report",
        icon: "fab fa-hubspot",
      },
      {
        name: "Report",
        link: "/collect_point/report",
        icon: "fas fa-server",
      },
    ],
  },
  {
    link: "report",
    name: "Report",
    icon: "fas fa-chart-bar",
    sub_menu: [
      {
        name: "Output Report",
        link: "/report/master",
        icon: "fas fa-server",
      },
      {
        name: "Agreement",
        link: "/report/agreement",
        icon: "fas fa-file-signature",
      },
      {
        name: "Billing",
        link: "/report/billing",
        icon: "fas fa-file-invoice-dollar",
      },
    ],
  },
  {
    link: "master_data",
    name: "Master Data",
    icon: "fas fa-th",
    sub_menu: [
      {
        name: "Agreement Period",
        link: "/master/agreementperiod",
        icon: "fas fa-clock",
      },
      {
        name: "Type of Media",
        link: "/master/typeofmedia",
        icon: "fas fa-photo-video",
      },
      {
        name: "Modern Trade",
        link: "/master/moderntrade",
        icon: "fas fa-exchange-alt",
      },
      {
        name: "Branch",
        link: "/master/branch",
        icon: "fas fa-code-branch",
      },
      {
        name: "User",
        link: "/master/users",
        icon: "fas fa-user",
        authorize: ["Approver"],
      },
      {
        name: "Permission",
        link: "/master/permission",
        icon: "fas fa-lock",
        authorize: ["Approver"],
      },
      {
        name: "Translation",
        link: "/master/translation",
        icon: "fas fa-language",
        authorize: ["Approver"],
      },
      {
        name: "Sub Dealer",
        link: "/master/subdealer",
        icon: "fas fa-users",
      },
      {
        name: "Dealer",
        link: "/master/dealer",
        icon: "fas fa-users",
      },
      {
        name: "Production Group",
        link: "/master/productgroup",
        icon: "fas fa-anchor",
      },
      {
        name: "Product",
        link: "/master/product",
        icon: "fas fa-battery-full",
      },
      {
        name: "Postal - Region",
        link: "/master/postcode",
        icon: "fas fa-map-marker-alt",
      },
    ],
  },
  {
    link: "stockclearance",
    name: "Stock Clearance",
    icon: "fas fa-warehouse",
    sub_menu: [
      {
        name: "Customer List",
        link: "/stockclearance/customer",
        icon: "fas fa-users",
      },
      {
        name: "Product List",
        link: "/stockclearance/product",
        icon: "fas fa-box",
      },
      {
        name: "Product Modern Trade",
        link: "/stockclearance/productmoderntrade",
        icon: "fas fa-store",
      },
      {
        name: "Product View",
        link: "/stockclearance/productview",
        icon: "fas fa-list-alt",
      }
    ],
  },
  {
    link: "linechat",
    name: "Line Chat",
    icon: "fab fa-line",
    sub_menu: [
      {
        name: "Contact",
        link: "/line/contact",
        icon: "fas fa-address-book",
      },
      {
        name: "Coupon",
        link: "/line/coupon",
        icon: "fas fa-ticket-alt",
      },
      {
        name: "OA Config",
        link: "/line/oaconfig",
        icon: "fas fa-cogs",
      },
      {
        name: "Membership",
        link: "/line/membership",
        icon: "fas fa-user-friends",
      },
      {
        name: "Partner",
        link: "/line/partner",
        icon: "fas fa-handshake",
      },
      {
        name: "Transaction",
        link: "/line/transaction",
        icon: "fas fa-exchange-alt",
      },
      {
        name: "Line Account",
        link: "/line/lineaccount",
        icon: "fas fa-user-circle",
      },
    ],
  },
]);


export const menu = () => {
  if (get_schema() === "prd") {
    return menu_prd;
  }
  return menu_qas;
};

export const authorize_menu = (menu_path) => {
  const usergroup = getSession("usergroup");
  
  for (const item of menu()) {
    if (!item.sub_menu) continue;
    
    for (const sub of item.sub_menu) {
      if (sub.link === menu_path) {
        if (typeof sub.authorize === "undefined" || sub.authorize === "undefined" || sub.authorize === undefined) {
          return true;
        }
        if (usergroup && usergroup.some((role) => 
          sub.authorize && sub.authorize.includes(role)
        )) {
          return true;
        }
        return false;
      }
    }
  }
  return false;
};