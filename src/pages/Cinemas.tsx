import CinemaTable from "@/components/CinemaTable";
import { NewCinemaForm } from "@/components/NewCinemaForm";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

function Cinemas() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  return (
    <div className="w-full relative">
      <div className="flex items-center justify-between px-7 py-7">
        <h3 className="text-4xl text-indigo-500">Cinemas</h3>
        <Button
          variant={"secondary"}
          className="cursor-pointer dark:bg-indigo-700 hover:dark:bg-indigo-500 duration-300 "
          onClick={() => setOpenModal(true)}
        >
          Add New Cinema
        </Button>
      </div>
      <ScrollArea className="h-[70dvh] py-4">
        <CinemaTable />
      </ScrollArea>
      {openModal && (
        <div className="fixed w-full h-screen top-0 left-0 bg-black/50 flex items-center justify-center py-7">
          <NewCinemaForm setOpenModal={setOpenModal} />
        </div>
      )}
    </div>
  );
}

export default Cinemas;
