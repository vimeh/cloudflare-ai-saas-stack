import { useAppForm } from "@client/components/form";
import { api } from "@client/lib/api";
import { createPostSchema } from "@shared/schema/post";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/create-post")({
	component: CreatePost,
});

function CreatePost() {
	const navigate = useNavigate();
	const form = useAppForm({
		defaultValues: {
			title: "",
		},
		validators: {
			onSubmit: createPostSchema,
			onSubmitAsync: async ({ value }) => {
				try {
					const res = await api.posts.$post({ json: value });

					// Check if the result indicates an error
					if (!res.ok) {
						return {
							form: "Failed to create post. Please try again.",
						};
					}

					navigate({ to: "/" });
					return null; // No errors
				} catch (_error) {
					// Fallback error handling for any unexpected errors
					return {
						form: "An unexpected error occurred while creating the post",
					};
				}
			},
		},
	});

	return (
		<div className="p-2">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="max-w-xl m-auto items-center gap-1.5 grid"
			>
				<form.AppField name="title">
					{(field) => <field.TextInput label="Title" />}
				</form.AppField>
				<form.Subscribe selector={(state) => [state.errorMap]}>
					{([errorMap]) => {
						const formError = errorMap.onSubmit?.form;
						return formError && typeof formError === "string" ? (
							<div className="text-red-600 text-sm mt-2">
								<em>Error: {formError}</em>
							</div>
						) : null;
					}}
				</form.Subscribe>
				<form.AppForm>
					<form.SubmitButton loadingText="Creating post...">
						Create Post
					</form.SubmitButton>
				</form.AppForm>
			</form>
		</div>
	);
}
