import { SafeInlineScript } from '@/components/safe-inline-code'
import { serializeJsonForScript } from '@/lib/security'

type SchemaScriptProps = {
  data: Record<string, unknown>;
};

export function SchemaScript({ data }: SchemaScriptProps) {
  return <SafeInlineScript code={serializeJsonForScript(data)} />
}
