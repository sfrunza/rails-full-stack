import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "components/ui/pagination";
import { ScrollArea, ScrollBar } from "components/ui/scroll-area";
import { paginationRange } from "lib/utils";
import { setPage } from "slices/requests";
import { useDispatch, useSelector } from "store";

export function TablePagination({ totalPages }: { totalPages: number }) {
  const { page } = useSelector((state) => state.requests);
  const dispatch = useDispatch();
  // const totalPages = 20;

  let pagesArray = paginationRange(totalPages, page);

  return (
    <ScrollArea className="mx-auto w-full whitespace-nowrap">
      <Pagination className="py-2">
        <PaginationContent>
          <PaginationItem className="cursor-pointer">
            <PaginationPrevious
              onClick={(e) => {
                e.preventDefault();
                page > 1 && dispatch(setPage(page - 1));
              }}
            />
          </PaginationItem>
          {pagesArray.map((val, i) => {
            if (val === "...") {
              return (
                <PaginationItem key={i}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            return (
              <PaginationItem key={i} className="cursor-pointer">
                <PaginationLink
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(setPage(val));
                  }}
                  isActive={page === val}
                >
                  {val}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          <PaginationItem className="cursor-pointer">
            <PaginationNext
              onClick={(e) => {
                e.preventDefault();
                page < totalPages && dispatch(setPage(page + 1));
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
