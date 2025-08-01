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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

type DeviceFormValues = {
  deviceName: string;
  deviceType: string;
  serialNumber: string;
};

export function DeviceForm() {
  const form = useForm<DeviceFormValues>({
    defaultValues: {
      deviceName: "",
      deviceType: "",
      serialNumber: "",
    },
  });

  function onSubmit(values: DeviceFormValues) {
    // Handle form submission (e.g., send to API)
    // console.log(values);
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl mx-auto p-4 "
      >
        <FormField
          control={form.control}
          name="deviceName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Device Name</FormLabel>
              <FormControl>
                <input
                  {...field}
                  type="text"
                  className="input input-bordered w-full p-2"
                  placeholder="Enter device name"
                />
              </FormControl>
              <FormDescription>The name of the device.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="deviceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Device Type</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select device type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="laptop">Laptop</SelectItem>
                    <SelectItem value="desktop">Desktop</SelectItem>
                    <SelectItem value="tablet">Tablet</SelectItem>
                    <SelectItem value="smartphone">Smartphone</SelectItem>
                    <SelectItem value="server">Server</SelectItem>
                    <SelectItem value="network">Network Device</SelectItem>
                    <SelectItem value="printer">Printer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                The type or model of the device.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="serialNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serial Number</FormLabel>
              <FormControl>
                <input
                  {...field}
                  type="text"
                  className="input input-bordered w-full p-2"
                  placeholder="Enter serial number"
                />
              </FormControl>
              <FormDescription>
                The serial number of the device.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full cursor-pointer">
          Submit Device
        </Button>
      </form>
    </FormProvider>
  );
}
