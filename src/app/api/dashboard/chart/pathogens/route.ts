import ApiError from "@/lib-server/error";
import {
  getLabChartData,
  getLabChartPathogensData,
  getLabTestChartData,
  getLabTestList,
} from "@/lib-server/services/dashboard";
import { stringToNumber } from "@/lib-server/validation";
import { QueryParamsType } from "@/types";
import { LabChartParams } from "@/types/models/Lab";
import { NextRequest } from "next/server";
import { z } from "zod";

const dashboardSchema = z.object({
  month: z.preprocess(stringToNumber, z.number().min(1).optional()),
  pathogensId: z.preprocess(stringToNumber, z.number().optional()),
});

const validateDashboardQueryParams = (
  params: QueryParamsType
): LabChartParams => {
  const result = dashboardSchema.safeParse(params);
  if (!result.success) throw ApiError.fromZodError(result.error);

  return result.data as LabChartParams;
};

const GET = async (request: NextRequest) => {
  const {
    nextUrl: { search },
  } = request;
  try {
    const urlSearchParams = new URLSearchParams(search);
    const params = Object.fromEntries(urlSearchParams.entries());

    const parsedData = validateDashboardQueryParams(params);

    const dashboard = await getLabChartPathogensData(parsedData?.month || 1, parsedData?.pathogensId);

    return Response.json(dashboard);
  } catch (e: any) {
    return new Response(e, {
      status: 400,
      statusText: "Bad Request",
    });
  }
};

export { GET };
