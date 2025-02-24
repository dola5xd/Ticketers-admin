import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CustomerTableRow from "./CustomerTableRow";
import Spinner from "./Spinner";
import { useFetchCustomers } from "@/hooks/useQueries";

function CustomersTable({
  currentPage,
  searchTerm,
}: {
  currentPage: number;
  searchTerm: string;
}) {
  const { data: customers, isLoading } = useFetchCustomers(currentPage);
  const filteredCustomers = customers?.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <Table className="min-w-full ">
            <TableHeader>
              <TableRow>
                <TableHead className="text-left font-semibold p-3">
                  Name
                </TableHead>
                <TableHead className="text-left font-semibold ">Age</TableHead>
                <TableHead className="text-left font-semibold ">City</TableHead>
                <TableHead className="text-left font-semibold ">
                  Date Join
                </TableHead>
                <TableHead className="text-left font-semibold ">
                  Total Spent
                </TableHead>
                <TableHead className=" font-semibold p-3"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers?.length === 0 ? (
                <TableRow>
                  <TableCell
                    className="text-center font-semibold text-xl"
                    colSpan={6}
                  >
                    Sorry no Customers found!
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers?.map((customer) => (
                  <CustomerTableRow key={customer._id} customer={customer} />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}

export default CustomersTable;
