import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";

function PaginationButtons({
  totalPages,
  currentPage,
  pageName,
}: {
  totalPages: number;
  currentPage: number;
  pageName: string;
}) {
  const navigate = useNavigate();

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const handlePageChange = (page: number) => {
    console.log("Page changed to:", page);
    navigate(`/${pageName}?page=${page}`, { viewTransition: true });
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button disabled={currentPage === 1} variant={"secondary"}>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
            />
          </Button>
        </PaginationItem>

        {currentPage > 3 && (
          <PaginationItem>
            <Button
              className="cursor-pointer"
              disabled={currentPage === 1}
              variant={"secondary"}
            >
              <PaginationLink onClick={() => handlePageChange(1)}>
                1
              </PaginationLink>
            </Button>
          </PaginationItem>
        )}

        {currentPage > 4 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {pages
          .slice(
            Math.max(0, currentPage - 3),
            Math.min(currentPage + 2, totalPages)
          )
          .map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => handlePageChange(page)}
                aria-current={page === currentPage ? "page" : undefined}
              >
                <Button
                  className="cursor-pointer"
                  disabled={currentPage === page}
                  variant={"secondary"}
                >
                  {page}
                </Button>
              </PaginationLink>
            </PaginationItem>
          ))}

        {currentPage < totalPages - 3 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {currentPage < totalPages - 2 && (
          <PaginationItem>
            <Button
              className="cursor-pointer"
              disabled={currentPage === totalPages}
              variant={"secondary"}
            >
              <PaginationLink onClick={() => handlePageChange(totalPages)}>
                {totalPages}
              </PaginationLink>
            </Button>
          </PaginationItem>
        )}

        <PaginationItem>
          <Button disabled={currentPage === totalPages} variant={"secondary"}>
            <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default PaginationButtons;
