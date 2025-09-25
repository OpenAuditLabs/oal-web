/**
 * Helper utilities for unwrapping next-safe-action results where the action
 * returns a numeric payload (e.g. counts / stats).
 */

// Shapes we minimally care about from next-safe-action
export type ValidationErrors = {
  formErrors?: string[]
  fieldErrors?: Record<string, string[]>
}

export type SafeSuccessNumber = { data: number }
export type SafeErrorShape = { serverError?: string; validationErrors?: ValidationErrors }
export type PossibleNumberResult = number | SafeSuccessNumber | SafeErrorShape | undefined

function isSuccessNumber(obj: PossibleNumberResult): obj is SafeSuccessNumber {
  return typeof obj === 'object' && obj !== null && 'data' in obj && typeof (obj as { data?: unknown }).data === 'number'
}

/**
 * Attempts to extract a number from a variety of possible action return shapes.
 * Returns null if no valid number payload present.
 */
export function extractNumber(result: PossibleNumberResult): number | null {
  if (typeof result === 'number') return result
  if (isSuccessNumber(result)) return result.data
  return null
}

/**
 * Same as extractNumber but returns an object containing error info if present.
 */
export function unwrapNumber(result: PossibleNumberResult): { value: number | null; error?: string } {
  if (typeof result === 'number') return { value: result }
  if (isSuccessNumber(result)) return { value: result.data }

  const serverError = typeof result === 'object' && result ? (result as SafeErrorShape).serverError : undefined
  const formErrors = typeof result === 'object' && result ? (result as SafeErrorShape).validationErrors?.formErrors?.join(', ') : undefined
  return { value: null, error: serverError || formErrors }
}
