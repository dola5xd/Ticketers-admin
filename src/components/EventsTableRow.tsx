import { TableCell, TableRow } from "@/components/ui/table";
import { Events } from "@/lib/api";
import { memo, useState } from "react";
import { Button } from "./ui/button";
import { useDeleteEvent } from "@/hooks/useQueries";
import { EditEventForm } from "./EditEventForm";

const EventsTableRow = memo(({ event }: { event: Events }) => {
  const { cinema, title, description, dateTime, _id } = event;
  const { mutate: deleteEvent } = useDeleteEvent();
  const [editModal, setEditModal] = useState<boolean>(false);
  const alreadyDone = new Date().toISOString() >= dateTime;
  return (
    <>
      <TableRow className={alreadyDone ? "line-through text-tuna-500" : ""}>
        <TableCell className="text-left">{title}</TableCell>
        <TableCell className="text-left capitalize">
          {String(cinema._ref).split("-").join(" ")}
        </TableCell>
        <TableCell className="text-left text-pretty">{description}</TableCell>
        <TableCell className="text-left text-pretty">
          {new Date(dateTime).toLocaleString()}
        </TableCell>
        <TableCell className="text-left">
          <div className="flex gap-4 items-center justify-center">
            <Button
              variant="secondary"
              className="cursor-pointer dark:bg-indigo-700 hover:dark:bg-indigo-600"
              onClick={() => setEditModal(true)}
            >
              Edit
            </Button>
            |
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={() => deleteEvent(String(_id))}
            >
              Remove
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {editModal && (
        <div className="fixed w-full h-screen top-0 left-0 bg-black/50 flex items-center justify-center py-7">
          <EditEventForm data={event} setOpenModal={setEditModal} />
        </div>
      )}
    </>
  );
});

export default EventsTableRow;
