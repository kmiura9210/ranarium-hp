from pathlib import Path
from html import escape
import json

ROOT = Path(__file__).parent
OUT = ROOT / 'dist'
# Set these only after the salon's actual booking URLs have been issued.
BOOKING = {'ja': '', 'en': ''}

copy = {
 'ja': {
  'title':'Lakka 赤坂｜ドライヘッドスパ・イヤーエステ',
  'description':'赤坂のプライベートサロンLakka。ドライヘッドスパとイヤーエステで、忙しい日常にひと息を。溜池山王駅から徒歩1分。',
  'nav':['Lakkaについて','メニュー','アクセス'], 'book':'ご予約',
  'eyebrow':'AKASAKA · PRIVATE RELAXATION SALON',
  'hero':'頭を休める。<br>わたしに、戻る。',
  'intro':'考えごとの多い日も、がんばりすぎた日も。<br>頭と耳から、静かな休息を。<br>赤坂の小さな個室サロン、Lakka。',
  'explore':'施術を見てみる', 'caption':'静けさを描いたイメージイラスト',
  'facts':['完全個室','男性もご利用いただけます','溜池山王駅 徒歩1分'],
  'aboutlabel':'A LITTLE TIME FOR YOURSELF', 'abouttitle':'何もしない時間が、<br>今日のごほうび。',
  'about':'画面を見続けた一日。予定を詰め込んだ週末。<br>日常の慌ただしさから少し離れて、自分のための時間を。<br>周りを気にせず過ごせる個室で、頭や耳を丁寧にケアします。',
  'menuhead':'心地よさの、選び方。', 'menunote':'代表的な初回メニューをご紹介します。掲載価格は税込。ご新規様限定の料金です。',
  'menus':[
   ['01','DRY HEAD SPA','ドライヘッドスパ','水を使わず、頭をほぐすリラクゼーション。忙しい日の合間に、目を閉じてひと休み。','50分','¥5,980'],
   ['02','EAR CARE','イヤーエステ','耳かきと耳ほぐしを組み合わせたケア。初めての方にも、施術内容をお伝えしてから始めます。','50分','¥5,980'],
   ['03','HEAD & EAR','ヘッドスパ ＋ 耳かき','頭も耳も、ゆっくりと。ふたつのケアを一度に楽しみたい方へ。','75分','¥10,980']],
  'menufine':'料金・内容はHOT PEPPER Beauty掲載情報をもとにしています。最新情報は掲載ページをご確認ください。',
  'flowhead':'初めての方へ。', 'flow':[
   ['お好みのケアを選ぶ','メニューと所要時間を目安に、過ごしたい時間をお選びください。'],
   ['ご来店・カウンセリング','施術前にご希望や気になることをお聞かせください。'],
   ['個室で、ゆっくりと','力加減などのご希望は、施術中も遠慮なくお伝えください。']],
  'faqhead':'よくあるご質問', 'faq':[
   ['男性も利用できますか？','はい、男性のお客様もご利用いただけます。'],
   ['ヘッドスパで髪を濡らしますか？','ドライヘッドスパは、水を使わずに行う頭のケアです。'],
   ['英語での対応はできますか？','スタッフは主に日本語で対応します。外国語でのやり取りには翻訳ツールを使用します。'],
   ['クレジットカードは使えますか？','Visa、Mastercard、JCB、American Express、Diners Club、Discoverが掲載されています。']],
  'accesshead':'街の中に、ひと息つく場所。', 'address':'東京都港区赤坂2-8-13<br>赤坂こうゆうビル 901号室',
  'route':'溜池山王駅11番出口から徒歩1分。地上に出て右へ進み、約100m先の右側にある白いエントランスのビルへ。奥のエレベーターで9階にお越しください。',
  'hours':'平日 12:00–22:00 ／ 土日 10:00–20:00', 'closed':'不定休・完全予約制', 'map':'Googleマップで見る',
  'closing':'ひと息つく時間を、<br>あなたの予定に。', 'bookingtitle':'オンライン予約は準備中です',
  'bookingtext':'新しい予約ページを準備しています。この画面からは予約できません。',
  'existing':'現在の店舗掲載情報を見る', 'close':'閉じる', 'prepared':'予約ページ準備中', 'footer':'ドライヘッドスパ & イヤーエステ',
 },
 'en': {
  'title':'Lakka Akasaka | Private Dry Head Spa & Ear Care in Tokyo',
  'description':'A quiet moment in Akasaka, Tokyo. Discover private dry head spa and ear care at Lakka. Japanese-speaking staff communicate using translation tools.',
  'nav':['The experience','Treatments','Find us'], 'book':'Book a visit',
  'eyebrow':'AKASAKA, TOKYO · A MOMENT TO YOURSELF',
  'hero':'A quieter kind<br>of Tokyo.',
  'intro':'Close your eyes. Take a little time for yourself.<br>Private dry head spa and ear care in Akasaka,<br>for days in the city and everyday life here.',
  'explore':'Find your treatment', 'caption':'An illustration inspired by a moment of calm',
  'facts':['A private treatment room','Men welcome','1 min from Tameike-sanno Station'],
  'aboutlabel':'YOUR FIRST VISIT, MADE SIMPLE', 'abouttitle':'Settle in.<br>We’ll take it slowly.',
  'about':'New to Japanese head spa or ear care? We explain what to expect before your treatment. Our staff speak Japanese and use translation tools to communicate with international guests.',
  'menuhead':'Choose your moment of calm.', 'menunote':'A short guide to our selected first-visit treatments. All prices include tax and apply to first-time guests.',
  'menus':[
   ['01','NO WATER · HEAD MASSAGE','Dry head spa','A relaxing head massage without water. An easy pause between plans, or a little time away from your everyday routine.','50 min','¥5,980'],
   ['02','EAR CLEANING & MASSAGE','Ear care','Ear cleaning combined with massage around the ears. If this is new to you, ask us to explain the treatment before we begin.','50 min','¥5,980'],
   ['03','TWO TREATMENTS, ONE VISIT','Head spa + ear cleaning','Take a longer break with a combination of head spa and ear cleaning in a private setting.','75 min','¥10,980']],
  'menufine':'Prices and treatment details are based on the salon’s HOT PEPPER Beauty listing and may change. Please confirm when booking.',
  'flowhead':'A little preparation. A calmer visit.', 'flow':[
   ['Choose your treatment','Compare the treatment, duration and total price. Ear care and head spa are different experiences.'],
   ['Tell us what feels right','We use translation tools for your consultation. Tell us your preferences before the treatment starts.'],
   ['Make yourself comfortable','You can ask for lighter pressure or a pause at any time. We will agree on a simple signal before starting.']],
  'faqhead':'Before you visit', 'faq':[
   ['Do your staff speak English?','Our staff mainly speak Japanese. We use translation tools to communicate with international guests, including during the consultation.'],
   ['Is this a hair wash or a haircut?','No. Our dry head spa is a head massage without water. It is a relaxation treatment, not a haircut.'],
   ['Can men book a treatment?','Yes. Men are welcome at Lakka.'],
   ['Can I pay by card?','The salon lists Visa, Mastercard, JCB, American Express, Diners Club and Discover.'],
   ['Do I need a Japanese phone number to book?','Our new booking page is being prepared. International phone number support has not yet been confirmed.']],
  'accesshead':'A quiet stop.<br>Right here in Akasaka.', 'address':'Room 901, Akasaka Koyu Building<br>2-8-13 Akasaka, Minato-ku, Tokyo',
  'route':'From Exit 11 of Tameike-sanno Station, turn right at street level. Walk about 100 metres to the building with a white entrance on your right. Take the elevator inside to the 9th floor, Room 901.',
  'hours':'Mon–Fri 12:00–22:00 / Sat–Sun 10:00–20:00', 'closed':'By appointment · Irregular closing days', 'map':'Open in Google Maps',
  'closing':'Make room<br>for a little quiet.', 'bookingtitle':'Online booking is coming soon',
  'bookingtext':'We’re preparing our new booking page. This preview does not accept reservations.',
  'existing':'View salon listing (Japanese)', 'close':'Close', 'prepared':'Booking page coming soon', 'footer':'PRIVATE HEAD SPA & EAR CARE · TOKYO',
 }
}

def render(lang):
 c=copy[lang]; alt='en' if lang=='ja' else 'ja'
 nav=''.join(f'<a href="#{id}">{text}</a>' for id,text in zip(['experience','treatments','access'],c['nav']))
 cards=''.join(f'<article class="treatment"><span class="number">{n}</span><p class="eyebrow">{tag}</p><h3>{name}</h3><p>{desc}</p><div class="price"><span>{time}</span><strong>{price}</strong></div><button class="text-link" data-book>{c["book"]} <span aria-hidden="true">↗</span></button></article>' for n,tag,name,desc,time,price in c['menus'])
 steps=''.join(f'<article><span class="step">0{i}</span><h3>{t}</h3><p>{d}</p></article>' for i,(t,d) in enumerate(c['flow'],1))
 faq=''.join(f'<details><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>' for q,a in c['faq'])
 return f'''<!doctype html>
<html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{c['title']}</title><meta name="description" content="{c['description']}"><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#243e34"><link rel="icon" href="../assets/icon.svg" type="image/svg+xml"><link rel="stylesheet" href="../assets/style.css"><script defer src="../assets/app.js"></script></head>
<body><a class="skip" href="#main">{'本文へ' if lang=='ja' else 'Skip to content'}</a>
<header><a class="logo" href="./" aria-label="Lakka home">Lakka<span>AKASAKA</span></a><nav aria-label="{'メインナビゲーション' if lang=='ja' else 'Main navigation'}">{nav}</nav><div class="header-actions"><div class="languages"><a href="../ja/" lang="ja" {'aria-current="page"' if lang=='ja' else ''}>JP</a><span>/</span><a href="../en/" lang="en" {'aria-current="page"' if lang=='en' else ''}>EN</a></div><button class="button small" data-book>{c['book']} <span aria-hidden="true">↗</span></button></div></header>
<main id="main"><section class="hero"><div class="hero-copy"><p class="eyebrow">{c['eyebrow']}</p><h1>{c['hero']}</h1><p class="intro">{c['intro']}</p><a class="text-link" href="#treatments">{c['explore']} <span aria-hidden="true">↓</span></a><span class="hero-index">01 — THE ART OF SLOWING DOWN</span></div><figure class="hero-art"><img src="../assets/calm.svg" alt="" width="800" height="960"><figcaption>{c['caption']}</figcaption><span class="art-stamp" aria-hidden="true">REST.<br>RESET.<br>RETURN.</span></figure></section>
<div class="facts">{''.join(f'<span><i aria-hidden="true">✳</i> {f}</span>' for f in c['facts'])}</div>
<section class="experience section" id="experience"><div><p class="eyebrow">{c['aboutlabel']}</p><h2>{c['abouttitle']}</h2></div><div class="experience-copy"><span class="botanic" aria-hidden="true">❧</span><p>{c['about']}</p><p class="signature">A soft pause, in the heart of Tokyo.</p></div></section>
<section class="menus section" id="treatments"><div class="section-heading"><div><p class="eyebrow">THE TREATMENTS</p><h2>{c['menuhead']}</h2></div><p>{c['menunote']}</p></div><div class="treatment-grid">{cards}</div><p class="fine">{c['menufine']}</p></section>
<section class="flow section"><p class="eyebrow">GOOD TO KNOW</p><h2>{c['flowhead']}</h2><div class="steps">{steps}</div></section>
<section class="faq section"><div><p class="eyebrow">QUESTIONS & ANSWERS</p><h2>{c['faqhead']}</h2></div><div>{faq}</div></section>
<section class="access section" id="access"><div class="location-art"><span class="eyebrow">MINATO-KU · TOKYO</span><span class="location-name">Akasaka.</span><div class="station"><span>11</span> TAMEIKE-SANNO<br><small>EXIT 11 · WALK 1 MIN</small></div><div class="route-line" aria-hidden="true"></div><div class="map-lakka">✳ Lakka <small>9F · ROOM 901</small></div><p>{'アクセスの概念図（縮尺なし）' if lang=='ja' else 'Schematic guide · not to scale'}</p></div><div class="access-copy"><p class="eyebrow">FIND YOUR WAY TO US</p><h2>{c['accesshead']}</h2><address>{c['address']}</address><p>{c['route']}</p><div class="hours">{c['hours']}<br>{c['closed']}</div><a class="text-link" href="https://www.google.com/maps/search/?api=1&query=Lakka%20%E8%B5%A4%E5%9D%822-8-13" target="_blank" rel="noopener">{c['map']} ↗</a></div></section>
<section class="closing"><p class="eyebrow">YOUR QUIET MOMENT AWAITS</p><h2>{c['closing']}</h2><button class="button light" data-book>{c['book']} <span aria-hidden="true">↗</span></button><p class="fine">{c['prepared']}</p></section></main>
<footer><a class="logo" href="./">Lakka<span>AKASAKA</span></a><p>{c['footer']}</p><div class="languages"><a href="../ja/" lang="ja">日本語</a><span>/</span><a href="../en/" lang="en">English</a></div><small>© Lakka</small></footer>
<dialog aria-labelledby="booking-title"><button class="dialog-close" aria-label="{c['close']}" data-close>×</button><p class="eyebrow">LAKKA · RESERVATIONS</p><h2 id="booking-title">{c['bookingtitle']}</h2><p>{c['bookingtext']}</p><a class="text-link" href="https://beauty.hotpepper.jp/kr/slnH000614849/" target="_blank" rel="noopener">{c['existing']} ↗</a><button class="button" data-close>{c['close']}</button></dialog>
<script type="application/json" id="booking-config">{json.dumps({'url':BOOKING[lang]})}</script></body></html>'''

for lang in copy:
 (OUT/lang).mkdir(parents=True, exist_ok=True)
 (OUT/lang/'index.html').write_text(render(lang))
(OUT/'index.html').write_text('<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=ja/"><title>Lakka Akasaka</title><a href="ja/">日本語</a> · <a href="en/">English</a></html>')
(OUT/'robots.txt').write_text('User-agent: *\nDisallow: /\n')
print('Built Japanese and English pages.')
