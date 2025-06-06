/// <reference path="../../../worker-configuration.d.ts" />
import type { auth } from "@worker/auth";

type AuthInstance = ReturnType<typeof auth>;

export type HonoContext = {
	Bindings: Env;
	Variables: {
		user: AuthInstance["$Infer"]["Session"]["user"] | null;
		session: AuthInstance["$Infer"]["Session"]["session"] | null;
	};
};
