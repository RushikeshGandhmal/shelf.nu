import { type CustomField } from "@prisma/client";
import { Form, useNavigation } from "@remix-run/react";
import { useAtom, useAtomValue } from "jotai";
import { useZorm } from "react-zorm";
import { z } from "zod";
import { fileErrorAtom, validateFileAtom } from "~/atoms/file";
import { updateTitleAtom } from "~/atoms/workspace.new";
import { isFormProcessing } from "~/utils";
import { zodFieldIsRequired } from "~/utils/zod";
import FormRow from "../forms/form-row";
import Input from "../forms/input";
import { Button } from "../shared";
import { Spinner } from "../shared/spinner";

export const NewWorkspaceFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
});

/** Pass props of the values to be used as default for the form fields */
interface Props {
  name?: CustomField["name"];
}

export const WorkspaceForm = ({ name }: Props) => {
  const navigation = useNavigation();
  const zo = useZorm("NewQuestionWizardScreen", NewWorkspaceFormSchema);
  const disabled = isFormProcessing(navigation.state);
  const fileError = useAtomValue(fileErrorAtom);
  const [, validateFile] = useAtom(validateFileAtom);
  const [, updateName] = useAtom(updateTitleAtom);

  return (
    <Form
      ref={zo.ref}
      method="post"
      className="flex w-full flex-col gap-2"
      encType="multipart/form-data"
    >
      <FormRow
        rowLabel={"Name"}
        className="border-b-0 pb-[10px]"
        required={zodFieldIsRequired(NewWorkspaceFormSchema.shape.name)}
      >
        <Input
          label="Name"
          hideLabel
          name={zo.fields.name()}
          disabled={disabled}
          error={zo.errors.name()?.message}
          autoFocus
          onChange={updateName}
          className="w-full"
          defaultValue={name || undefined}
          placeholder=""
          required={zodFieldIsRequired(NewWorkspaceFormSchema.shape.name)}
        />
      </FormRow>

      <FormRow rowLabel={"Main image"}>
        <div>
          <p className="hidden lg:block">Accepts PNG, JPG or JPEG (max.4 MB)</p>
          <Input
            // disabled={disabled}
            accept="image/png,.png,image/jpeg,.jpg,.jpeg"
            name="image"
            type="file"
            onChange={validateFile}
            label={"Main image"}
            hideLabel
            error={fileError}
            className="mt-2"
            inputClassName="border-0 shadow-none p-0 rounded-none"
          />
          <p className="mt-2 lg:hidden">Accepts PNG, JPG or JPEG (max.4 MB)</p>
        </div>
      </FormRow>

      <div className="text-right">
        <Button type="submit" disabled={disabled}>
          {disabled ? <Spinner /> : "Save"}
        </Button>
      </div>
    </Form>
  );
};