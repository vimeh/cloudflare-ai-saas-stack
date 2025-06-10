import { Label } from "@client/components/ui/label";
import type * as React from "react";
import { useFieldContext } from "./index";

interface TextAreaFieldProps {
	label: string;
	placeholder?: string;
	rows?: number;
}

export function TextAreaField({
	label,
	placeholder,
	rows = 4,
}: TextAreaFieldProps) {
	const field = useFieldContext<string>();
	return (
		<>
			<Label htmlFor={field.name}>{label}</Label>
			<textarea
				id={field.name}
				name={field.name}
				value={field.state.value}
				onBlur={field.handleBlur}
				placeholder={placeholder || label}
				rows={rows}
				onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
					field.handleChange(e.target.value)
				}
				className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
