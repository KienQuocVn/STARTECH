type SafeInlineStyleProps = {
  cssText: string
}

type SafeInlineScriptProps = {
  code: string
}

export function SafeInlineStyle({ cssText }: SafeInlineStyleProps) {
  return <style dangerouslySetInnerHTML={{ __html: cssText }} />
}

export function SafeInlineScript({ code }: SafeInlineScriptProps) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: code }} />
}
