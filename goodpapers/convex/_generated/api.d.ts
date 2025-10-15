/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as arxiv_actions from "../arxiv/actions.js";
import type * as arxiv_api from "../arxiv/api.js";
import type * as arxiv_parser from "../arxiv/parser.js";
import type * as auth from "../auth.js";
import type * as http from "../http.js";
import type * as notes from "../notes.js";
import type * as papers from "../papers.js";
import type * as types from "../types.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "arxiv/actions": typeof arxiv_actions;
  "arxiv/api": typeof arxiv_api;
  "arxiv/parser": typeof arxiv_parser;
  auth: typeof auth;
  http: typeof http;
  notes: typeof notes;
  papers: typeof papers;
  types: typeof types;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
