import categoryService, { CategoryResponseDto } from "@/app/datasources/categories/categoryService";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {
  const {
    data: categories,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<CategoryResponseDto[]>({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories(),
  });

  return { categories, isLoading, isError, error, refetch };
};