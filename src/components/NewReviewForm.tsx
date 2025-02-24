import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import {
  useAddReview,
  useFetchCustomers,
  useFetchEvents,
  useFetchCinemas,
} from "@/hooks/useQueries";
import { Customer, Events, Cinema } from "@/lib/api";
import Spinner from "./Spinner";
import { ScrollArea } from "./ui/scroll-area";

export type NewReviewTypes = {
  _id?: string;
  _type: string;
  userId: string;
  name: string;
  rating: number;
  message: string;
  EventName: string;
  cinemaRef: string; // Cinema selection field
};

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  EventName: z.string().min(1, {
    message: "Event selection is required!",
  }),
  cinemaRef: z.string().min(1, {
    message: "Cinema selection is required!",
  }),
  rating: z
    .number()
    .min(0, { message: "Rating must be at least 0 stars." })
    .max(5, { message: "Rating must be at most 5 stars." }),
  message: z.string().min(1, {
    message: "Review message must have at least 1 character!",
  }),
});

export function NewReviewForm({
  setOpenModal,
}: {
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { isPending, mutate: addReview } = useAddReview();
  const { data: customers, isLoading: customersLoading } = useFetchCustomers();
  const { data: events, isLoading: eventsLoading } = useFetchEvents();
  const { data: cinemas = [], isLoading: cinemasLoading } = useFetchCinemas();

  // Separate state for customer search
  const [customerSearchTerm, setCustomerSearchTerm] = useState<string>("");
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

  // Separate state for event search
  const [eventSearchTerm, setEventSearchTerm] = useState<string>("");
  const [filteredEvents, setFilteredEvents] = useState<Events[]>([]);

  // Filter customers based on search input
  useEffect(() => {
    if (customerSearchTerm.length >= 1 && customers) {
      setFilteredCustomers(
        customers.filter((customer: Customer) =>
          customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredCustomers([]);
    }
  }, [customerSearchTerm, customers]);

  // Filter events based on search input and deduplicate by title
  useEffect(() => {
    if (eventSearchTerm.length >= 1 && events) {
      const filtered = events.filter((event: Events) =>
        event.title.toLowerCase().includes(eventSearchTerm.toLowerCase())
      );
      const uniqueEvents = filtered.filter(
        (event, index, self) =>
          index === self.findIndex((e) => e.title === event.title)
      );
      setFilteredEvents(uniqueEvents);
    } else {
      setFilteredEvents([]);
    }
  }, [eventSearchTerm, events]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      rating: 5,
      message: "",
      EventName: "",
      cinemaRef: "",
    },
  });

  // Set an error if no customer is found
  useEffect(() => {
    if (filteredCustomers.length === 0 && customerSearchTerm) {
      form.setError("name", {
        type: "manual",
        message: "No customer with this name",
      });
    } else {
      form.clearErrors("name");
    }
  }, [filteredCustomers, customerSearchTerm, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const NewReview: NewReviewTypes = {
      ...values,
      _type: "review",
      userId: filteredCustomers.at(0)?._id || "",
    };
    addReview(NewReview);
    setOpenModal(false);
  }

  if (customersLoading || eventsLoading || cinemasLoading) return <Spinner />;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-tuna-1000 w-1/3 flex flex-col rounded px-8 py-10 space-y-8 relative"
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
        <ScrollArea className="h-[50vh] w-full px-4">
          <div className="flex flex-col space-y-8 pb-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      className="p-2 w-full rounded-md bg-transparent border border-gray-300 dark:border-gray-700 outline-0"
                      placeholder="Search customer..."
                      value={customerSearchTerm}
                      onChange={(e) => setCustomerSearchTerm(e.target.value)}
                    />
                  </FormControl>
                  {filteredCustomers.length > 0 &&
                    customerSearchTerm !== filteredCustomers[0]?.name && (
                      <ScrollArea className="max-h-[125px] bg-tuna-900">
                        {filteredCustomers.map((customer: Customer) => (
                          <div
                            key={customer._id}
                            className="p-2 cursor-pointer hover:bg-tuna-900"
                            onClick={() => {
                              field.onChange(customer.name);
                              setCustomerSearchTerm(customer.name);
                              setFilteredCustomers([]);
                            }}
                          >
                            {customer.name}
                          </div>
                        ))}
                      </ScrollArea>
                    )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="EventName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event name</FormLabel>
                  <FormControl>
                    <Input
                      className="p-2 w-full rounded-md bg-transparent border border-gray-300 dark:border-gray-700 outline-0"
                      placeholder="Search event..."
                      value={eventSearchTerm}
                      onChange={(e) => {
                        setEventSearchTerm(e.target.value);
                        field.onChange("");
                      }}
                    />
                  </FormControl>
                  {filteredEvents.length > 0 &&
                    eventSearchTerm !== filteredEvents[0]?.title && (
                      <ScrollArea className="max-h-[125px] bg-tuna-900">
                        {filteredEvents.map((event: Events) => (
                          <div
                            key={event._id}
                            className="p-2 cursor-pointer hover:bg-tuna-900"
                            onClick={() => {
                              field.onChange(event.title);
                              setEventSearchTerm(event.title);
                              setFilteredEvents([]);
                            }}
                          >
                            {event.title}
                          </div>
                        ))}
                      </ScrollArea>
                    )}
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
                    {cinemas.length === 0 ? (
                      <p>No cinemas available</p>
                    ) : (
                      <select
                        {...field}
                        className="p-2 w-full rounded-md bg-tuna-1000 border border-gray-300 dark:border-gray-700 "
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

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="p-2 w-full rounded-md bg-transparent border border-gray-300 dark:border-gray-700 outline-0"
                      placeholder="Rate"
                      max={5}
                      min={0}
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
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      className="p-2 w-full rounded-md bg-transparent border border-gray-300 dark:border-gray-700 outline-0 pt-3"
                      placeholder="Write your review here..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
