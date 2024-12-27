export class ChatError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number
  ) {
    super(message);
    this.name = 'ChatError';
  }
}

export function isChatError(error: unknown): error is ChatError {
  return error instanceof ChatError;
}

export function getErrorMessage(error: unknown): string {
  if (isChatError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}