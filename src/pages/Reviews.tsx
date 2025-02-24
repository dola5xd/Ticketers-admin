import { NewReviewForm } from "@/components/NewReviewForm";
import ReviewTable from "@/components/ReviewTable";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

function Reviews() {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between py-7">
          <h3 className="text-4xl text-indigo-500 py-2">Reviews</h3>
          <Button
            variant={"secondary"}
            className="dark:bg-indigo-600 hover:dark:bg-indigo-500 transition-colors duration-500 cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            Create new review
          </Button>
        </div>
        <ScrollArea className="h-[75dvh]">
          <div className="py-7">
            <ReviewTable />
          </div>
        </ScrollArea>
      </div>
      {showModal && (
        <div className="fixed w-full h-screen top-0 left-0 bg-black/50 flex items-center justify-center py-7">
          <NewReviewForm setOpenModal={setShowModal} />
        </div>
      )}
    </>
  );
}

export default Reviews;
