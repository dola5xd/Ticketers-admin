import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ReviewTableRow from "./ReviewTableRow";
import { useGetReviews } from "@/hooks/useQueries";
import Spinner from "./Spinner";
function ReviewTable() {
  const { data: reviews, isLoading } = useGetReviews();
  return (
    <Table>
      <TableCaption>A list of your Customers.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left p-4">Name</TableHead>
          <TableHead className="text-left p-4">Event</TableHead>
          <TableHead className="text-left p-4">rating</TableHead>
          <TableHead className="text-left p-4">message</TableHead>
          <TableHead className="text-center p-4">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <Spinner />
        ) : reviews?.length === 0 ? (
          <TableRow>
            <TableCell
              className="text-center font-semibold text-xl hover:bg-tuna-950"
              colSpan={8}
            >
              Sorry no Reviews found!
            </TableCell>
          </TableRow>
        ) : (
          reviews?.map((review) => (
            <ReviewTableRow review={review} key={review._id} />
          ))
        )}
      </TableBody>
    </Table>
  );
}

export default ReviewTable;
