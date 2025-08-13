'use client'

import usePaginationStore from "@/app/hooks/usePaginationStore";
import { Pagination } from "@heroui/pagination";
import clsx from "clsx";
import { useEffect } from "react";

export default function PaginationComponent({totalCount} : {totalCount: number}) {

 
  const setPage = usePaginationStore(state => state.setPage);
  const setPageSize = usePaginationStore(state => state.setPageSize);
  const setPagination = usePaginationStore(state => state.setPagination);
  const pagination = usePaginationStore(state => state.pagination);

  const {pageNumber, pageSize, totalPages} = pagination;

  useEffect(() => {
    setPagination(totalCount)
  }, [setPagination, totalCount]);
  

  const start = (pageNumber - 1) * pageSize + 1;
  const end = Math.min(pageNumber * pageSize, totalCount);
  const resultText = `Showing ${start}-${end} of ${totalCount} results`

  return (
    <div className="border-t-2 w-full mt-5">
      <div className="flex flex-row justify-between items-center py-5">
        <div>{resultText}</div>
        <Pagination 
          total={totalPages}
          color="secondary"
          initialPage={pageNumber}
          variant="bordered"
          onChange={setPage}
        />
        <div className="flex flex-row gap-1 items-center">
          Page Size:
          {[3,6,12].map(size => (
            <div 
              key={size}
              onClick={() => setPageSize(size)} 
              className={clsx('page-size-box', {
                'bg-secondary text-white hover:bg-secondary hover:text-white'
                  : pageSize === size
            })}>
              {size}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}