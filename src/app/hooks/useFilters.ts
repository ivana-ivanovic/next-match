import { Selection } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useTransition } from "react";
import { FaFemale, FaMale } from "react-icons/fa";
import { useShallow } from "zustand/shallow";
import useFilterStore from "./useFilterStore";
import usePaginationStore from "./usePaginationStore";

export const useFilters = () => {
  const pathname = usePathname();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const {filters, setFilters} = useFilterStore();

    const {pageNumber, pageSize, setPage, totalCount} = usePaginationStore(
      useShallow(
        state => ({
          pageNumber: state.pagination.pageNumber,
          pageSize: state.pagination.pageSize,
          setPage: state.setPage,
          totalCount: state.pagination.totalCount
      })))

    const {gender, ageRange, orderBy, withPhoto} = filters; 

    useEffect(() => {
      if(gender || ageRange || orderBy || withPhoto){
        setPage(1);
      }
    }, [gender, ageRange, orderBy, setPage, withPhoto])
    

    useEffect(() => {
      startTransition(() => {
        const searchParams = new URLSearchParams();

        if (gender) searchParams.set('gender', gender.join(","));
        if (ageRange) searchParams.set('ageRange', ageRange.toString());
        if (orderBy) searchParams.set('orderBy', orderBy);
        if (pageSize) searchParams.set('pageSize', pageSize.toString());
        if (pageNumber) searchParams.set('pageNumber', pageNumber.toString());
        searchParams.set('withPhoto', withPhoto.toString())

        router.replace(`${pathname}?${searchParams}`);//replace -> user can click on back button and get back to the privious search
        
      })

    }, [gender, ageRange, orderBy, router, pathname, pageSize, pageNumber, withPhoto])
    
  
    const orderByList = [
      {label: 'Last active', value: 'updated'},
      {label: 'Newest members', value: 'created'},
    ];
  
    const genderList = [
      {value: 'male', icon: FaMale},
      {value: 'female', icon: FaFemale},
    ];
  
    const handleAgeSelect = (value: number[]) => {
      setFilters('ageRange', value);
    }
  
    const handleOrderSelect = (value: Selection) => {
      if (value instanceof Set) {
        setFilters('orderBy', value.values().next().value as string);
      }
    }
  
    const handleGenderSelect = (value: string) => {
      if (gender.includes(value)) setFilters('gender', gender.filter(g => g !== value))
        else setFilters('gender', [...gender, value]);
    }

    const handleWithPhotoToggle = (e: ChangeEvent<HTMLInputElement>) => {
      setFilters('withPhoto', e.target.checked.toString());
    }

    return {
      orderByList,
      genderList,
      selectAge: handleAgeSelect,
      selectGender: handleGenderSelect,
      selectOrder: handleOrderSelect,
      selectWithPhoto: handleWithPhotoToggle,
      filters,
      isPending,
      totalCount
    }
}