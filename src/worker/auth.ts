import { db } from "@worker/db";
import { account, session, user, verification } from "@worker/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = (env: Env) => {
	return betterAuth({
		database: drizzleAdapter(db(env), {
			provider: "sqlite",
			schema: {
				account,
				session,
				user,
				verification,
			},
		}),
		baseUrl: env.BETTER_AUTH_URL,
		trustedOrigins: [env.BETTER_AUTH_URL],
		advanced: {
			cookieDomain: new URL(env.BETTER_AUTH_URL).hostname,
			useSecureCookies: env.ENVIRONMENT === "production", // Ensure ENVIRONMENT is set in your Cloudflare worker env
			sameSite: "lax",
		},
		emailAndPassword: {
			enabled: false,
		},
		socialProviders: {
			google: {
				clientId: env.GOOGLE_CLIENT_ID,
				clientSecret: env.GOOGLE_CLIENT_SECRET,
			},
		},
	});
};
