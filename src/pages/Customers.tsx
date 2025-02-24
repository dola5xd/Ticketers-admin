import CustomersTable from "@/components/CustomersTable";
import { NewCustomerForm } from "@/components/NewCustomerForm";
import PaginationButtons from "@/components/PaginationButtons";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetCustomerLength } from "@/hooks/useQueries";
import { useState } from "react";
import { useSearchParams } from "react-router";

function Customers() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const currentPage = searchParams.get("page") || 1;
  const { data: customerLength, isLoading } = useGetCustomerLength();
  const totalPages = Math.ceil(Number(customerLength) / 10);

  if (isLoading) return <Spinner />;

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between px-7 py-7">
          <h3 className="text-4xl text-indigo-500">Customers</h3>
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700"
            />
            <Button
              variant="secondary"
              className="cursor-pointer dark:bg-indigo-700 hover:dark:bg-indigo-500 duration-300"
              onClick={() => setShowModal(true)}
            >
              Add New Customer
            </Button>
          </div>
        </div>
        <ScrollArea className="h-[70dvh] py-4">
          <CustomersTable
            currentPage={Number(currentPage)}
            searchTerm={searchTerm}
          />
        </ScrollArea>
        {!isLoading && totalPages > 1 && searchTerm.length === 0 && (
          <PaginationButtons
            pageName="customer"
            totalPages={totalPages}
            currentPage={Number(currentPage)}
          />
        )}
      </div>
      {showModal && (
        <div className="fixed w-full h-screen top-0 left-0 bg-black/50 flex items-center justify-center py-7">
          <NewCustomerForm
            totalPages={totalPages}
            setOpenModal={setShowModal}
          />
        </div>
      )}
    </>
  );
}

export default Customers;
