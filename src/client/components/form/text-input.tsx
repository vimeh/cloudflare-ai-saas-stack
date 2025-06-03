import { Input } from "@client/components/ui/input";
import { Label } from "@client/components/ui/label";
import { useFieldContext } from "./index";

export function TextInput({ label }: { label: string }) {
	const field = useFieldContext<string>();
	return (
		<>
			<Label htmlFor={field.name}>{label}</Label>
			<Input
				id={field.name}
				name={field.name}
				value={field.state.value}
				onBlur={field.handleBlur}
				placeholder={label}
				type="text"
				onChange={(e) => field.handleChange(e.target.value)}
			/>
			{!field.state.meta.isValid && (
				<em>{field.state.meta.errors.join(",")}</em>
			)}
		</>
	);
}
