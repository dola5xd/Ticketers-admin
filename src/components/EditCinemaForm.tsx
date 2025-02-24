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
import { Cinema } from "@/lib/api";
import { useEditCinema } from "@/hooks/useQueries";

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
    })
    .optional(),
});

export function EditCinemaForm({
  data,
  setOpenModal,
}: {
  data: Cinema;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { name, location, capacity, image } = data;

  const { mutate: submitEdits, isPending } = useEditCinema();
  const [imagePreview, setImagePreview] = useState<string | null>(
    String(image) || null
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name,
      location,
      capacity,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const updatedCinema: Cinema = {
      ...data,
      ...values,
      image: typeof values.image === "object" ? values.image : image,
    };
    submitEdits(updatedCinema);
    setOpenModal(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-tuna-1000 w-1/3 flex flex-col rounded px-10 py-10 space-y-8 relative"
      >
        <span
          className="absolute top-0 bg-tuna-900 rounded right-0 cursor-pointer hover:bg-red-700 duration-500"
          onClick={() => setOpenModal(false)}
        >
          <X size={35} />
        </span>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  className="py-5"
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
                <Input className="py-5" placeholder="Cairo" {...field} />
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
                  className="py-5"
                  placeholder="Capacity"
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
