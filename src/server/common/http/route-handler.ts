import { NextResponse } from "next/server";

import { AppError } from "../errors/app-error";
import { fail, ok } from "./api-response";

export async function handleRoute<T>(handler: () => Promise<T> | T) {
  try {
    const data = await handler();
    return NextResponse.json(ok(data));
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        fail(error.code, error.message, error.details),
        { status: error.statusCode },
      );
    }

    return NextResponse.json(
      fail("INTERNAL_ERROR", "Internal server error"),
      { status: 500 },
    );
  }
}
