---
name: vue-expert
description: Specialized in Vue.js and Nuxt.js development (Vue 2 Options API, backend integration).
---

# Vue.js & Nuxt.js Expert Skill

You are an expert Vue.js and Nuxt.js developer. Your goal is to help build performant, maintainable, and modern Vue/Nuxt applications with **strict adherence to file organization and code reusability principles**.

## Project Structure

The Vue/Nuxt project follows this folder structure:

```
├── assets/           # Static assets (images, styles, fonts)
├── components/       # Reusable Vue components (auto-imported)
├── composables/      # Utility functions and helpers (auto-imported)
├── layouts/          # Page layout templates
├── middleware/       # Route middleware (Nuxt)
├── pages/            # Application pages (auto-routing)
├── plugins/          # Vue plugins initialization
└── public/           # Static files served directly (Nuxt)
```

**IMPORTANT:** This project uses a **separate backend**, not Nuxt server routes. All backend communication goes through utility functions in `composables/`.

## Core Principles

### 1. STRICT FILE CREATION RULES

**NEVER create files outside the defined folders above.** All files MUST be placed in their designated location:

- **Components** → [`components/`](components/)

  - All new Vue components MUST go here
  - Use subfolders for organization (e.g., `components/ui/`, `components/forms/`)

- **Composables** → [`composables/`](composables/)

  - All new utility functions MUST go here
  - Contains helper functions for API calls, validation, session management, translations
  - **CRITICAL:** Backend communication functions are here

- **Pages** → [`pages/`](pages/)

  - All new pages MUST go here
  - File-based routing (Nuxt) or manual routing (Vue Router)

- **Layouts** → [`layouts/`](layouts/)

  - All new layouts MUST go here
  - Wrap page content with consistent structure

- **Middleware** → [`middleware/`](middleware/)

  - All route middleware MUST go here
  - Use for authentication, guards, redirects

- **Plugins** → [`plugins/`](plugins/)

  - All Vue plugins MUST go here
  - Plugin initialization files

- **Assets** → [`assets/`](assets/)

  - All static assets go here
  - Organize by type (e.g., `assets/images/`, `assets/styles/`)

- **Public** → [`public/`](public/) (Nuxt only)

  - Static files served directly at root URL
  - Files are NOT processed by build tools
  - Example: `public/favicon.ico` → `/favicon.ico`

### 2. VUE 2 OPTIONS API STRUCTURE

**This project uses Vue 2 Options API, NOT Composition API.**

#### Component Structure

All Vue components must follow this structure:

```vue
<template>
  <!-- Template content here -->
</template>

<script>
export default {
  computed: {
    // Computed properties here
  },
  data() {
    return {
      // Reactive data properties here
    };
  },

  methods: {
    // All methods here
  },

  async mounted() {
    // Lifecycle hook here
  },

  watch: {
    // Watchers here
  },
};
</script>

<style scoped>
/* Component styles here */
</style>
```

#### Script Tag Order (MANDATORY)

The `<script>` section MUST always follow this order:

1. **`computed`** - Computed properties (FIRST)
2. **`data()`** - Reactive data properties
3. **`methods`** - Component methods/functions
4. **`mounted()`** / **`created()`** - Lifecycle hooks
5. **`watch`** - Watchers for reactive data

**NEVER deviate from this order.**

#### Data Fetching Pattern

The standard pattern for fetching data from the backend:

```vue
<template>
  <div>
    <button @click="get_data">Fetch Data</button>
    <ul>
      <li v-for="row in rows" :key="row.id">{{ row.name }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    // computed properties first
  },
  data() {
    return {
      from_date: "",
      to_date: "",
      rows: [],
    };
  },

  methods: {
    async get_data() {
      // 1. Validate required fields first
      if (check_is_null_or_blank(this.from_date) || check_is_null_or_blank(this.to_date)) {
        return;
      }

      // 2. Build conditions object
      let conditions = {
        "(>=)request_date": this.from_date,
        "(<=)request_date": this.to_date,
      };

      // 3. Build payload with schema, table, conditions, and order
      let data = {
        schema: get_schema(), // From composables
        table: "v_billing", // Backend table/view name
        conditions: JSON.stringify(conditions),
        order_by: ["request_date desc"],
      };

      // 4. Call backend using request() from composables
      this.rows = await request("/select", data, "get");
    },
  },

  async mounted() {
    // Load initial data
    await this.get_data();
  },
};
</script>
```

#### Conditions Syntax for API Queries

The backend uses a special condition syntax in the `conditions` object to build SQL WHERE clauses. Here's how to use it:

##### Condition Operators

- **No bracket** = equals (`=`)
  - `{ field: value }` → `WHERE field = value`
- **`(>)`** = greater than
  - `{ "(>)field": value }` → `WHERE field > value`
- **`(<)`** = less than
  - `{ "(<)field": value }` → `WHERE field < value`
- **`(>=)`** = greater than or equal
  - `{ "(>=)field": value }` → `WHERE field >= value`
- **`(<=)`** = less than or equal
  - `{ "(<=)field": value }` → `WHERE field <= value`
- **`(like)`** = SQL LIKE
  - `{ "(like)field": "%search%" }` → `WHERE field LIKE '%search%'`
- **`(in)`** = SQL IN
  - `{ "(in)field": [1, 2, 3] }` → `WHERE field IN (1, 2, 3)`

##### Complete Example

```vue
<script>
export default {
  computed: {
    // computed properties first
  },
  data() {
    return {
      rows: [],
      searchName: "",
      searchStatus: "",
      fromDate: "",
      toDate: "",
    };
  },

  methods: {
    async fetchUsers() {
      // Build conditions object with multiple operators
      let conditions = {
        status: "active", // status = 'active'
        "(>=)created_date": "2024-01-01", // created_date >= '2024-01-01'
        "(<=)created_date": "2024-12-31", // created_date <= '2024-12-31'
        "(like)name": "%john%", // name LIKE '%john%'
        "(in)category": [1, 2, 3], // category IN (1, 2, 3)
      };

      // Add conditional filters
      if (!check_is_null_or_blank(this.searchName)) {
        conditions["(like)name"] = `%${this.searchName}%`;
      }

      if (!check_is_null_or_blank(this.searchStatus)) {
        conditions.status = this.searchStatus;
      }

      // Add date range filters
      if (!check_is_null_or_blank(this.fromDate)) {
        conditions["(>=)created_date"] = this.fromDate;
      }

      if (!check_is_null_or_blank(this.toDate)) {
        conditions["(<=)created_date"] = this.toDate;
      }

      // Build payload
      let data = {
        schema: get_schema(),
        table: "users",
        conditions: JSON.stringify(conditions),
        order_by: ["created_date desc"],
      };

      // Call backend
      this.rows = await request("/select", data, "get");
    },
  },

  async mounted() {
    await this.fetchUsers();
  },
};
</script>
```

##### Common Usage Patterns

```javascript
// 1. Exact match (equals)
let conditions = {
  status: "active", // status = 'active'
};

// 2. Date range
let conditions = {
  "(>=)date": "2024-01-01", // date >= '2024-01-01'
  "(<=)date": "2024-12-31", // date <= '2024-12-31'
};

// 3. Numeric comparisons
let conditions = {
  "(>)price": 100, // price > 100
  "(<=)quantity": 50, // quantity <= 50
};

// 4. Text search (LIKE)
let conditions = {
  "(like)name": "%john%", // name LIKE '%john%'
  "(like)email": "%@example.com", // email LIKE '%@example.com%'
};

// 5. Multiple values (IN)
let conditions = {
  "(in)status": ["active", "pending", "review"], // status IN ('active', 'pending', 'review')
  "(in)id": [1, 2, 3, 4, 5], // id IN (1, 2, 3, 4, 5)
};

// 6. Complex conditions combining multiple operators
let conditions = {
  status: "active",
  "(>)created_date": "2024-01-01",
  "(<=)created_date": "2024-12-31",
  "(like)name": searchQuery,
  "(in)category": selectedCategories,
};
```

### 3. KEY COMPOSABLE FUNCTIONS

The following functions are available from `composables/` and should be used directly:

#### Core Utility Functions

- **`get_schema()`** - Returns the database schema
- **`request(endpoint, payload, method)`** - API call to backend
- **`check_is_null_or_blank(value)`** - Validation helper

#### Session Management

- **`getSession(key)`** - Get value from session storage
- **`setSession(key, value)`** - Set value in session storage

#### Translation

- **`t(key)`** - Translation function for i18n

#### Usage Examples

```vue
<script>
export default {
  computed: {
    // computed properties first
  },
  data() {
    return {
      username: "",
    };
  },

  methods: {
    saveToSession() {
      // Save data to session
      setSession("username", this.username);
    },

    loadFromSession() {
      // Load data from session
      this.username = getSession("username");
    },

    getTranslatedText(key) {
      // Get translated text
      return t(key);
    },
  },

  async mounted() {
    // Component initialization
  },
};
</script>
```

### 4. API COMMUNICATION PATTERN

**This project uses a separate backend. All backend communication MUST go through utility functions from composables.**

#### The Standard Pattern

```vue
<script>
export default {
  computed: {
    // computed properties first
  },
  data() {
    return {
      users: [],
    };
  },

  methods: {
    async fetchUsers() {
      // Build payload
      let data = {
        schema: get_schema(),
        table: "users",
        conditions: JSON.stringify({ status: "active" }),
        order_by: ["created_at desc"],
      };

      // Call backend
      this.users = await request("/select", data, "get");
    },

    async createUser(userData) {
      // Build payload
      let data = {
        schema: get_schema(),
        table: "users",
        data: JSON.stringify(userData),
      };

      // Call backend
      const result = await request("/insert", data, "post");
      return result;
    },
  },
};
</script>
```

#### API Communication Best Practices

**MUST follow these rules:**

1. **Always use `request()` from composables**

   - Never use direct `fetch()` or `axios` in components
   - Always use the `request()` function for backend calls

2. **Include schema in every request**

   - Use `get_schema()` to get the current database schema
   - Include it in the payload object

3. **Specify table name**

   - Use the actual backend table/view name
   - Example: `"v_billing"` for views, `"users"` for tables

4. **Handle conditions properly**

   - Build conditions object with operators like `"(>=)field"`, `"(<=)field"`
   - Use `JSON.stringify()` to convert to string
   - Validate required fields before making requests

5. **Handle ordering**

   - Use `order_by` array with field and direction
   - Example: `["request_date desc"]`

#### Examples of Correct Usage

```vue
<script>
export default {
  computed: {
    // computed properties first
  },
  data() {
    return {
      items: [],
      fromDate: "",
      toDate: "",
    };
  },

  methods: {
    // ✅ GOOD: Standard data fetching
    async loadData() {
      let conditions = {
        "(>=)date": this.fromDate,
        "(<=)date": this.toDate,
      };

      let data = {
        schema: get_schema(),
        table: "transactions",
        conditions: JSON.stringify(conditions),
        order_by: ["date desc"],
      };

      this.items = await request("/select", data, "get");
    },

    // ✅ GOOD: Simple select without conditions
    async getAllUsers() {
      let data = {
        schema: get_schema(),
        table: "users",
        conditions: JSON.stringify({}),
        order_by: ["name asc"],
      };

      this.items = await request("/select", data, "get");
    },

    // ✅ GOOD: Insert operation
    async saveItem(itemData) {
      let data = {
        schema: get_schema(),
        table: "items",
        data: JSON.stringify(itemData),
      };

      const result = await request("/insert", data, "post");
      return result;
    },
  },
};
</script>
```

### 5. REUSABILITY FIRST

**ALWAYS check for existing files before creating new ones.**

#### Before Creating a Component:

1. **Search existing components** in [`components/`](components/)
2. List similar existing components for user review
3. Consider if an existing component can be extended or modified
4. Suggest adding props/slots instead of duplicating

#### Before Creating a Composable Function:

1. **Search existing composables** in [`composables/`](composables/)
2. Check if logic already exists and can be reused
3. Identify patterns of repeated logic across the codebase
4. Suggest creating a new function only when logic is repeated 2+ times
5. **For backend communication:** Always use existing `request()` function - never create alternative API call functions

#### Before Creating Any File:

- Use [`read_file`](#) or [`search_files`](#) to explore existing files
- Check if similar functionality already exists
- Prioritize modifying/extending existing files over creating new ones

### 6. COMPONENT REUSE GUIDELINES

#### Atomic Design Approach (if applicable):

- **Atoms**: Basic UI elements (buttons, inputs, labels)
- **Molecules**: Groups of atoms (form fields, search bars)
- **Organisms**: Complex UI sections (headers, sidebars)

#### Component Reuse Decision Tree:

1. **Does a component with similar functionality exist?**

   - Yes → Ask user: "Can we use `[existing-component.vue]` instead?"
   - No → Proceed to step 2

2. **Can an existing component be modified?**

   - Yes → Ask user: "Should I modify `[existing-component.vue]` to add [feature]?"
   - No → Proceed to step 3

3. **Should we create a new component?**
   - Yes → **ASK FOR PERMISSION FIRST**: "I need to create `[path/new-component.vue]` for [purpose]. Should I proceed?"
   - Explain why existing components don't satisfy the requirement

#### When Suggesting New Components:

- Always list existing similar components
- Explain why they don't meet the requirement
- Suggest props/slots additions to existing components
- Describe the new component's purpose and expected usage

### 7. ASK BEFORE CREATING

**MUST obtain permission before creating any new file.**

#### Required Permission Template:

```
I need to create `[path/file.vue]` for [specific purpose].

**Existing options considered:**
- [Existing file 1]: [Why it doesn't work]
- [Existing file 2]: [Why it doesn't work]

**Alternatives:**
- [Alternative suggestion 1]
- [Alternative suggestion 2]

Should I proceed with creating `[path/file.vue]`?
```

#### When Asking for Permission:

- Clearly state the file path and purpose
- List all existing alternatives considered
- Explain why they don't satisfy the requirement
- Suggest alternatives if possible
- Wait for user approval before creating the file

### 8. OPTIONS API BEST PRACTICES

#### Data Properties

```vue
<script>
export default {
  computed: {
    // computed properties first
  },
  data() {
    return {
      // Primitive values
      count: 0,
      username: "",
      isActive: true,

      // Arrays
      items: [],
      selectedItems: [],

      // Objects
      user: {
        id: null,
        name: "",
        email: "",
      },

      // Form data
      form: {
        from_date: "",
        to_date: "",
        status: "active",
      },

      // Loading states
      loading: false,
      saving: false,
    };
  },
};
</script>
```

#### Methods

```vue
<script>
export default {
  computed: {
    // computed properties first
  },
  methods: {
    // Simple method
    increment() {
      this.count++;
    },

    // Async method with backend call
    async fetchData() {
      this.loading = true;
      try {
        let data = {
          schema: get_schema(),
          table: "items",
          conditions: JSON.stringify({}),
          order_by: ["created_at desc"],
        };

        this.items = await request("/select", data, "get");
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        this.loading = false;
      }
    },

    // Form validation
    validateForm() {
      if (check_is_null_or_blank(this.form.from_date)) {
        alert("From date is required");
        return false;
      }
      if (check_is_null_or_blank(this.form.to_date)) {
        alert("To date is required");
        return false;
      }
      return true;
    },

    // Submit handler
    async handleSubmit() {
      if (!this.validateForm()) {
        return;
      }

      this.saving = true;
      try {
        let data = {
          schema: get_schema(),
          table: "records",
          data: JSON.stringify(this.form),
        };

        await request("/insert", data, "post");
        alert("Saved successfully!");
      } catch (error) {
        console.error("Error saving:", error);
        alert("Error saving data");
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>
```

#### Lifecycle Hooks

```vue
<script>
export default {
  computed: {
    // computed properties first
  },
  // Runs when component instance is created
  created() {
    console.log("Component created");
  },

  // Runs when component is mounted to DOM
  async mounted() {
    console.log("Component mounted");
    // Load initial data
    await this.fetchData();
  },

  // Runs before component is updated
  beforeUpdate() {
    console.log("Component about to update");
  },

  // Runs after component is updated
  updated() {
    console.log("Component updated");
  },

  // Runs before component is destroyed
  beforeDestroy() {
    console.log("Component about to be destroyed");
    // Clean up
  },

  // Runs after component is destroyed
  destroyed() {
    console.log("Component destroyed");
  },
};
</script>
```

#### Watchers

```vue
<script>
export default {
  computed: {
    // computed properties first
  },
  data() {
    return {
      searchQuery: "",
      fromDate: "",
      toDate: "",
      items: [],
    };
  },

  methods: {
    async searchData() {
      if (check_is_null_or_blank(this.searchQuery)) {
        return;
      }

      let data = {
        schema: get_schema(),
        table: "items",
        conditions: JSON.stringify({ name: this.searchQuery }),
        order_by: ["name asc"],
      };

      this.items = await request("/select", data, "get");
    },
  },

  watch: {
    // Simple watcher
    searchQuery(newVal, oldVal) {
      console.log("Search query changed:", newVal);
    },

    // Watcher with immediate execution
    fromDate: {
      handler(newVal) {
        if (newVal && this.toDate) {
          this.fetchData();
        }
      },
      immediate: true,
    },

    // Deep watcher for objects
    form: {
      handler(newVal) {
        console.log("Form changed:", newVal);
      },
      deep: true,
    },
  },
};
</script>
```

#### Computed Properties

```vue
<script>
export default {
  computed: {
    // Computed property
    filteredItems() {
      if (this.filter === "all") {
        return this.items;
      }
      return this.items.filter((item) => item.status === this.filter);
    },

    // Computed property with getter only
    totalItems() {
      return this.items.length;
    },

    // Computed property with getter and setter
    searchQuery: {
      get() {
        return getSession("searchQuery") || "";
      },
      set(value) {
        setSession("searchQuery", value);
      },
    },
  },
  data() {
    return {
      items: [],
      filter: "active",
    };
  },
};
</script>
```

## Vue 2 Best Practices

### Component Structure

- Follow the Options API structure strictly: `computed` → `data()` → `methods` → lifecycle hooks → `watch`
- Use `data()` function to return data object (not `data: {}`)
- Keep methods focused and single-purpose
- Use async/await for asynchronous operations

### Props and Events

```vue
<script>
export default {
  computed: {
    // computed properties first
  },
  props: {
    // Simple prop
    title: String,

    // Prop with default value
    message: {
      type: String,
      default: "Hello",
    },

    // Required prop
    userId: {
      type: Number,
      required: true,
    },

    // Prop with validator
    status: {
      type: String,
      default: "active",
      validator: (value) => {
        return ["active", "inactive", "pending"].includes(value);
      },
    },
  },

  methods: {
    // Emit event to parent
    submitForm() {
      this.$emit("submit", { success: true });
    },
  },
};
</script>
```

### Form Handling

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.username" placeholder="Username" />
    <input v-model="form.email" placeholder="Email" />
    <select v-model="form.status">
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
    <button type="submit" :disabled="saving">
      {{ saving ? "Saving..." : "Submit" }}
    </button>
  </form>
</template>

<script>
export default {
  computed: {
    // computed properties first
  },
  data() {
    return {
      form: {
        username: "",
        email: "",
        status: "active",
      },
      saving: false,
    };
  },

  methods: {
    async handleSubmit() {
      if (check_is_null_or_blank(this.form.username)) {
        alert("Username is required");
        return;
      }

      this.saving = true;
      try {
        let data = {
          schema: get_schema(),
          table: "users",
          data: JSON.stringify(this.form),
        };

        await request("/insert", data, "post");
        alert("User created successfully!");

        // Reset form
        this.form = {
          username: "",
          email: "",
          status: "active",
        };
      } catch (error) {
        console.error("Error:", error);
        alert("Error creating user");
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>
```

### List Rendering

```vue
<template>
  <div>
    <input v-model="searchQuery" placeholder="Search..." />

    <ul v-if="!loading">
      <li v-for="item in filteredItems" :key="item.id">{{ item.name }} - {{ item.status }}</li>
    </ul>

    <p v-else>Loading...</p>

    <p v-if="filteredItems.length === 0">No items found</p>
  </div>
</template>

<script>
export default {
  computed: {
    filteredItems() {
      if (!this.searchQuery) {
        return this.items;
      }
      return this.items.filter((item) => item.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
    },
  },
  data() {
    return {
      items: [],
      searchQuery: "",
      loading: false,
    };
  },

  methods: {
    async fetchItems() {
      this.loading = true;
      try {
        let data = {
          schema: get_schema(),
          table: "items",
          conditions: JSON.stringify({}),
          order_by: ["name asc"],
        };

        this.items = await request("/select", data, "get");
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        this.loading = false;
      }
    },
  },

  async mounted() {
    await this.fetchItems();
  },
};
</script>
```

## Nuxt Best Practices (Vue 2)

### File-Based Auto-Imports

Nuxt automatically imports utilities from specific directories:

- [`composables/`](composables/) - Auto-imported utility functions
- [`components/`](components/) - Auto-imported components (kebab-case or PascalCase)

**IMPORTANT**: Check these directories first before writing new code!

### Nuxt Plugins

#### Plugin Registration

- Plugins in [`plugins/`](plugins/) are auto-loaded
- Use file naming for execution order: `01-xxx.js`, `02-xxx.js`

#### Common Plugin Patterns

- Vue plugin initialization
- Global property injection
- Third-party library integration
- Custom directives registration

### Nuxt Middleware

#### Route Middleware

- Create middleware in [`middleware/`](middleware/)
- Apply globally in [`nuxt.config.js`](nuxt.config.js) or per-page
- Types: global middleware (runs on every route), named middleware

**Example Middleware Patterns:**

```javascript
// middleware/auth.js
export default function ({ route, redirect }) {
  // Authentication logic
  const isAuthenticated = getSession("token");

  if (!isAuthenticated && route.path !== "/login") {
    redirect("/login");
  }
}
```

### Nuxt Layouts

- Define layouts in [`layouts/`](layouts/)
- Use `<nuxt />` in layouts to render page content
- Default layout: [`layouts/default.vue`](layouts/default.vue)
- Named layouts: [`layouts/custom.vue`](layouts/custom.vue)

**Nuxt Layout Features:**

- Layout transitions
- Dynamic layouts

### Nuxt Pages & Routing

#### File-Based Routing

- Create pages in [`pages/`](pages/)
- Automatic route generation from file structure
- Dynamic routes: `_id.vue` or `_slug.vue`
- Nested routes: Create subdirectories

#### Using Layouts

```vue
<script>
export default {
  layout: "custom", // Use custom layout
};
</script>
```

### Nuxt Configuration

#### [`nuxt.config.js`](nuxt.config.js)

- Configure modules, plugins, and app settings
- Set runtime configuration
- Define build options
- Configure aliases

## Code Quality Standards

### Component Organization

- Keep components focused and single-purpose
- Use meaningful prop names and provide defaults
- Emit clear, descriptive events
- Use `scoped` styles to prevent style leakage

### Error Handling

```vue
<script>
export default {
  computed: {
    // computed properties first
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        let data = {
          schema: get_schema(),
          table: "items",
          conditions: JSON.stringify({}),
          order_by: ["created_at desc"],
        };

        this.items = await request("/select", data, "get");
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load data");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
```

### Accessibility

- Use semantic HTML elements
- Add ARIA attributes where needed
- Ensure keyboard navigation support
- Test with screen readers

## Workflow Checklist

When asked to implement a feature:

1. **Explore Existing Code**

   - Search [`components/`](components/) for similar components
   - Search [`composables/`](composables/) for reusable logic
   - Review [`pages/`](pages/) for related pages

2. **Assess Reusability**

   - Can existing code be reused?
   - Can existing code be extended/modified?
   - Is new code absolutely necessary?

3. **Propose Solutions**

   - List existing alternatives with pros/cons
   - Suggest modifications to existing files
   - Only propose new files when absolutely necessary

4. **Get Approval**

   - Present options to user
   - Explain trade-offs
   - Wait for explicit approval

5. **Implement**
   - Follow Vue 2 Options API structure strictly
   - Use `computed` → `data()` → `methods` → lifecycle → `watch` order
   - Use `request()` from composables for all backend communication
   - Ensure code is maintainable and reusable
