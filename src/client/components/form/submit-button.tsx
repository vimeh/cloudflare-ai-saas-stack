import { Button } from "@client/components/ui/button";
import { useFormContext } from "./index";

export function SubmitButton() {
	const form = useFormContext();
	return (
		<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
			{([canSubmit, isSubmitting]) => (
				<Button className="mt-4" type="submit" disabled={!canSubmit}>
					{isSubmitting ? "..." : "Submit"}
				</Button>
			)}
		</form.Subscribe>
	);
}
