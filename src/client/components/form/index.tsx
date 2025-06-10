import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { SubmitButton } from "./submit-button";
import { TextAreaField } from "./text-area";
import { TextInput } from "./text-input";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
	createFormHookContexts();

export const { useAppForm } = createFormHook({
	fieldComponents: {
		TextInput,
		TextAreaField,
	},
	formComponents: {
		SubmitButton,
	},
	fieldContext,
	formContext,
});
