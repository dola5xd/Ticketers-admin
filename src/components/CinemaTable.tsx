import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import CinemaTableRow from "./CinemaTableRow";
import Spinner from "./Spinner";
import { useFetchCinemas } from "@/hooks/useQueries";

function CinemaTable() {
  const { data: cinemas, isLoading } = useFetchCinemas();
  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <Table>
          <TableCaption>A list of your Cinemas.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left font-semibold p-3">
                Image
              </TableHead>
              <TableHead className="text-left font-semibold p-3">
                Name
              </TableHead>
              <TableHead className="text-left font-semibold p-3">
                Capacity
              </TableHead>
              <TableHead className="text-left font-semibold p-3">
                Location
              </TableHead>
              <TableHead className="text-left font-semibold p-3"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cinemas?.length === 0 ? (
              <TableRow>
                <TableCell
                  className="text-center font-semibold text-xl hover:bg-tuna-950"
                  colSpan={8}
                >
                  Sorry no Cinemas found!
                </TableCell>
              </TableRow>
            ) : (
              cinemas?.map((cinema) => (
                <CinemaTableRow cinema={cinema} key={cinema._id} />
              ))
            )}
          </TableBody>
        </Table>
      )}
    </>
  );
}

export default CinemaTable;
