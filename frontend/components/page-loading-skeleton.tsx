type PageLoadingSkeletonProps = {
  eyebrow: string
  title: string
  description?: string
}

export function PageLoadingSkeleton({
  eyebrow,
  title,
  description = 'Dang tai noi dung va du lieu trang, vui long cho trong giay lat.',
}: PageLoadingSkeletonProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(128,216,249,0.18),_rgba(255,255,255,0.98)_42%,_#ffffff_78%)] pt-28">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[32px] border border-[#80d8f9]/40 bg-white/90 p-6 shadow-[0_20px_60px_rgba(26,99,168,0.08)] backdrop-blur sm:p-8 lg:p-10">
          <div className="animate-pulse space-y-8">
            <div className="space-y-4">
              <div className="h-4 w-32 rounded-full bg-[#80d8f9]/60" />
              <div className="h-10 max-w-xl rounded-2xl bg-[#1a63a8]/12 sm:h-12" />
              <div className="h-5 max-w-2xl rounded-full bg-slate-200" />
              <div className="h-5 max-w-xl rounded-full bg-slate-200/80" />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 p-5">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-[#80d8f9]/55" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-24 rounded-full bg-slate-200" />
                    <div className="h-7 w-20 rounded-full bg-[#1a63a8]/12" />
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 p-5">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-[#80d8f9]/55" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-28 rounded-full bg-slate-200" />
                    <div className="h-7 w-24 rounded-full bg-[#1a63a8]/12" />
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 p-5">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-[#80d8f9]/55" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-20 rounded-full bg-slate-200" />
                    <div className="h-7 w-16 rounded-full bg-[#1a63a8]/12" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="space-y-4 rounded-[28px] border border-slate-200 p-5">
                <div className="h-64 rounded-[24px] bg-[linear-gradient(135deg,rgba(128,216,249,0.38),rgba(26,99,168,0.1))] sm:h-80" />
                <div className="space-y-3">
                  <div className="h-4 w-32 rounded-full bg-[#80d8f9]/55" />
                  <div className="h-5 w-full rounded-full bg-slate-200" />
                  <div className="h-5 w-5/6 rounded-full bg-slate-200/80" />
                </div>
              </div>

              <div className="space-y-4 rounded-[28px] border border-slate-200 p-5">
                <div className="h-12 w-full rounded-2xl bg-[#1a63a8]/10" />
                <div className="space-y-3">
                  <div className="h-4 w-full rounded-full bg-slate-200" />
                  <div className="h-4 w-11/12 rounded-full bg-slate-200" />
                  <div className="h-4 w-4/5 rounded-full bg-slate-200/80" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-28 rounded-3xl bg-[#80d8f9]/35" />
                  <div className="h-28 rounded-3xl bg-[#1a63a8]/10" />
                </div>
                <div className="h-11 w-full rounded-full bg-[linear-gradient(90deg,rgba(128,216,249,0.95),rgba(26,99,168,0.85))]" />
              </div>
            </div>
          </div>

          <div className="sr-only">
            {eyebrow} - {title}. {description}
          </div>
        </div>
      </div>
    </div>
  )
}
