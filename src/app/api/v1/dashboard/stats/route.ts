import { handleRoute } from "@/server/common/http/route-handler";
import { DashboardService } from "@/server/modules/dashboard/dashboard.service";

const dashboardService = new DashboardService();

export async function GET() {
  return handleRoute(() => dashboardService.getStats());
}
