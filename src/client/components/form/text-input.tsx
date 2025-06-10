import { Input } from "@client/components/ui/input";
import { Label } from "@client/components/ui/label";
import { useFieldContext } from "./index";

interface TextInputProps {
	label: string;
	type?: string;
	placeholder?: string;
}

export function TextInput({
	label,
	type = "text",
	placeholder,
}: TextInputProps) {
	const field = useFieldContext<string>();
	return (
		<>
			<Label htmlFor={field.name}>{label}</Label>
			<Input
				id={field.name}
				name={field.name}
				value={field.state.value}
				onBlur={field.handleBlur}
				placeholder={placeholder || label}
				type={type}
				onChange={(e) => field.handleChange(e.target.value)}
			/>
			{!field.state.meta.isValid && (
				<em className="text-sm text-red-500">
					{field.state.meta.errors
						?.filter((err) => err?.message)
						.map((err) => err?.message)
						.join(", ")}
				</em>
			)}
		</>
	);
}
