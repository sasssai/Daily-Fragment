import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// ログイン済みのユーザーに表示される画面で使用される、ローディングコンポーネントの例です
// アプリ画面に合わせて適宜カスタマイズしてください
export default function Loading() {
  return (
    <div className="flex w-full flex-1 flex-col gap-8">
      <div className="space-y-4">
        <Skeleton className="h-10 w-56 sm:h-12 sm:w-72" />
        <Skeleton className="h-4 w-full max-w-2xl" />
        <Skeleton className="h-4 w-3/4 max-w-xl" />
      </div>

      <Card>
        <CardHeader className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-7 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <Skeleton className="h-9 w-28" />
        </CardContent>
      </Card>
    </div>
  );
}
