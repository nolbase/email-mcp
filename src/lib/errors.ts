interface DispatchErrorLike {
  name: string;
  code: string;
  statusCode: number;
  message: string;
  details?: Record<string, unknown>;
}

function isDispatchError(error: unknown): error is DispatchErrorLike {
  return (
    error instanceof Error &&
    'code' in error &&
    'statusCode' in error &&
    typeof (error as DispatchErrorLike).code === 'string' &&
    typeof (error as DispatchErrorLike).statusCode === 'number'
  );
}

export function formatError(error: unknown): string {
  if (isDispatchError(error)) {
    const parts = [`Dispatch API error (${error.code}): ${error.message}`];

    if (error.statusCode) {
      parts.push(`HTTP status: ${error.statusCode}`);
    }

    if (error.details) {
      parts.push(`Details: ${JSON.stringify(error.details)}`);
    }

    return parts.join('\n');
  }

  if (error instanceof Error) {
    return `Error: ${error.message}`;
  }

  return `Unknown error: ${String(error)}`;
}
