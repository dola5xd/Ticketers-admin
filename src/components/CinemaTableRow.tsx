import { TableCell, TableRow } from "@/components/ui/table";
import { Cinema } from "@/lib/api";
import { memo, useState } from "react";
import { Button } from "./ui/button";
import { useDeleteCinema } from "@/hooks/useQueries";
import { EditCinemaForm } from "./EditCinemaForm";

const CinemaTableRow = memo(({ cinema }: { cinema: Cinema }) => {
  const { capacity, image, location, name, _id } = cinema;
  const { mutate: deleteCinema } = useDeleteCinema();
  const [editModal, setEditModal] = useState<boolean>(false);
  return (
    <>
      <TableRow>
        <TableCell className="text-left">
          <img
            src={String(image)}
            className="h-[75px] w-[100px] object-fill"
            alt={name + " photo"}
          />
        </TableCell>
        <TableCell className="text-left">{name}</TableCell>
        <TableCell className="text-left">{capacity}</TableCell>
        <TableCell className="text-left">{location}</TableCell>
        <TableCell className="text-left">
          <div className=" flex gap-4 items-center justify-center">
            <Button
              variant={"secondary"}
              className="cursor-pointer dark:bg-indigo-700 hover:dark:bg-indigo-600"
              onClick={() => setEditModal(true)}
            >
              Edit
            </Button>
            |
            <Button
              variant={"destructive"}
              className="cursor-pointer"
              onClick={() => deleteCinema(String(_id))}
            >
              Remove
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {editModal && (
        <div className="fixed w-full h-screen top-0 left-0 bg-black/50 flex items-center justify-center py-7">
          <EditCinemaForm data={cinema} setOpenModal={setEditModal} />
        </div>
      )}
    </>
  );
});

export default CinemaTableRow;
