import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { X } from "lucide-react";
import { useAddCustomer } from "@/hooks/useQueries";
import { ScrollArea } from "./ui/scroll-area";

export type NewCustomer = {
  _type: string;
  name: string;
  age: string | number;
  image: File;
  city: string;
  dateJoin: string;
  totalSpent: number;
};

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  age: z.number().min(15, {
    message: "Age must be at least 15.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  dateJoin: z
    .string()
    .nonempty("Date and Time is required")
    .refine((val) => new Date(val) <= new Date(), {
      message: "Date cannot be in the future.",
    }),

  totalSpent: z.number().min(0, {
    message: "Total spent must be at least 0.",
  }),
  image: z
    .instanceof(File, { message: "Invalid file type" })
    .refine((file) => file.type.startsWith("image/"), {
      message: "Must be an image file",
    }),
});

export function NewCustomerForm({
  totalPages,
  setOpenModal,
}: {
  totalPages: number;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { isPending, mutate: addCustomer } = useAddCustomer(totalPages);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: 15,
      city: "",
      dateJoin: (() => {
        const tomorrow = new Date();
        tomorrow.setHours(0, 0, 0, 0);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().slice(0, 16);
      })(),
      totalSpent: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const isoDateJoin = new Date(values.dateJoin).toISOString();

    const formattedValues = {
      ...values,
      dateJoin: isoDateJoin,
      _type: "customer",
    };
    addCustomer(formattedValues, {
      onSuccess: () => setOpenModal(false),
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="dark:bg-tuna-1000 bg-tuna-100 text-tuna-1000 dark:text-tuna-100 w-1/3 flex flex-col rounded px-8 py-10 space-y-8 relative"
      >
        <div className="flex items-center justify-between px-4">
          <h3 className="text-2xl font-semibold">Create new customer</h3>
          <span
            onClick={() => setOpenModal(false)}
            className="cursor-pointer [&>svg]:duration-300 hover:[&>svg]:stroke-red-500"
          >
            <X size={30} />
          </span>
        </div>
        <ScrollArea className="h-[50vh] px-4">
          <div className="flex flex-col space-y-8 pb-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      className="p-2 w-full rounded-md bg-transparent border border-gray-300 dark:border-gray-700 outline-0"
                      placeholder="John Doe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="p-2 w-full rounded-md bg-transparent border border-gray-300 dark:border-gray-700 outline-0"
                      placeholder="30"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      className="p-2 w-full rounded-md bg-transparent border border-gray-300 dark:border-gray-700 outline-0"
                      placeholder="New York"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateJoin"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Date &amp; Time</FormLabel>
                  <FormControl>
                    <input
                      type="datetime-local"
                      {...field}
                      className="p-2 w-full rounded-md bg-transparent border border-gray-300 dark:border-gray-700 outline-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalSpent"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Total Spent</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="p-2 w-full rounded-md bg-transparent border border-gray-300 dark:border-gray-700 outline-0"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!imagePreview && (
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Upload Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          field.onChange(e.target.files![0]);
                          setImagePreview(
                            URL.createObjectURL(e.target.files![0])
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {imagePreview && (
              <div className="self-center">
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="w-[125px] h-[125px]"
                />
              </div>
            )}
          </div>
        </ScrollArea>

        <Button
          disabled={isPending}
          className="py-5 cursor-pointer"
          type="submit"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
