"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core2 = require("@keystone-6/core");

// schema.ts
var import_core = require("@keystone-6/core");
var import_fields = require("@keystone-6/core/fields");
var import_access = require("@keystone-6/core/access");
var lists = {
  User: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      email: (0, import_fields.text)({
        validation: { isRequired: true },
        isIndexed: "unique"
      }),
      password: (0, import_fields.password)({ validation: { isRequired: true } }),
      createdAt: (0, import_fields.timestamp)({
        defaultValue: { kind: "now" }
      }),
      updates: (0, import_fields.relationship)({ ref: "Update.user", many: true }),
      papers: (0, import_fields.relationship)({ ref: "Paper.reader", many: true })
    }
  }),
  Paper: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      title: (0, import_fields.text)({ validation: { isRequired: true } }),
      authors: (0, import_fields.text)({ validation: { isRequired: true } }),
      journal: (0, import_fields.text)(),
      year: (0, import_fields.integer)({ validation: { isRequired: true } }),
      doi: (0, import_fields.text)(),
      url: (0, import_fields.text)(),
      abstract: (0, import_fields.text)({ ui: { displayMode: "textarea" } }),
      isCurrentlyReading: (0, import_fields.checkbox)({ defaultValue: false }),
      updates: (0, import_fields.relationship)({ ref: "Update.paper", many: true })
    },
    ui: {
      labelField: "title",
      listView: {
        initialColumns: ["title", "authors", "year", "isCurrentlyReading"]
      }
    }
  }),
  Update: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      paper: (0, import_fields.relationship)({ ref: "Paper.updates" }),
      paperTitle: (0, import_fields.text)({ validation: { isRequired: true } }),
      message: (0, import_fields.text)({ validation: { isRequired: true } }),
      timestamp: (0, import_fields.timestamp)({ defaultValue: { kind: "now" } })
    },
    ui: {
      labelField: "message",
      listView: {
        initialColumns: ["paper", "message", "timestamp"]
      }
    }
  })
};

// keystone.ts
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var import_config = require("dotenv/config");
var sessionSecret = process.env.SESSION_SECRET || "complex-secret-for-goodpapers-app";
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  secretField: "password",
  initFirstItem: {
    fields: ["name", "email", "password"],
    skipKeystoneWelcome: true,
    // Use environment variables for initial admin user
    itemData: {
      name: "Admin",
      email: process.env.KEYSTONE_ADMIN_USERNAME || "admin",
      password: process.env.KEYSTONE_ADMIN_PW || "admin"
    }
  }
});
var keystone_default = withAuth(
  (0, import_core2.config)({
    db: {
      provider: "sqlite",
      url: "file:./goodpapers.db"
    },
    lists,
    session: (0, import_session.statelessSessions)({
      secret: sessionSecret,
      maxAge: 60 * 60 * 24 * 30
      // 30 days
    }),
    server: {
      port: 3002,
      // Use a different port to avoid conflicts
      cors: { origin: ["http://localhost:3000"], credentials: true }
    },
    // Additional configuration
    ui: {
      isAccessAllowed: (context) => !!context.session?.data
    }
  })
);
//# sourceMappingURL=config.js.map
