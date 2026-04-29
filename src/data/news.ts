export type NewsArticle = {
  slug: string;
  date: string;          // ISO (YYYY-MM-DD)
  dateDisplay: string;   // 表示用 (YYYY.MM.DD)
  cat: string;           // カテゴリ
  title: string;
  desc: string;          // 一覧用の要約
  body: string;          // 本文 (HTML)
};

export const articles: NewsArticle[] = [
  {
    slug: 'launch',
    date: '2026-04-27',
    dateDisplay: '2026.04.27',
    cat: 'お知らせ',
    title: '法人設立 および ホームページ開設 のお知らせ',
    desc: 'この度、株式会社RANARIUMを設立し、コーポレートサイトを公開いたしました。RanaとAquariumを語源とする社名のとおり、Leapfrogが育つ水槽として、跳躍する事業を育てていきます。',
    body: `
      <p>
        平素より格別のお引き立てを賜り、誠にありがとうございます。
        この度、<strong>2026年4月27日付で株式会社RANARIUMを設立</strong>し、
        あわせてコーポレートサイトを公開いたしましたのでお知らせいたします。
      </p>

      <h2>社名に込めた想い</h2>
      <p>
        RANARIUMは、ラテン語でカエルを意味する <em>Rana</em> と、
        水槽を意味する <em>Aquarium</em> を組み合わせた造語です。
      </p>
      <p>
        AIをはじめとするテクノロジーの進化によって、これまで段階的に積み重ねてきた事業プロセスは、
        いま一足跳びに塗り替えられつつあります。私たちはその「リープフロッグ型成長」を、
        日本のより多くの事業で生み出していきたいと考えています。
      </p>
      <p>
        Leapfrog（カエル）が育つ水槽（Aquarium）として、
        AI・ITで「跳躍する事業」を育てていく ——
        それが、RANARIUMの目指す姿です。
      </p>

      <h2>提供するサービス</h2>
      <p>当面、以下3つの専門性を軸にサービスを提供いたします。</p>
      <ul>
        <li><strong>新規事業開発</strong> — ビジネスモデル設計から事業計画策定、投資家向け資料作成まで</li>
        <li><strong>プロダクト開発PdM</strong> — 要件定義・開発推進・グロース運用まで</li>
        <li><strong>AIコンサルティング</strong> — AI活用戦略から、PoC実装、運用定着まで</li>
      </ul>

      <h2>これから</h2>
      <p>
        私たちは「請け負う」のではなく、お客様の事業に深く踏み込み、共に跳躍を生み出すパートナーであり続けます。
        コンサルティングという立ち位置にとどまらず、自らも事業者としてリスクを取り、
        現場で得た知見をお客様の現場へ還元してまいります。
      </p>
      <p>
        まだ生まれたばかりの会社ですが、ご一緒できることを心より楽しみにしております。
        今後とも何卒よろしくお願い申し上げます。
      </p>

      <p class="news-signature">
        2026年4月27日<br/>
        株式会社RANARIUM<br/>
        代表取締役 三浦 耕樹
      </p>
    `,
  },
];

export const categories = ['すべて', 'お知らせ', 'プレスリリース', 'イベント'] as const;
