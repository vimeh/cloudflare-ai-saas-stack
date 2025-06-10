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
import { useQueryClient } from "@tanstack/react-query";
import { Link, useSearch } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
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

					// Success! Handle the redirect hereAdd commentMore actions
					queryClient.invalidateQueries({ queryKey: ["session"] });

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
		});
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader className="text-center">
					<CardTitle className="text-xl">Welcome back</CardTitle>
					<CardDescription>
						Login with your Email or Google account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-6">
						<div className="flex flex-col gap-4">
							<Button
								variant="outline"
								className="w-full"
								onClick={handleGoogleLogin}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									aria-label="Google logo"
								>
									<title>Google logo</title>
									<path
										d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
										fill="currentColor"
									/>
								</svg>
								Login with Google
							</Button>
						</div>
						<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
							<span className="bg-card text-muted-foreground relative z-10 px-2">
								Or continue with
							</span>
						</div>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								e.stopPropagation();
								form.handleSubmit();
							}}
							className="grid gap-6"
						>
							<div className="grid gap-3">
								<form.AppField name="email">
									{(field) => (
										<field.TextInput
											label="Email"
											type="email"
											placeholder="m@example.com"
										/>
									)}
								</form.AppField>
							</div>
							<div className="grid gap-3">
								<form.AppField name="password">
									{(field) => (
										<field.TextInput label="Password" type="password" />
									)}
								</form.AppField>
							</div>
							<form.AppForm>
								<form.Subscribe selector={(state) => state.errorMap.onSubmit}>
									{(formError) =>
										formError &&
										typeof formError === "object" &&
										"form" in formError &&
										typeof formError.form === "string" ? (
											<div className="text-sm text-red-500 text-center mb-3">
												{formError.form}
											</div>
										) : null
									}
								</form.Subscribe>
								<form.SubmitButton
									className="w-full"
									loadingText="Logging in..."
								>
									Login
								</form.SubmitButton>
							</form.AppForm>
						</form>
						<div className="text-center text-sm">
							Don&apos;t have an account?{" "}
							<Link to="/register" className="underline underline-offset-4">
								Sign up
							</Link>
						</div>
					</div>
				</CardContent>
			</Card>
			<div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
				By clicking continue, you agree to our{" "}
				<a href="/terms">Terms of Service</a> and{" "}
				<a href="/privacy">Privacy Policy</a>.
			</div>
		</div>
	);
}
