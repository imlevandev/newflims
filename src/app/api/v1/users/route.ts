import { type NextRequest } from "next/server";

import { handleRoute } from "@/server/common/http/route-handler";
import { UsersService } from "@/server/modules/users/users.service";
import { createUserSchema } from "@/server/modules/users/validators/create-user.validator";

const usersService = new UsersService();

export async function GET() {
  return handleRoute(() => usersService.listUsers());
}

export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    const payload = createUserSchema.parse(await request.json());
    return usersService.createUser(payload);
  });
}
