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
import { Dispatch, SetStateAction } from "react";
import { X } from "lucide-react";
import { Events, Cinema } from "@/lib/api";
import { useEditEvent, useFetchCinemas } from "@/hooks/useQueries";
import { format } from "date-fns";

const formSchema = z.object({
  dateTime: z.string().nonempty("Date and Time is required"),
  cinemaRef: z.string().nonempty("Cinema selection is required"),
});

export function EditEventForm({
  data,
  setOpenModal,
}: {
  data: Events;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}) {
  const initialDateTime = new Date(data.dateTime).toISOString().slice(0, 16);
  const { mutate: submitEdits, isPending } = useEditEvent();
  const { data: cinemas, isLoading: cinemasLoading } = useFetchCinemas();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateTime: initialDateTime,
      cinemaRef: data.cinema._ref,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Convert the datetime-local value to an ISO string
    const updatedDateTime = new Date(values.dateTime).toISOString();
    const updatedEvent: Events = {
      ...data,
      dateTime: updatedDateTime,
      description: `Showing of ${data.title} at ${String(values.cinemaRef)
        .split("-")
        .join(" ")}
 on ${format(updatedDateTime, "MM/dd/yyyy, h:mm:ss a")}`,
      cinema: { _type: "reference", _ref: values.cinemaRef },
    };

    submitEdits(updatedEvent);
    setOpenModal(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="dark:bg-tuna-1000 bg-tuna-100 text-tuna-1000 dark:text-tuna-100 w-1/3 flex flex-col rounded px-8 py-10 space-y-8 relative"
      >
        <span
          className="absolute top-0 bg-transparent rounded right-0 cursor-pointer hover:bg-red-700 duration-500 [&>svg]:stroke-white  
 [&>svg]:duration-500 hover:[&>svg]:stroke-white"
          onClick={() => setOpenModal(false)}
        >
          <X size={35} />
        </span>
        <FormField
          control={form.control}
          name="dateTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date &amp; Time</FormLabel>
              <FormControl>
                <input
                  type="datetime-local"
                  className="py-5 w-full"
                  {...field}
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
            <FormItem>
              <FormLabel>Cinema</FormLabel>
              <FormControl>
                {cinemasLoading ? (
                  <p>Loading cinemas...</p>
                ) : (
                  <select
                    {...field}
                    className="p-2 w-full rounded-md bg-transparent"
                  >
                    {cinemas?.map((cinema: Cinema) => (
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
