import { TableCell, TableRow } from "@/components/ui/table";
import { NewReviewTypes } from "./NewReviewForm";
import { Star } from "lucide-react";
import { useDeleteReview, useGetCustomerImageById } from "@/hooks/useQueries";
import Spinner from "./Spinner";
import { Button } from "./ui/button";

function ReviewTableRow({ review }: { review: NewReviewTypes }) {
  const { _id, name, message, EventName, userId, rating } = review;
  const { mutate: deleteReview } = useDeleteReview();
  const { data: customerImage, isLoading } = useGetCustomerImageById(
    userId,
    name
  );
  return (
    <TableRow>
      <TableCell className="flex text-left items-center gap-3 text-pretty">
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <img
              src={customerImage}
              className="rounded-full h-full w-[50px]"
              alt={name + " photo"}
            />

            <span>{name}</span>
          </>
        )}
      </TableCell>
      <TableCell className="p-4 text-left">{EventName}</TableCell>
      <TableCell className="p-4 text-left ">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              className={`h-5 w-5 ${
                index < rating
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-gray-300 fill-transparent"
              }`}
            />
          ))}
        </div>
      </TableCell>
      <TableCell className="p-4 text-left">{message}</TableCell>
      <TableCell
        className="p-4 text-center"
        onClick={() => deleteReview(String(_id))}
      >
        <Button variant={"destructive"} className="cursor-pointer">
          Remove
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default ReviewTableRow;
