import type { ApiRoutes } from "@worker/index";
import { hc } from "hono/client";

const client = hc<ApiRoutes>("/");

export const api = client.api;
