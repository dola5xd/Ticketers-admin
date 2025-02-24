import EventsTable from "@/components/EventsTable";
import { NewEventForm } from "@/components/NewEventForm";
import PaginationButtons from "@/components/PaginationButtons";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useGetEventsLength } from "@/hooks/useQueries";
import { useState } from "react";
import { useSearchParams } from "react-router";

function Events() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const currentPage = Number(searchParams.get("page")) || 1;
  const { data: EventsLength, isLoading } = useGetEventsLength();
  const totalPages = Math.ceil(Number(EventsLength) / 10);

  if (isLoading) return <Spinner />;

  return (
    <div className="w-full relative">
      <div className="flex items-center justify-between px-7 py-7">
        <h3 className="text-4xl text-indigo-500">Events</h3>
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700"
          />
          <Button
            variant="secondary"
            className="cursor-pointer dark:bg-indigo-700 hover:dark:bg-indigo-500 duration-300"
            onClick={() => setOpenModal(true)}
          >
            Add New Event
          </Button>
        </div>
      </div>
      <ScrollArea className="h-[70dvh] py-4">
        <EventsTable currentPage={currentPage} searchTerm={searchTerm} />
      </ScrollArea>
      {!isLoading && totalPages > 1 && searchTerm.length === 0 && (
        <PaginationButtons
          pageName="events"
          totalPages={totalPages}
          currentPage={currentPage}
        />
      )}
      {openModal && (
        <div className="fixed w-full h-screen top-0 left-0 bg-black/50 flex items-center justify-center py-7">
          <NewEventForm setOpenModal={setOpenModal} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}

export default Events;
