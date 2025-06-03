import { useAppForm } from "@client/components/form";
import { api } from "@client/lib/api";
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
		onSubmit: async ({ value }) => {
			const res = await api.posts.$post({ json: value });
			if (!res.ok) {
				throw new Error("server error");
			}
			navigate({ to: "/" });
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
				<form.AppForm>
					<form.SubmitButton />
				</form.AppForm>
			</form>
		</div>
	);
}
