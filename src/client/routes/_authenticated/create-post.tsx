import { useAppForm } from "@client/components/form";
import { api } from "@client/lib/api";
import { createPostSchema } from "@shared/schema/post";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/create-post")({
	component: CreatePost,
});

function CreatePost() {
	const navigate = useNavigate();
	const [titleValue, setTitleValue] = useState("");

	const form = useAppForm({
		defaultValues: {
			title: "",
			content: "",
		},
		validators: {
			onSubmit: createPostSchema,
			onSubmitAsync: async ({ value }) => {
				try {
					const res = await api.posts.$post({ json: value });

					if (!res.ok) {
						return {
							form: "Failed to create post. Please try again.",
						};
					}

					toast.success("Post created successfully!");
					navigate({ to: "/" });
					return null;
				} catch (_error) {
					return {
						form: "An unexpected error occurred while creating the post",
					};
				}
			},
		},
	});

	// AI content generation mutation
	const generateContentMutation = useMutation({
		mutationFn: async (title: string) => {
			const result = await api.ai["generate-content"].$post({
				json: { title },
			});

			if (!result.ok) {
				const errorData = await result.json() as { error?: string; success: boolean };
				throw new Error(errorData.error || "Failed to generate content");
			}

			const data = await result.json();
			return data;
		},
		onSuccess: (data) => {
			if (data.content) {
				form.setFieldValue("content", data.content);
				toast.success("Content generated successfully!");
			}
		},
		onError: (error) => {
			toast.error(error.message || "Failed to generate content");
		},
	});

	// Track title changes
	useEffect(() => {
		const subscription = form.store.subscribe(() => {
			const currentTitle = form.getFieldValue("title");
			setTitleValue(currentTitle || "");
		});
		return subscription;
	}, [form]);

	// Handle AI generation trigger
	const handleGenerateContent = () => {
		const title = titleValue.trim();
		if (!title) {
			toast.error("Please enter a title first");
			return;
		}
		if (title.length < 5) {
			toast.error("Title must be at least 5 characters long");
			return;
		}
		generateContentMutation.mutate(title);
	};

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
				<form.AppField name="content">
					{(field) => (
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<label htmlFor={field.name} className="text-sm font-medium">
									Content
								</label>
								<button
									type="button"
									onClick={handleGenerateContent}
									disabled={
										generateContentMutation.isPending || titleValue.trim().length < 5
									}
									className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
								>
									{generateContentMutation.isPending ? (
										<>
											<div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
											Generating...
										</>
									) : (
										"Generate with AI"
									)}
								</button>
							</div>
							<field.TextAreaField label="" rows={6} />
						</div>
					)}
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
