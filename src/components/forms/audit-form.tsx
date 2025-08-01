"use client";

import { useForm, FormProvider } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

type AuditFormValues = {
  projectName: string;
  auditorName: string;
  auditNotes: string;
};

export function AuditForm() {
  const form = useForm<AuditFormValues>({
    defaultValues: {
      projectName: "",
      auditorName: "",
      auditNotes: "",
    },
  });

  function onSubmit(values: AuditFormValues) {
    // Handle form submission (e.g., send to API)
    // console.log(values);
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl mx-auto"
      >
        <FormField
          control={form.control}
          name="projectName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <input
                  {...field}
                  type="text"
                  className="input input-bordered w-full p-2"
                  placeholder="Enter project name"
                />
              </FormControl>
              <FormDescription>
                The name of the project being audited.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="auditorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Auditor Name</FormLabel>
              <FormControl>
                <input
                  {...field}
                  type="text"
                  className="input input-bordered w-full p-2"
                  placeholder="Enter auditor name"
                />
              </FormControl>
              <FormDescription>
                Your name or the name of the auditor.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="auditNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Audit Notes</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  className="textarea textarea-bordered w-full p-2"
                  placeholder="Enter audit notes"
                  rows={4}
                />
              </FormControl>
              <FormDescription>
                Any relevant notes or findings from the audit.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full  cursor-pointer">
          Submit Audit
        </Button>
      </form>
    </FormProvider>
  );
}
