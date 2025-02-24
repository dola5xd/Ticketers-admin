import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Spinner from "./Spinner";
import EventsTableRow from "./EventsTableRow";
import { useFetchEvents } from "@/hooks/useQueries";

function EventsTable({
  currentPage,
  searchTerm,
}: {
  currentPage: number;
  searchTerm: string;
}) {
  const { data: Events, isLoading } = useFetchEvents(
    searchTerm ? undefined : currentPage
  );

  const filteredEvents = Events?.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <Table>
          <TableCaption>A list of your Events.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left font-semibold p-3">
                Event name
              </TableHead>
              <TableHead className="text-left font-semibold p-3">
                Cinema name
              </TableHead>
              <TableHead className="text-left font-semibold p-3">
                Description
              </TableHead>
              <TableHead className="text-left font-semibold p-3">
                Date time
              </TableHead>
              <TableHead className="text-left font-semibold p-3"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents?.length === 0 ? (
              <TableRow>
                <TableCell
                  className="text-center font-semibold text-xl hover:bg-tuna-950"
                  colSpan={8}
                >
                  Sorry no Events found!
                </TableCell>
              </TableRow>
            ) : (
              filteredEvents?.map((event) => (
                <EventsTableRow event={event} key={event._id} />
              ))
            )}
          </TableBody>
        </Table>
      )}
    </>
  );
}

export default EventsTable;
