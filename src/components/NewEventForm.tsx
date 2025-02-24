import { useAddEvent, useFetchCinemas } from "@/hooks/useQueries";
import { Events, Cinema } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";

import { X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { format } from "date-fns";

export interface EventFormInput {
  title: string;
  dateTime: string;
  description: string;
  cinemaRef: string;
}

const tomorrow = new Date();
tomorrow.setHours(0, 0, 0, 0);
tomorrow.setDate(tomorrow.getDate() + 1);

const defaultDateTime = tomorrow.toISOString().slice(0, 16);

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  dateTime: z
    .string()
    .nonempty("Date and Time is required")
    .refine((val) => new Date(val) >= tomorrow, {
      message: "Date must be tomorrow or later.",
    }),
  cinemaRef: z.string().min(1, {
    message: "Cinema selection is required.",
  }),
});

export function NewEventForm({
  setOpenModal,
  totalPages,
}: {
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  totalPages: number;
}) {
  const { isPending, mutate: addEvent } = useAddEvent(totalPages);
  const { data: cinemas = [] } = useFetchCinemas();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      dateTime: defaultDateTime,
      cinemaRef: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const isoDateTime = new Date(values.dateTime).toISOString();

    const selectedCinema = cinemas.find(
      (cinema: Cinema) => cinema._id === values.cinemaRef
    );

    const newEvent: Events = {
      _id: "",
      _type: "event",
      title: values.title,
      dateTime: isoDateTime,
      description: `Showing of ${values.title} at ${
        selectedCinema ? selectedCinema.name : ""
      } on ${format(new Date(isoDateTime), "MM/dd/yyyy, h:mm:ss a")}`,
      cinema: {
        _type: "reference",
        _ref: values.cinemaRef,
      },
    };

    addEvent(newEvent);
    setOpenModal(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-tuna-1000 w-1/3 flex flex-col rounded px-10 py-10 space-y-8 relative"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Create new event</h3>
          <span
            onClick={() => setOpenModal(false)}
            className="cursor-pointer [&>svg]:duration-300 hover:[&>svg]:stroke-red-500"
          >
            <X size={30} />
          </span>
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  className="p-2 w-full rounded-md bg-transparent border border-gray-300 dark:border-gray-700 outline-0"
                  placeholder="Event title"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateTime"
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
          name="cinemaRef"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Cinema</FormLabel>
              <FormControl>
                {cinemas.length === 0 ? (
                  <p>No cinemas available</p>
                ) : (
                  <select
                    {...field}
                    className="p-2 w-full rounded-md bg-transparent border border-gray-300 dark:border-gray-700 outline-0"
                  >
                    <option value="">Select a cinema</option>
                    {cinemas.map((cinema: Cinema) => (
                      <option
                        key={cinema._id}
                        value={cinema._id}
                        className="dark:bg-tuna-1000 hover:dark:bg-tuna-900"
                      >
                        {cinema.name}
                      </option>
                    ))}
                  </select>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
