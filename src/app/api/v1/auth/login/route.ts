import { type NextRequest } from "next/server";

import { handleRoute } from "@/server/common/http/route-handler";
import { AuthService } from "@/server/modules/auth/auth.service";
import { loginSchema } from "@/server/modules/auth/validators/login.validator";

const authService = new AuthService();

export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    const payload = loginSchema.parse(await request.json());
    return authService.login(payload);
  });
}
