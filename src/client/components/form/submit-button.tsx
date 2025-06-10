import { Button } from "@client/components/ui/button";
import { useFormContext } from "./index";

interface SubmitButtonProps {
	children?: React.ReactNode;
	className?: string;
	loadingText?: string;
}

export function SubmitButton({
	children = "Submit",
	className = "mt-4",
	loadingText = "...",
}: SubmitButtonProps) {
	const form = useFormContext();
	return (
		<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
			{([canSubmit, isSubmitting]) => (
				<Button className={className} type="submit" disabled={!canSubmit}>
					{isSubmitting ? loadingText : children}
				</Button>
			)}
		</form.Subscribe>
	);
}
