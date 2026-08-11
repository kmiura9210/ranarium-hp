/**
 * メール送信に失敗したときの管理者アラート。
 *
 * 設計上の要点 —— アラート経路を環境変数に依存させないこと。
 * 実際に CONTACT_FROM / RESERVE_FROM がデプロイで消えて送信が全滅した障害があり、
 * そのときアラートの差出人まで環境変数から取っていたら通知も同時に死んでいた。
 * そのため差出人はここにハードコードし、宛先も env が失われた場合に備えて
 * フォールバック先を持たせている。
 *
 * アラートには失敗した送信内容そのものを載せる。送信が失敗しても、
 * 問い合わせ・予約リクエストの内容が手元に残るようにするため。
 */

/** Resend で検証済みのドメイン。env に依存させない */
const ALERT_FROM = 'RANARIUM Alerts <noreply@rana-rium.com>';

/** ALERT_TO が未設定でも必ずどこかに届くようにする最終手段 */
const ALERT_FALLBACK_TO = 'info@rana-rium.com';

export interface AlertContext {
	/** どの機能で起きたか (例: 'RANARIUM お問い合わせフォーム') */
	source: string;
	/** Resend が返した HTTP ステータス。fetch 自体が失敗したなら null */
	status: number | null;
	/** Resend のエラー本文、または例外メッセージ */
	detail: string;
	/** 失われた送信内容。取りこぼしを防ぐため丸ごと載せる */
	lostSubmission: Record<string, string>;
}

const escapeHtml = (s: string) =>
	s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');

/**
 * 管理者にアラートメールを送る。
 * この関数は決して throw しない —— アラートの失敗で本来の処理を壊さないため。
 */
export async function alertMailFailure(
	apiKey: string,
	alertTo: string | undefined,
	ctx: AlertContext,
): Promise<void> {
	const to = alertTo?.trim() || ALERT_FALLBACK_TO;
	const at = new Date(Date.now() + 9 * 3600 * 1000)
		.toISOString()
		.replace('T', ' ')
		.slice(0, 19);

	const rows = Object.entries(ctx.lostSubmission);

	const text = [
		'メールの自動送信に失敗しました。下記の内容は相手に届いていません。',
		'',
		`■ 発生箇所: ${ctx.source}`,
		`■ 発生日時: ${at} (JST)`,
		`■ Resend の応答: ${ctx.status ?? '(応答なし / 通信失敗)'}`,
		`■ エラー詳細: ${ctx.detail}`,
		'',
		'── 届かなかった送信内容 ──',
		...rows.map(([k, v]) => `${k}: ${v || '(なし)'}`),
		'',
		'対応の目安:',
		'1. Resend のダッシュボードで API キーとドメイン検証の状態を確認する',
		'2. Cloudflare の Worker に環境変数が残っているか確認する',
		'   (平文変数は wrangler.jsonc の vars が正本。ダッシュボードで Text 追加した値はデプロイで消える)',
		'3. 上記の送信内容は失われているため、必要なら手動で対応する',
	].join('\n');

	const html = `
		<div style="font-family:Arial,'Helvetica Neue','Noto Sans JP',sans-serif;color:#1c2733;line-height:1.7;max-width:640px;">
			<p style="margin:0 0 16px;padding:12px 16px;background:#fee2e2;border-radius:4px;">
				<strong>メールの自動送信に失敗しました。</strong><br />下記の内容は相手に届いていません。
			</p>
			<table style="width:100%;border-collapse:collapse;margin:20px 0;">
				<tr><th style="text-align:left;padding:8px 12px;background:#f1f5f9;border-bottom:1px solid #cbd5e1;width:140px;">発生箇所</th><td style="padding:8px 12px;border-bottom:1px solid #cbd5e1;">${escapeHtml(ctx.source)}</td></tr>
				<tr><th style="text-align:left;padding:8px 12px;background:#f1f5f9;border-bottom:1px solid #cbd5e1;">発生日時</th><td style="padding:8px 12px;border-bottom:1px solid #cbd5e1;">${at} (JST)</td></tr>
				<tr><th style="text-align:left;padding:8px 12px;background:#f1f5f9;border-bottom:1px solid #cbd5e1;">Resend の応答</th><td style="padding:8px 12px;border-bottom:1px solid #cbd5e1;">${escapeHtml(String(ctx.status ?? '(応答なし / 通信失敗)'))}</td></tr>
				<tr><th style="text-align:left;padding:8px 12px;background:#f1f5f9;border-bottom:1px solid #cbd5e1;">エラー詳細</th><td style="padding:8px 12px;border-bottom:1px solid #cbd5e1;word-break:break-all;">${escapeHtml(ctx.detail)}</td></tr>
			</table>
			<h3 style="font-size:14px;margin:24px 0 12px;padding-left:12px;border-left:3px solid #dc2626;">届かなかった送信内容</h3>
			<table style="width:100%;border-collapse:collapse;">
				${rows
					.map(
						([k, v]) =>
							`<tr><th style="text-align:left;padding:8px 12px;background:#f8fafc;border-bottom:1px solid #e2e8f0;width:140px;vertical-align:top;">${escapeHtml(k)}</th><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;white-space:pre-wrap;">${escapeHtml(v || '(なし)')}</td></tr>`,
					)
					.join('')}
			</table>
			<h3 style="font-size:14px;margin:24px 0 12px;padding-left:12px;border-left:3px solid #64748b;">対応の目安</h3>
			<ol style="margin:0;padding-left:20px;font-size:13px;color:#475569;">
				<li>Resend のダッシュボードで API キーとドメイン検証の状態を確認する</li>
				<li>Cloudflare の Worker に環境変数が残っているか確認する<br />
					<span style="font-size:12px;">(平文変数は wrangler.jsonc の <code>vars</code> が正本。ダッシュボードで Text 追加した値はデプロイで消える)</span></li>
				<li>上記の送信内容は失われているため、必要なら手動で対応する</li>
			</ol>
		</div>
	`;

	try {
		const res = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				from: ALERT_FROM,
				to: [to],
				subject: `【アラート】メール送信に失敗しました — ${ctx.source}`,
				text,
				html,
			}),
		});
		if (!res.ok) {
			// アラート自体が失敗した場合、ここで再度アラートを送っても同じ理由で失敗する。
			// ログに残すだけに留める (Cloudflare の Real-time Logs / Logpush で拾う)
			console.error('[alert] failed to deliver alert:', res.status, await res.text());
		}
	} catch (err) {
		console.error('[alert] failed to deliver alert:', err);
	}
}
