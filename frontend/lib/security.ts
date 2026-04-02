const SCRIPT_ESCAPE_MAP: Record<string, string> = {
  '<': '\\u003C',
  '>': '\\u003E',
  '&': '\\u0026',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
}

export function serializeJsonForScript(data: unknown) {
  return JSON.stringify(data).replace(/[<>&\u2028\u2029]/g, (character) => SCRIPT_ESCAPE_MAP[character] ?? character)
}

export function sanitizeCssIdentifier(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, '_')
}

export function sanitizeCssValue(value?: string | null) {
  if (!value) return null

  const normalized = value.trim()
  return /^[#(),.%\s\w-]+$/.test(normalized) ? normalized : null
}
