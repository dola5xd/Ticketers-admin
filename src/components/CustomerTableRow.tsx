import { TableCell, TableRow } from "@/components/ui/table";
import { useDeleteCustomer } from "@/hooks/useQueries";
import { Customer } from "@/lib/api";
import { memo } from "react";
import { Button } from "./ui/button";

const CustomerTableRow = memo(({ customer }: { customer: Customer }) => {
  const { mutate: deleteCinema } = useDeleteCustomer();
  const { _id, totalSpent, image, city, dateJoin, name, age } = customer;

  return (
    <TableRow>
      <TableCell className="flex text-left items-center gap-3 text-pretty">
        <img
          src={image}
          className="rounded-full h-full w-[50px]"
          alt={name + " photo"}
        />
        <span>{name}</span>
      </TableCell>

      <TableCell className="text-left">{age}</TableCell>
      <TableCell className="text-left">{city}</TableCell>
      <TableCell className="text-left">
        {new Date(dateJoin).toDateString()}
      </TableCell>
      <TableCell className="text-left">{totalSpent}</TableCell>
      <TableCell className="cursor-pointer">
        <Button
          variant="destructive"
          className="cursor-pointer"
          onClick={() => deleteCinema(String(_id))}
        >
          Remove
        </Button>
      </TableCell>
    </TableRow>
  );
});

export default CustomerTableRow;
