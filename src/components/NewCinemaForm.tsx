import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
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
import { Dispatch, SetStateAction } from "react";
import { X } from "lucide-react";
import { useAddCinemas } from "@/hooks/useQueries";

export type NewCinemaTypes = {
  _id?: string;
  _type: string;
  name: string;
  location: string;
  capacity: number;
  image: File;
};
const formSchema = z.object({
  name: z.string().min(2, {
    message: "name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "location must be at least 2 characters.",
  }),
  capacity: z.number().min(10, {
    message: "Cinema must have at least 10 seats!",
  }),
  image: z
    .instanceof(File, { message: "Invalid file type" })
    .refine((file) => file.type.startsWith("image/"), {
      message: "Must be an image file",
    }),
});

export function NewCinemaForm({
  setOpenModal,
}: {
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { isPending, mutate: addCinema } = useAddCinemas();

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      capacity: 10,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const cinema: NewCinemaTypes = {
      ...values,
      _type: "cinema",
    };
    addCinema(cinema);
    setOpenModal(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="dark:bg-tuna-1000 bg-tuna-100 text-tuna-1000 dark:text-tuna-100 w-1/3 flex flex-col rounded px-8 py-10 space-y-8 relative"
      >
        <div className="flex items-center justify-between bg-transparent">
          <h3 className="text-2xl font-semibold">Create new cinema</h3>
          <span
            onClick={() => setOpenModal(false)}
            className="cursor-pointer [&>svg]:duration-300 hover:[&>svg]:stroke-red-500"
          >
            <X size={30} />
          </span>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  className="p-2 w-full rounded-md bg-transparent border border-gray-300 dark:border-gray-700 outline-0"
                  placeholder="Plaza CineComfort"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  className="p-2 w-full rounded-md bg-transparent border border-gray-300 dark:border-gray-700 outline-0"
                  placeholder="Cairo"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  className="p-2 w-full rounded-md bg-transparent border border-gray-300 dark:border-gray-700 outline-0"
                  placeholder="Capacity"
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
              <FormItem>
                <FormLabel>Upload Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      field.onChange(e.target.files![0]);
                      setImagePreview(URL.createObjectURL(e.target.files![0]));
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
