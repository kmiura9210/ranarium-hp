/**
 * POST /api/contact
 *
 * Astro API endpoint — お問い合わせフォーム送信
 * (Cloudflare Workers 上で実行)
 *
 * 環境変数 (Cloudflare Workers の Settings → Variables/Secrets で設定):
 *   - RESEND_API_KEY  : Resend の API キー (re_xxxxxxxx) ※ Secret 推奨
 *   - CONTACT_TO      : 送信先メールアドレス (例: info@rana-rium.com)
 *   - CONTACT_FROM    : 差出人 (例: "RANARIUM <noreply@rana-rium.com>")
 *                       Resend で domain verification を済ませた送信元を指定
 *                       未設定なら Resend のテスト用 onboarding@resend.dev を使用
 */

import type { APIRoute } from 'astro';
// Astro v6 + @astrojs/cloudflare では `cloudflare:workers` 経由で env を取得
import { env } from 'cloudflare:workers';
import { alertMailFailure } from '../../lib/alert';

export const prerender = false;

type ContactEnv = {
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
  /** 送信失敗を知らせる管理者アドレス。未設定なら alert.ts のフォールバック先 */
  ALERT_TO?: string;
};

interface ContactPayload {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
  privacy?: boolean | string;
  /** honeypot: ボット用の隠しフィールド。値が入っていればボットとみなす */
  website?: string;
}

const SERVICE_LABEL: Record<string, string> = {
  biz: '新規事業開発',
  pdm: 'プロダクト開発PdM',
  ai: 'AIコンサルティング',
  other: 'その他・複数のサービス',
};

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

export const POST: APIRoute = async ({ request }) => {
  const cfEnv = env as ContactEnv;

  // 診断用ログ (Cloudflare Real-time Logs で確認可能)
  console.log('[contact] env keys:', Object.keys(cfEnv));

  // ---- 1. リクエストの取り出し ----
  let payload: ContactPayload;
  try {
    const contentType = request.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      payload = await request.json();
    } else if (
      contentType.includes('application/x-www-form-urlencoded') ||
      contentType.includes('multipart/form-data')
    ) {
      const form = await request.formData();
      payload = Object.fromEntries(form) as ContactPayload;
    } else {
      return json({ error: 'unsupported content-type' }, 415);
    }
  } catch (_) {
    return json({ error: 'invalid request body' }, 400);
  }

  // ---- 2. Honeypot チェック ----
  if (payload.website && String(payload.website).trim() !== '') {
    return json({ ok: true }, 200);
  }

  // ---- 3. バリデーション ----
  const name = (payload.name ?? '').toString().trim();
  const company = (payload.company ?? '').toString().trim();
  const email = (payload.email ?? '').toString().trim();
  const phone = (payload.phone ?? '').toString().trim();
  const service = (payload.service ?? '').toString().trim();
  const message = (payload.message ?? '').toString().trim();
  const privacy =
    payload.privacy === true ||
    payload.privacy === 'on' ||
    payload.privacy === 'true';

  const errors: string[] = [];
  if (!name) errors.push('お名前は必須です');
  if (!company) errors.push('会社名は必須です');
  if (!email) errors.push('メールアドレスは必須です');
  else if (!isValidEmail(email)) errors.push('メールアドレスの形式が正しくありません');
  if (!message) errors.push('お問い合わせ内容は必須です');
  if (!privacy) errors.push('プライバシーポリシーへの同意が必要です');

  if (
    name.length > 100 ||
    company.length > 200 ||
    email.length > 200 ||
    phone.length > 50 ||
    message.length > 5000
  ) {
    errors.push('入力文字数が上限を超えています');
  }

  if (errors.length > 0) {
    return json({ error: 'validation failed', details: errors }, 400);
  }

  // ---- 4. 環境変数チェック ----
  const apiKey = cfEnv.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY is not configured. env keys:', Object.keys(cfEnv));
    return json({ error: 'server misconfigured', detail: 'RESEND_API_KEY missing' }, 500);
  }

  // ---- 5. メール本文の組み立て ----
  const serviceLabel = SERVICE_LABEL[service] ?? '未選択';
  const submittedAt = new Date().toISOString();
  const subject = `【お問い合わせ】${name}様 / ${company}`;

  const textBody = [
    'コーポレートサイトからお問い合わせがありました。',
    '',
    `■ お名前: ${name}`,
    `■ 会社名: ${company}`,
    `■ メール: ${email}`,
    `■ 電話番号: ${phone || '(未入力)'}`,
    `■ ご興味のあるサービス: ${serviceLabel}`,
    '',
    '■ お問い合わせ内容',
    message,
    '',
    `送信日時: ${submittedAt}`,
  ].join('\n');

  const htmlBody = `
    <div style="font-family: Arial, 'Helvetica Neue', 'Noto Sans JP', sans-serif; color: #1d1d1f; line-height: 1.7; max-width: 640px;">
      <p style="margin: 0 0 16px;">コーポレートサイトからお問い合わせがありました。</p>
      <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
        <tr><th style="text-align: left; padding: 10px 12px; background: #f5f5f7; border-bottom: 1px solid #d2d2d7; width: 140px; vertical-align: top;">お名前</th>
            <td style="padding: 10px 12px; border-bottom: 1px solid #d2d2d7;">${escapeHtml(name)}</td></tr>
        <tr><th style="text-align: left; padding: 10px 12px; background: #f5f5f7; border-bottom: 1px solid #d2d2d7; vertical-align: top;">会社名</th>
            <td style="padding: 10px 12px; border-bottom: 1px solid #d2d2d7;">${escapeHtml(company)}</td></tr>
        <tr><th style="text-align: left; padding: 10px 12px; background: #f5f5f7; border-bottom: 1px solid #d2d2d7; vertical-align: top;">メール</th>
            <td style="padding: 10px 12px; border-bottom: 1px solid #d2d2d7;"><a href="mailto:${escapeHtml(email)}" style="color: #1d1d1f;">${escapeHtml(email)}</a></td></tr>
        <tr><th style="text-align: left; padding: 10px 12px; background: #f5f5f7; border-bottom: 1px solid #d2d2d7; vertical-align: top;">電話番号</th>
            <td style="padding: 10px 12px; border-bottom: 1px solid #d2d2d7;">${escapeHtml(phone || '(未入力)')}</td></tr>
        <tr><th style="text-align: left; padding: 10px 12px; background: #f5f5f7; border-bottom: 1px solid #d2d2d7; vertical-align: top;">サービス</th>
            <td style="padding: 10px 12px; border-bottom: 1px solid #d2d2d7;">${escapeHtml(serviceLabel)}</td></tr>
      </table>
      <h3 style="font-size: 14px; margin: 24px 0 12px; padding-left: 12px; border-left: 3px solid #1d1d1f;">お問い合わせ内容</h3>
      <div style="white-space: pre-wrap; padding: 16px; background: #f5f5f7; border-radius: 4px;">${escapeHtml(message)}</div>
      <p style="font-size: 12px; color: #86868b; margin: 32px 0 0;">送信日時: ${submittedAt}</p>
    </div>
  `;

  // ---- 6. Resend API 呼び出し ----
  const to = cfEnv.CONTACT_TO ?? 'info@rana-rium.com';
  const from = cfEnv.CONTACT_FROM ?? 'onboarding@resend.dev';

  // 送信が失われても問い合わせ内容が手元に残るよう、アラートに載せる中身
  const lostSubmission = {
    'お名前': name,
    '会社名': company,
    'メール': email,
    '電話番号': phone,
    'サービス': serviceLabel,
    'お問い合わせ内容': message,
  };

  let failure: { status: number | null; detail: string } | null = null;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject,
        text: textBody,
        html: htmlBody,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error('[contact] resend failed:', res.status, detail);
      failure = { status: res.status, detail };
    }
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error('[contact] resend error:', detail);
    failure = { status: null, detail };
  }

  if (failure) {
    await alertMailFailure(apiKey, cfEnv.ALERT_TO, {
      source: 'RANARIUM お問い合わせフォーム',
      status: failure.status,
      detail: failure.detail,
      lostSubmission,
    });
    return json({ error: 'failed to send email' }, 502);
  }

  return json({ ok: true }, 200);
};
