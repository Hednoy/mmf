import { PaginatedResponse } from "@/types";
import axiosInstance from "../axios";
import { Routes } from "@/lib-client/constants";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import QueryKeys from "../queryKeys";
import { PathogenssGetData } from "@/types/models/Pathogens";
import { Pathogens } from "@prisma/client";

const getPathogens = async (
  params: PathogenssGetData
): Promise<PaginatedResponse<Pathogens>> => {
  const { data } = await axiosInstance.get<PaginatedResponse<Pathogens>>(
    Routes.API.PATHOGENTS,
    { params }
  );
  return data;
};

export const usePathogens = (params: PathogenssGetData) => {
  const { data, isError, isLoading, refetch } = useQuery<
    PaginatedResponse<Pathogens>,
    AxiosError
  >({
    queryKey: [QueryKeys.PATHOGENTS, params],
    queryFn: () => getPathogens(params),
  });

  return {
    data: data?.items || [],
    pagination: data?.pagination,
    isError,
    isLoading,
    refetch,
  };
};

const getPathogensById = async (id: number | undefined): Promise<Pathogens> => {
  const { data } = await axiosInstance.get<Pathogens>(
    `${Routes.API.PATHOGENTS}/${id}`
  );
  return data;
};

export const usePathogensById = (id: number | undefined, options: any = {}) => {
  const query = useQuery<Pathogens, AxiosError>({
    queryKey: [QueryKeys.PATHOGENTS, { id }],
    queryFn: () => getPathogensById(id),
    ...options,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    isSuccess: query.isSuccess,
  };
};
