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
			cookieDomain: env.BETTER_AUTH_URL,
			useSecureCookies: process.env.NODE_ENV === "production",
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
