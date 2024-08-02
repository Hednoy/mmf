import prisma from "@/lib-server/prisma";
import { Prisma, Pathogens } from "@prisma/client";
import ApiError from "../error";
import {
  PathogensCreateFormData,
  PathogenssGetData,
  PathogensUpdateData,
} from "@/types/models/Pathogens";
import { PaginatedResponse, SortDirection } from "@/types";
import { filterSearchTerm } from "@/utils";

export const getPathogens = async (id: number): Promise<Pathogens> => {
  const where = {} as any;
  if (id) {
    where.id = id;
  }
  const pathogens = await prisma.pathogens.findUnique({ where: where });
  if (!pathogens)
    throw new ApiError(`Pathogens with id: ${id} not found.`, 404);

  return pathogens;
};

export const getPathogensList = async (
  pathogensGetdata: PathogenssGetData = {}
): Promise<PaginatedResponse<Pathogens>> => {
  const {
    page = 1,
    limit = 999,
    searchTerm,
    sort = "updated_at",
    sortDirection,
  } = pathogensGetdata;

  const search = filterSearchTerm(searchTerm);

  const where: Prisma.PathogensWhereInput = {};

  if (search) {
    where.name = { contains: search };
  }

  const totalCount = await prisma.pathogens.count({ where });

  let pathogenss = await prisma.pathogens.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      [sort]: sortDirection as SortDirection,
    },
  });

  pathogenss = Array.isArray(pathogenss) ? pathogenss : [];

  const result = {
    items: pathogenss.map((pathogenss) => pathogenss),
    pagination: {
      total: totalCount,
      pagesCount: Math.ceil(totalCount / limit),
      currentPage: page,
      perPage: limit,
      from: (page - 1) * limit + 1, // from item
      to: (page - 1) * limit + pathogenss.length,
      hasMore: page < Math.ceil(totalCount / limit),
    },
  };

  return result;
};

export const createPathogens = async (
  data: PathogensCreateFormData
): Promise<Pathogens> => {
  const pathogens = await prisma.pathogens.create({
    data,
  });

  return pathogens;
};

export const updatePathogens = async (
  id: number,
  data: PathogensUpdateData
): Promise<Pathogens> => {
  const pathogens = await prisma.pathogens.update({
    where: { id },
    data,
  });

  return pathogens;
};

export const deletePathogens = async (id: number): Promise<Pathogens> => {
  const pathogens = await prisma.pathogens.delete({ where: { id } });

  return pathogens;
};
