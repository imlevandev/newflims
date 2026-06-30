import { type NextRequest } from "next/server";

import { handleRoute } from "@/server/common/http/route-handler";
import { AuthService } from "@/server/modules/auth/auth.service";
import { registerSchema } from "@/server/modules/auth/validators/register.validator";

const authService = new AuthService();

export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    const payload = registerSchema.parse(await request.json());
    return authService.register(payload);
  });
}
