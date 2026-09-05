# DuraOne Portal — example project

This folder holds the **DuraOne Portal-specific** files that were
previously bundled inside `skills/unic-vue/composables/`.

These files are **illustrative only**. They reference the DuraOne
portal's production URLs, table/view names, menu structure, and
business rules. They are kept here so:

- the original behavior is recoverable if anyone needs to inspect it,
- a new project can be started by copying these as a starting point.

## What's inside

```
composables/
├── state.duraone.js       # reactive state with DuraOne menus + baseurl() pointing at duraoneportal.com
├── masterApi.duraone.js   # ~20 API helpers for DuraOne views (v_agreement, v_usergroup, ...)
└── userObj.duraone.js     # user lookup against the `nhanvien` table
```

## To use in a DuraOne project

```bash
# from your DuraOne project root
cp examples/duraone-portal/composables/state.duraone.js      composables/state.js
cp examples/duraone-portal/composables/masterApi.duraone.js  composables/masterApi.js
cp examples/duraone-portal/composables/userObj.duraone.js    composables/userObj.js
```

Then adjust the schema detection in `state.duraone.js` if your
deployment hostnames differ from `qas.duraoneportal.com` /
`duraoneportal.com`.

## Why these were moved out of `unic-vue`

`unic-vue` is intended to be a **project-agnostic** Nuxt 3 + Vue 2
Options API skill. Hard-coding DuraOne URLs, menus, and table names
inside it made the skill misleading to anyone not working on the
DuraOne portal. Keeping the generic stubs in `unic-vue/composables/`
and the DuraOne-specific code here lets each consumer pick what they
need.
