import { useAppForm } from "@client/components/form";
import { Button } from "@client/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@client/components/ui/card";
import { signIn } from "@client/lib/auth-client";
import { cn } from "@client/lib/utils";
import { loginSchema } from "@shared/schema/auth";
import { Link, useSearch } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const navigate = useNavigate();
	const search = useSearch({ from: "/login" });

	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onSubmit: loginSchema,
			onSubmitAsync: async ({ value }) => {
				try {
					const result = await signIn.email(value);

					if (result?.error) {
						return {
							form: result.error.message || "Login failed",
						};
					}

					// Success! Handle the redirect here

					if (search.redirect) {
						window.location.href = search.redirect;
					} else {
						navigate({ to: "/" });
					}

					return undefined; // No errors
				} catch (_error) {
					// Fallback error handling for any unexpected errors
					return {
						form: "An unexpected error occurred during login",
					};
				}
			},
		},
	});

	const handleGoogleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		await signIn.social({
			provider: "google",
			callbackURL: search.redirect,
		});
	};

	return (
		<div
			className={cn("flex flex-col items-center gap-6", className)}
			{...props}
		>
			<Card className="w-full">
				<CardHeader className="text-center space-y-1 p-6">
					<CardTitle className="text-2xl font-semibold tracking-tight">
						Welcome Back
					</CardTitle>
					<CardDescription className="text-sm text-muted-foreground">
						Sign in with your Google account to continue.
					</CardDescription>
				</CardHeader>
				<CardContent className="p-6 pt-0">
					<div className="space-y-6">
						<Button
							variant="outline"
							className="w-full h-11 text-base"
							onClick={handleGoogleLogin}
						>
							<svg
								className="mr-2 h-5 w-5"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								aria-hidden="true"
							>
								<title>Google logo</title>
								<path
									d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
									fill="currentColor"
								/>
							</svg>
							Sign in with Google
						</Button>

						<div className="text-center text-xs text-muted-foreground px-4">
							<p>
								Email/password login is currently disabled for this demo due to
								Cloudflare Workers free plan resource limits.
							</p>
						</div>

						{/* Hidden email/password form */}
						<div className="hidden">
							<div className="relative my-4">
								<div className="absolute inset-0 flex items-center">
									<span className="w-full border-t" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-background px-2 text-muted-foreground">
										Or continue with
									</span>
								</div>
							</div>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									e.stopPropagation();
									form.handleSubmit();
								}}
								className="space-y-4"
							>
								<form.AppField name="email">
									{(field) => (
										<field.TextInput
											label="Email"
											type="email"
											placeholder="name@example.com"
										/>
									)}
								</form.AppField>
								<form.AppField name="password">
									{(field) => (
										<field.TextInput label="Password" type="password" />
									)}
								</form.AppField>
								<form.AppForm>
									<form.Subscribe selector={(state) => state.errorMap.onSubmit}>
										{(formError) =>
											formError &&
											typeof formError === "object" &&
											"form" in formError &&
											typeof formError.form === "string" ? (
												<p className="text-sm text-destructive text-center">
													{formError.form}
												</p>
											) : null
										}
									</form.Subscribe>
									<form.SubmitButton
										className="w-full h-10"
										loadingText="Signing in..."
									>
										Sign In with Email
									</form.SubmitButton>
								</form.AppForm>
							</form>
						</div>
						<p className="text-center text-sm text-muted-foreground">
							Don&apos;t have an account?{" "}
							<Link
								to="/register"
								className="font-medium text-primary hover:underline underline-offset-4"
							>
								Sign up
							</Link>
						</p>
					</div>
				</CardContent>
			</Card>
			<p className="px-8 text-center text-sm text-muted-foreground">
				By clicking continue, you agree to our{" "}
				<a
					href="/terms"
					className="underline underline-offset-4 hover:text-primary"
				>
					Terms of Service
				</a>{" "}
				and{" "}
				<a
					href="/privacy"
					className="underline underline-offset-4 hover:text-primary"
				>
					Privacy Policy
				</a>
				.
			</p>
		</div>
	);
}
