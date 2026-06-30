import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { AppError } from "../errors/app-error";
import { fail, ok } from "./api-response";

export async function handleRoute<T>(handler: () => Promise<T> | T) {
  try {
    const data = await handler();
    return NextResponse.json(ok(data));
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        fail("VALIDATION_ERROR", error.issues[0]?.message || "Validation failed", error.issues),
        { status: 400 },
      );
    }

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
