const DEFAULT_AUTH_ERROR_MESSAGE =
  "認証エラーが発生しました。時間をおいて再度お試しください。";

const AUTH_ERROR_MESSAGES = {
  anonymous_provider_disabled:
    "このサインイン方法は現在利用できません。別の方法をお試しください。",
  bad_code_verifier:
    "認証情報の検証に失敗しました。はじめからやり直してください。",
  bad_json: "リクエストの形式が正しくありません。入力内容をご確認ください。",
  bad_jwt: "認証情報が無効です。再度ログインしてください。",
  bad_oauth_callback:
    "外部サービスでの認証に失敗しました。もう一度お試しください。",
  bad_oauth_state: "認証状態の確認に失敗しました。もう一度お試しください。",
  captcha_failed: "認証に失敗しました。時間をおいて再度お試しください。",
  conflict: "処理が競合しました。しばらく待ってから再度お試しください。",
  email_address_invalid:
    "メールアドレスの形式が正しくありません。入力内容をご確認ください。",
  email_exists:
    "このメールアドレスはご利用いただけません。別のメールアドレスをお試しください。",
  email_not_confirmed:
    "メールアドレスの確認が完了していません。確認メールをご確認ください。",
  flow_state_expired:
    "認証リンクの有効期限が切れています。再度お手続きください。",
  flow_state_not_found: "認証リンクが無効です。再度お手続きください。",
  hook_payload_invalid_content_type:
    "認証処理に失敗しました。時間をおいて再度お試しください。",
  hook_payload_over_size_limit:
    "認証処理に失敗しました。時間をおいて再度お試しください。",
  hook_timeout:
    "認証処理がタイムアウトしました。時間をおいて再度お試しください。",
  hook_timeout_after_retry:
    "認証処理がタイムアウトしました。時間をおいて再度お試しください。",
  identity_already_exists:
    "この認証情報はすでに別のアカウントで使用されています。",
  identity_not_found: "認証情報が見つかりません。再度お試しください。",
  insufficient_aal:
    "追加の本人確認が必要です。案内に従って再度お試しください。",
  invalid_credentials: "メールアドレスまたはパスワードが正しくありません。",
  invalid_email:
    "メールアドレスの形式が正しくありません。入力内容をご確認ください。",
  invalid_grant:
    "認証情報が無効です。メールアドレスまたはパスワードをご確認ください。",
  invalid_mfa_factor: "多要素認証の設定が無効です。再度お試しください。",
  invalid_oauth_provider:
    "この外部認証プロバイダーは利用できません。別の方法をお試しください。",
  invalid_otp: "認証リンクまたは認証コードが無効です。再度お手続きください。",
  invalid_request:
    "リクエストが無効です。入力内容を確認して再度お試しください。",
  manual_linking_disabled:
    "アカウント連携は現在利用できません。別の方法をお試しください。",
  mfa_challenge_expired:
    "多要素認証の確認期限が切れています。再度お試しください。",
  mfa_factor_name_conflict: "同じ名前の多要素認証設定がすでに存在します。",
  mfa_factor_not_found:
    "多要素認証の設定が見つかりません。再度お試しください。",
  mfa_ip_address_mismatch:
    "多要素認証を確認できませんでした。再度お試しください。",
  mfa_phone_enroll_not_enabled: "電話番号での多要素認証は現在利用できません。",
  mfa_phone_verify_not_enabled: "電話番号での多要素認証は現在利用できません。",
  mfa_totp_enroll_not_enabled: "認証アプリでの多要素認証は現在利用できません。",
  mfa_totp_verify_not_enabled: "認証アプリでの多要素認証は現在利用できません。",
  mfa_verification_failed:
    "多要素認証コードを確認できませんでした。再度お試しください。",
  no_authorization: "認証が必要です。ログインしてから再度お試しください。",
  not_admin: "この操作を実行する権限がありません。",
  oauth_provider_not_supported:
    "この外部認証プロバイダーはサポートされていません。",
  otp_disabled: "この認証方法は現在利用できません。",
  otp_expired:
    "認証リンクまたは認証コードの有効期限が切れています。再度お手続きください。",
  over_email_send_rate_limit:
    "メールの送信回数が上限に達しました。しばらく待ってから再度お試しください。",
  over_request_rate_limit:
    "操作回数が上限に達しました。しばらく待ってから再度お試しください。",
  over_sms_send_rate_limit:
    "SMS の送信回数が上限に達しました。しばらく待ってから再度お試しください。",
  phone_exists:
    "この電話番号はご利用いただけません。別の電話番号をお試しください。",
  phone_not_confirmed:
    "電話番号の確認が完了していません。確認後に再度お試しください。",
  provider_disabled:
    "このサインイン方法は現在利用できません。別の方法をお試しください。",
  reauthentication_needed:
    "再認証が必要です。もう一度ログインしてからお試しください。",
  reauthentication_not_valid:
    "再認証に失敗しました。もう一度ログインしてからお試しください。",
  refresh_token_already_used:
    "セッションの更新に失敗しました。再度ログインしてください。",
  refresh_token_not_found:
    "セッションの更新に失敗しました。再度ログインしてください。",
  request_timeout:
    "通信がタイムアウトしました。時間をおいて再度お試しください。",
  same_password:
    "現在のパスワードとは異なる新しいパスワードを設定してください。",
  saml_assertion_no_email: "外部認証からメールアドレスを取得できませんでした。",
  saml_assertion_no_user_id: "外部認証からユーザー情報を取得できませんでした。",
  session_expired:
    "セッションの有効期限が切れています。再度ログインしてください。",
  session_not_found: "セッションが見つかりません。再度ログインしてください。",
  signup_disabled: "現在、新規登録は受け付けていません。",
  single_identity_not_deletable:
    "この認証情報は削除できません。別の認証方法を追加してください。",
  sms_send_failed: "SMS の送信に失敗しました。時間をおいて再度お試しください。",
  sso_domain_already_exists:
    "このドメインの SSO 設定はすでに登録されています。",
  sso_provider_not_found:
    "SSO 設定が見つかりません。管理者にお問い合わせください。",
  too_many_enrolled_mfa_factors: "多要素認証の登録数が上限に達しています。",
  unexpected_audience: "認証情報が無効です。再度ログインしてお試しください。",
  unexpected_failure:
    "認証処理で問題が発生しました。時間をおいて再度お試しください。",
  user_already_exists:
    "このアカウント情報はすでに使用されています。別の情報をお試しください。",
  user_banned:
    "このアカウントは現在利用できません。サポートにお問い合わせください。",
  user_not_found:
    "アカウントを確認できませんでした。入力内容をご確認ください。",
  weak_password:
    "パスワードが要件を満たしていません。より強力なパスワードを設定してください。",
} as const;

type AuthErrorCode = keyof typeof AUTH_ERROR_MESSAGES;

type SupabaseAuthErrorLike = {
  code?: string | null;
  status?: number;
};

function isAuthErrorLike(error: unknown): error is SupabaseAuthErrorLike {
  return typeof error === "object" && error !== null;
}

export function getAuthErrorCode(error: unknown): string | null {
  if (typeof error === "string") {
    return error.trim().toLowerCase() || null;
  }

  if (!isAuthErrorLike(error) || typeof error.code !== "string") {
    return null;
  }

  return error.code.trim().toLowerCase() || null;
}

export function getAuthErrorMessage(
  error: unknown,
  fallback = DEFAULT_AUTH_ERROR_MESSAGE,
): string {
  const code = getAuthErrorCode(error);

  if (code && code in AUTH_ERROR_MESSAGES) {
    return AUTH_ERROR_MESSAGES[code as AuthErrorCode];
  }

  if (isAuthErrorLike(error) && error.status === 429) {
    return AUTH_ERROR_MESSAGES.over_request_rate_limit;
  }

  return fallback;
}

export function toAuthErrorRedirectPath(error: unknown): string {
  const params = new URLSearchParams();
  const code = getAuthErrorCode(error);

  if (code) {
    params.set("error_code", code);
  }

  return params.size > 0 ? `/auth/error?${params.toString()}` : "/auth/error";
}

export { DEFAULT_AUTH_ERROR_MESSAGE };
