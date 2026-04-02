import { serializeJsonForScript } from '@/lib/security'

type SchemaScriptProps = {
  data: Record<string, unknown>;
};

export function SchemaScript({ data }: SchemaScriptProps) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonForScript(data) }} />;
}
