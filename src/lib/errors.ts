import type { AxiosError } from "axios";
import type { ApiError } from "@/types/api";

export class AppError extends Error {
  status: number;
  errors?: Record<string, string>;

  constructor(message: string, status = 500, errors?: Record<string, string>) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.errors = errors;
  }
}

export function parseApiError(error: unknown): AppError {
  if (error instanceof AppError) return error;

  if (isAxiosError(error)) {
    const data = error.response?.data as ApiError | { message?: string } | undefined;
    const status = error.response?.status ?? 500;
    const message =
      (data && "message" in data && data.message) ||
      error.message ||
      "Une erreur est survenue";

    const errors =
      data && "errors" in data && data.errors
        ? (data.errors as Record<string, string>)
        : undefined;

    return new AppError(message, status, errors);
  }

  if (error instanceof Error) {
    return new AppError(error.message);
  }

  return new AppError("Une erreur inattendue est survenue");
}

function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as AxiosError).isAxiosError === true
  );
}

export function getFieldError(
  errors: Record<string, string> | undefined,
  field: string
): string | undefined {
  return errors?.[field];
}

export function getErrorMessage(error: unknown): string {
  return parseApiError(error).message;
}
