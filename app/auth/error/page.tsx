import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DEFAULT_AUTH_ERROR_MESSAGE,
  getAuthErrorCode,
  getAuthErrorMessage,
} from "@/lib/supabase/auth-error";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error_code?: string }>;
}) {
  const params = await searchParams;
  const errorCode = getAuthErrorCode(params?.error_code);
  const errorMessage = errorCode
    ? getAuthErrorMessage(errorCode)
    : DEFAULT_AUTH_ERROR_MESSAGE;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">エラーが発生しました</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">{errorMessage}</p>
              {errorCode ? (
                <p className="text-muted-foreground mt-3 text-xs">
                  エラーコード: {errorCode}
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
