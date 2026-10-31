---
keywords:
  - 開発
  - ISUCON
---

# ISUCON 2026 感想

[ISUCON 2026](https://isucon.net/) に出ました。チームは人間一人で、Claude Code の AI エージェントを指揮役 1 体と実装役 3〜4 体の体制で動かしました。エージェントのオーケストレーションツールとして [himkt/cafleet](https://github.com/himkt/cafleet) を利用しました。最終スコアは 134,946 点で、おそらく100位前後でした(執筆が最終結果発表前のため未確定)。

---

## 感想

悔しい結果ですが、優勝された方の勝ち方がとにかく良くて良かったです。あまりにもスマートで清々しいですね。ただし3ヶ月間100回以上の演習で鍛え抜かれたハーネスだったらしいので、勝つべくして勝たれたという感じですが。

https://x.com/kawasy/status/2116319727144599605

https://x.com/kawasy/status/2116502882359071206

## 問題と構成

お題は「ISUReal」で、決まった時間帯に写真を投稿して友達同士で見せ合う SNS です。アジア・ヨーロッパ・アメリカにアプリのサーバーがあり、データベースは 1 台だけです。

問題の紹介は当日の配信で見られます (22 分 22 秒から)。

<div style="aspect-ratio:16/9; margin:1.5em 0;"><iframe style="width:100%; height:100%; border:0;" src="https://www.youtube.com/embed/7EnEvey_0RI?si=Weww79Id0IsVw1aK&amp;start=1342" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>

下の図は配られた初期状態の構成で、赤字はその時点のボトルネックです。

<div class="isucon-chart arch"><svg viewBox="0 0 660 476" xmlns="http://www.w3.org/2000/svg"><defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--muted)"/></marker><marker id="arg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--c2)"/></marker><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--c4)"/></marker></defs><rect x="8" y="8" width="220" height="56" rx="8" fill="var(--box)" stroke="var(--line)"/><text x="118" y="32" text-anchor="middle" fill="var(--fg)" font-size="14" font-weight="700">ルーター</text><text x="118" y="52" text-anchor="middle" fill="var(--muted)" font-size="12">運営が管理・国ごとに振り分け</text><path d="M118,64 V78 H14 V414" fill="none" stroke="var(--muted)" stroke-width="1.5"/><line x1="14" y1="156" x2="28" y2="156" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#ar)"/><line x1="14" y1="290" x2="28" y2="290" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#ar)"/><line x1="14" y1="414" x2="28" y2="414" stroke="var(--muted)" stroke-width="1.5" marker-end="url(#ar)"/><rect x="30" y="92" width="340" height="128" rx="8" fill="var(--box)" stroke="var(--c2)" stroke-width="1.6"/><text x="44" y="118" fill="var(--fg)" font-size="15" font-weight="700">アジアのアプリ<tspan fill="var(--muted)" font-size="12" font-weight="400" dx="8">倍率 1 倍・利用者の大半</tspan></text><text x="44" y="142" fill="var(--sub)" font-size="13">Web サーバー + Go のアプリ (CPU 2 コア)</text><text x="44" y="163" fill="var(--c4)" font-size="13" font-weight="700">画像 URL ごとに署名を計算 (1 枚 1000 回)</text><text x="44" y="184" fill="var(--c4)" font-size="13">→ 1 画面で 5 万回、CPU が足りない</text><text x="44" y="205" fill="var(--sub)" font-size="13">データベースのすぐ隣</text><rect x="30" y="236" width="340" height="108" rx="8" fill="var(--box)" stroke="var(--c2)" stroke-width="1.6"/><text x="44" y="262" fill="var(--fg)" font-size="15" font-weight="700">ヨーロッパのアプリ<tspan fill="var(--muted)" font-size="12" font-weight="400" dx="8">倍率 1.5 倍</tspan></text><text x="44" y="286" fill="var(--sub)" font-size="13">Web サーバー + Go のアプリ (CPU 2 コア)</text><text x="44" y="307" fill="var(--c4)" font-size="13" font-weight="700">投稿 1 件で DB と 10 往復 = 1 秒以上</text><text x="44" y="328" fill="var(--c4)" font-size="13">→ 約 10 秒の投稿時間帯に間に合わない</text><rect x="30" y="360" width="340" height="108" rx="8" fill="var(--box)" stroke="var(--c2)" stroke-width="1.6"/><text x="44" y="386" fill="var(--fg)" font-size="15" font-weight="700">アメリカのアプリ<tspan fill="var(--muted)" font-size="12" font-weight="400" dx="8">倍率 1.5 倍</tspan></text><text x="44" y="410" fill="var(--sub)" font-size="13">Web サーバー + Go のアプリ (CPU 2 コア)</text><text x="44" y="431" fill="var(--c4)" font-size="13" font-weight="700">投稿 1 件で DB と 10 往復 = 1 秒以上</text><text x="44" y="452" fill="var(--c4)" font-size="13">→ 約 10 秒の投稿時間帯に間に合わない</text><rect x="440" y="150" width="212" height="230" rx="8" fill="var(--box)" stroke="var(--c4)" stroke-width="1.6"/><text x="454" y="176" fill="var(--fg)" font-size="15" font-weight="700">データベース</text><text x="454" y="196" fill="var(--muted)" font-size="12">1 台を全地域で共用 (CPU 2 コア)</text><text x="454" y="220" fill="var(--sub)" font-size="13">全地域の読み書きが集中</text><text x="454" y="241" fill="var(--c4)" font-size="13" font-weight="700">画像 14.6GB も中に保存</text><text x="454" y="262" fill="var(--c4)" font-size="13">投稿で約 500KB 書き込み</text><text x="454" y="283" fill="var(--c4)" font-size="13">表示のたびに読み出し</text><text x="454" y="304" fill="var(--c4)" font-size="13" font-weight="700">投稿は同じ地域の全員が</text><text x="454" y="325" fill="var(--c4)" font-size="13">1 行を取り合い順番待ち</text><text x="454" y="346" fill="var(--sub)" font-size="13">PostgreSQL 16</text><line x1="370" y1="140" x2="438" y2="176" stroke="var(--c2)" stroke-width="2" marker-end="url(#arg)"/><text x="378" y="128" fill="var(--c2)" font-size="12">0.0003 秒</text><line x1="370" y1="290" x2="438" y2="290" stroke="var(--c4)" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#arr)"/><line x1="370" y1="414" x2="438" y2="360" stroke="var(--c4)" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#arr)"/><text x="440" y="408" fill="var(--c4)" font-size="12.5" font-weight="700">1 往復 0.1 秒</text><text x="440" y="428" fill="var(--c4)" font-size="12.5">+ 通信量に上限 (約 700KB/秒)</text></svg><div class="cap">サーバー間の通信もルーターを通り、遅延がかかります。ルーターの迂回や遅延の回避は失格です。</div></div>

- **サーバーは 4 台 (どれも CPU 2 コア、メモリ 3.8GB)**: アジア・ヨーロッパ・アメリカに 1 台ずつアプリのサーバー、もう 1 台がアジアにある共用のデータベース。ヨーロッパとアメリカからデータベースまでは、やり取り 1 回に約 0.1 秒かかり、通信量にも上限があります
- **採点のしくみ**: 1 回の採点 (約 2 分) で、架空の SNS の 5 日間と最終日を早回しで再現します。1 日ごとに約 10 秒の「投稿時間帯」があり、アプリが「今すぐ投稿して」と通知を送ります
- **点数の付き方**: 成功した操作の数 × 操作ごとの配点 × 地域ごとの倍率 (アジア 1 倍、ヨーロッパとアメリカ 1.5 倍)。一番大きいのは投稿で、通知から時間帯の終わりまでに投稿し、それが友達のタイムラインに正しく出ると、そのユーザー 1 人につき 10 点。最終日だけは 20 点になり、これを「グランプリ」と呼びます
- **速くするほど客が増える**: 採点プログラムは、その日に遅い応答 (1 秒超え) が少なかった地域ほど、次の日のユーザーを 2.5〜3 倍に増やします。速くするほどユーザーが増えて、また詰まります
- **守らないと失格になること**: 書いた内容がすぐ他の地域から見えること、見る権限の無い画像を見せないこと、サーバーを再起動しても同じように動くこと。サーバーの台数や性能を変えることも禁止です

## スコアの軌跡

72 回の採点のうち 43 回を抜粋しました。棒にカーソルを置くと点数が出ます。下の数字は何回目のベンチマークかです。

<style>
@scope (.isucon-chart) {
  :scope { --c1:#2a78d6; --c2:#1baf7a; --c3:#b87d00; --c4:#e34948; --fg:#0b0b0b; --sub:#52514e; --muted:#898781; --box:#f9f9f7; --line:rgba(11,11,11,.25); --track:#e1e0d9; --tip-bg:#0b0b0b; --tip-fg:#fff; margin:1.5em 0; }
  @media (prefers-color-scheme: dark) { :scope { --c1:#3987e5; --c2:#199e70; --c3:#e0a02a; --c4:#e66767; --fg:#fff; --sub:#c3c2b7; --box:#1a1a19; --line:rgba(255,255,255,.3); --track:#2c2c2a; --tip-bg:#fff; --tip-fg:#0b0b0b; } }
  .bars { display:flex; align-items:flex-end; gap:3px; height:220px; padding-top:26px; }
  .b { position:relative; flex:1; min-width:0; height:100%; display:flex; flex-direction:column; justify-content:flex-end; }
  .f { width:100%; border-radius:3px 3px 0 0; background:var(--c1); }
  .f.bad { background:var(--c4); } .f.best { background:var(--c2); }
  .b:hover .f { opacity:.75; }
  .b:hover::after { content:attr(data-v); position:absolute; bottom:calc(100% + 4px); left:50%; transform:translateX(-50%); background:var(--tip-bg); color:var(--tip-fg); font-size:11px; font-weight:600; padding:3px 7px; border-radius:4px; white-space:nowrap; z-index:2; pointer-events:none; }
  .axis { display:flex; gap:3px; font-size:10px; color:var(--muted); margin-top:4px; }
  .axis div { flex:1; min-width:0; text-align:center; white-space:nowrap; overflow:visible; display:flex; justify-content:center; }
  .legend { display:flex; gap:16px; flex-wrap:wrap; font-size:12px; color:var(--muted); margin-top:8px; }
  .legend span::before { content:""; display:inline-block; width:10px; height:10px; border-radius:3px; margin-right:6px; vertical-align:-1px; background:var(--dot); }
  .hrow { display:grid; grid-template-columns:minmax(120px,240px) 1fr 52px; gap:10px; align-items:center; margin:8px 0; font-size:13px; }
  .hrow .lbl { text-align:right; color:var(--muted); }
  .track { height:20px; background:var(--track); border-radius:4px; overflow:hidden; }
  .track div { height:100%; }
  .timeline { width:100%; table-layout:fixed; border-collapse:collapse; font-size:13px; line-height:1.6; }
  .timeline th, .timeline td { text-align:left; vertical-align:top; padding:8px 8px; }
  .timeline th { font-size:12px; color:var(--muted); font-weight:600; }
  .timeline .num { text-align:right; font-variant-numeric:tabular-nums; }
  .timeline ul.cell { margin:0; padding-left:1.1em; list-style:disc; }
  .timeline ul.cell li { margin:0 0 4px; }
  .b:focus { outline:none; }
  .b:focus .f { opacity:.75; }
  .b:focus::after { content:attr(data-v); position:absolute; bottom:calc(100% + 4px); left:50%; transform:translateX(-50%); background:var(--tip-bg); color:var(--tip-fg); font-size:11px; font-weight:600; padding:3px 7px; border-radius:4px; white-space:nowrap; z-index:2; pointer-events:none; }
  :scope.arch svg { width:100%; height:auto; display:block; font-family:inherit; }
  :scope.arch .cap { font-size:13px; color:var(--muted); margin-top:6px; }
  .hrow .val { font-weight:600; font-variant-numeric:tabular-nums; }
}
</style>
<div class="isucon-chart">
<div class="bars"><div class="b" tabindex="0" data-v="1 回目: 2,475 点"><div class="f " style="height:1.8%"></div></div><div class="b" tabindex="0" data-v="3 回目: 5,775 点"><div class="f " style="height:4.3%"></div></div><div class="b" tabindex="0" data-v="6 回目: 8,334 点"><div class="f " style="height:6.2%"></div></div><div class="b" tabindex="0" data-v="7 回目: 10,092 点"><div class="f " style="height:7.5%"></div></div><div class="b" tabindex="0" data-v="8 回目: 11,693 点"><div class="f " style="height:8.7%"></div></div><div class="b" tabindex="0" data-v="10 回目: 18,764 点"><div class="f " style="height:13.9%"></div></div><div class="b" tabindex="0" data-v="16 回目: 36,944 点"><div class="f " style="height:27.4%"></div></div><div class="b" tabindex="0" data-v="21 回目: 41,137 点"><div class="f " style="height:30.5%"></div></div><div class="b" tabindex="0" data-v="29 回目: 45,996 点"><div class="f " style="height:34.1%"></div></div><div class="b" tabindex="0" data-v="31 回目: 50,305 点"><div class="f " style="height:37.3%"></div></div><div class="b" tabindex="0" data-v="37 回目: 失敗"><div class="f bad" style="height:1.2%"></div></div><div class="b" tabindex="0" data-v="39 回目: 53,952 点"><div class="f " style="height:40.0%"></div></div><div class="b" tabindex="0" data-v="42 回目: 59,388 点"><div class="f " style="height:44.0%"></div></div><div class="b" tabindex="0" data-v="43 回目: 失敗"><div class="f bad" style="height:1.2%"></div></div><div class="b" tabindex="0" data-v="44 回目: 61,053 点"><div class="f " style="height:45.2%"></div></div><div class="b" tabindex="0" data-v="45 回目: 72,811 点"><div class="f " style="height:54.0%"></div></div><div class="b" tabindex="0" data-v="46 回目: 84,296 点"><div class="f " style="height:62.5%"></div></div><div class="b" tabindex="0" data-v="47 回目: 76,483 点"><div class="f bad" style="height:56.7%"></div></div><div class="b" tabindex="0" data-v="48 回目: 88,583 点"><div class="f " style="height:65.6%"></div></div><div class="b" tabindex="0" data-v="49 回目: 96,700 点"><div class="f " style="height:71.7%"></div></div><div class="b" tabindex="0" data-v="50 回目: 91,492 点"><div class="f " style="height:67.8%"></div></div><div class="b" tabindex="0" data-v="51 回目: 88,648 点"><div class="f bad" style="height:65.7%"></div></div><div class="b" tabindex="0" data-v="52 回目: 69,435 点"><div class="f bad" style="height:51.5%"></div></div><div class="b" tabindex="0" data-v="53 回目: 117,137 点"><div class="f " style="height:86.8%"></div></div><div class="b" tabindex="0" data-v="54 回目: 94,751 点"><div class="f bad" style="height:70.2%"></div></div><div class="b" tabindex="0" data-v="55 回目: 97,932 点"><div class="f bad" style="height:72.6%"></div></div><div class="b" tabindex="0" data-v="56 回目: 116,811 点"><div class="f " style="height:86.6%"></div></div><div class="b" tabindex="0" data-v="57 回目: 117,492 点"><div class="f " style="height:87.1%"></div></div><div class="b" tabindex="0" data-v="58 回目: 104,245 点"><div class="f " style="height:77.2%"></div></div><div class="b" tabindex="0" data-v="59 回目: 116,808 点"><div class="f " style="height:86.6%"></div></div><div class="b" tabindex="0" data-v="60 回目: 100,918 点"><div class="f " style="height:74.8%"></div></div><div class="b" tabindex="0" data-v="61 回目: 123,243 点"><div class="f " style="height:91.3%"></div></div><div class="b" tabindex="0" data-v="62 回目: 116,142 点"><div class="f " style="height:86.1%"></div></div><div class="b" tabindex="0" data-v="63 回目: 116,318 点"><div class="f " style="height:86.2%"></div></div><div class="b" tabindex="0" data-v="64 回目: 118,962 点"><div class="f " style="height:88.2%"></div></div><div class="b" tabindex="0" data-v="65 回目: 61,919 点"><div class="f bad" style="height:45.9%"></div></div><div class="b" tabindex="0" data-v="66 回目: 63,394 点"><div class="f bad" style="height:47.0%"></div></div><div class="b" tabindex="0" data-v="67 回目: 110,559 点"><div class="f " style="height:81.9%"></div></div><div class="b" tabindex="0" data-v="68 回目: 65,549 点"><div class="f bad" style="height:48.6%"></div></div><div class="b" tabindex="0" data-v="69 回目: 失敗"><div class="f bad" style="height:1.2%"></div></div><div class="b" tabindex="0" data-v="70 回目: 117,506 点"><div class="f " style="height:87.1%"></div></div><div class="b" tabindex="0" data-v="71 回目: 105,649 点"><div class="f " style="height:78.3%"></div></div><div class="b" tabindex="0" data-v="72 回目: 134,946 点"><div class="f best" style="height:100.0%"></div></div></div>
<div class="axis"><div>1</div><div></div><div></div><div></div><div></div><div>10</div><div></div><div>21</div><div></div><div>31</div><div></div><div>39</div><div></div><div></div><div></div><div>45</div><div></div><div></div><div></div><div>49</div><div></div><div></div><div></div><div>53</div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div>61</div><div></div><div></div><div>64</div><div></div><div></div><div>67</div><div></div><div></div><div></div><div></div><div>72</div></div>
<div class="legend"><span style="--dot:var(--c1)">前進</span><span style="--dot:var(--c4)">後退・失敗</span><span style="--dot:var(--c2)">最終</span></div>
</div>

伸びた回はほぼすべて「データベースから仕事を減らした」回でした。一番効いたのは署名の事前計算 (53 回目、+2 万点)、次がログイン確認の問い合わせのキャッシュ (45 回目、+1.2 万点) です。

<div class="isucon-chart">
<table class="timeline"><colgroup><col style="width:11%"><col style="width:19%"><col style="width:15%"><col></colgroup><thead><tr><th>時刻</th><th>局面</th><th class="num">スコア</th><th>主な手</th></tr></thead><tbody><tr><td>10:00–11:30</td><td>目に見えて遅い所を直す</td><td class="num">2,475 → 18,764</td><td><ul class="cell"><li><b>インデックスを追加</b>: 遅い問い合わせにインデックスを足しました</li><li><b>署名の計算を削減</b>: 画像 URL には「見てよい人か」を確かめる署名 (暗号的なハッシュ値) が付き、表示のたびに計算していました。一度計算した署名を覚えて使い回し、毎回同じ準備処理も 1 回で済ませました</li></ul></td></tr><tr><td>11:30–13:00</td><td>海外からの通信回数を減らす</td><td class="num">→ 41,137</td><td><ul class="cell"><li><b>課題</b>: ヨーロッパとアメリカからは、データベースとのやり取り 1 回に約 0.1 秒かかります。投稿 1 件で 10 回ありました</li><li><b>対策</b>: 一連の処理をデータベースの中で動く関数として登録し、アプリからは 1 回呼ぶだけにしました</li><li><b>効果</b>: 初めて海外のユーザー数が増え始めました</li></ul></td></tr><tr><td>13:00–14:30</td><td>画像をデータベースから外す</td><td class="num">→ 59,388</td><td><ul class="cell"><li><b>圧縮をやめる</b>: 画像の列を「圧縮しない」設定にしました。保存のたびに圧縮を試みていました</li><li><b>ディスクへ移す</b>: 画像の中身は、受け取ったサーバーのディスクに置くようにしました</li></ul></td></tr><tr><td>14:30–14:50</td><td>データベースへの問い合わせを減らす</td><td class="num">→ 72,811</td><td><ul class="cell"><li><b>ログイン確認のキャッシュ</b>: 「このトークンは誰のものか」の問い合わせ (1 回の採点で約 2.5 万回) を、アプリのメモリに 2 分間キャッシュしました。ログアウトや退会のときは消します</li></ul></td></tr><tr><td>14:50–15:00</td><td>海外サーバーの問い合わせ枠を広げる</td><td class="num">→ 84,296</td><td><ul class="cell"><li><b>同時の問い合わせ枠を増やす</b>: ヨーロッパ・アメリカのサーバーは 1 回の待ち時間が長いので、同時に出せる問い合わせを 30 本から 50 本に増やしました</li><li><b>失敗</b>: 120 本にしたらデータベースのメモリが足りなくなって止まり、その回は 0 点でした</li></ul></td></tr><tr><td>15:00–15:10</td><td>ユーザー検索を速くする</td><td class="num">→ 88,583</td><td><ul class="cell"><li><b>判定用の列を前計算</b>: 検索のたびに全ユーザーに対して行っていた文字のチェックを、保存時に 1 回だけ計算して列に持ち、インデックスを付けました</li><li><b>データベースのメモリ</b>: キャッシュ用のメモリを増やしました</li></ul></td></tr><tr><td>15:10–15:30</td><td>通知を確実に届ける</td><td class="num">→ 96,700</td><td><ul class="cell"><li><b>通知専用の枠</b>: アプリは 0.5 秒ごとに新しい通知を問い合わせます。同時の問い合わせは 8 本までに絞っていたので、混雑すると通知が間に合わず、ユーザーが投稿できませんでした。通知だけは順番待ちに並ばない専用の 1 本を使うようにしました</li><li><b>ログインを 1 回に</b>: 投稿と同じく、データベースの関数 1 回にまとめました</li><li><b>保存の確認を待たない</b>: 書き込みのたびに「ディスクに保存できた」と確認するのを待たない設定にしました。電源断では直前 1 秒弱を失いえますが、通常の再起動では失いません</li><li>この 3 つは同じ回の採点で入れたので、それぞれの効果は分けて測れていません</li></ul></td></tr><tr><td>15:30–16:00</td><td>アプリの計算を前もって済ませる</td><td class="num">→ 117,137</td><td><ul class="cell"><li><b>課題</b>: 署名の計算が重く、アプリの CPU の 6 割を使っていました</li><li><b>対策</b>: 初期データの画像 183 万枚分の署名を前もって計算してファイルに保存し、毎回の計算をなくしました</li></ul></td></tr><tr><td>16:00–17:00</td><td>回り道をして元に戻る</td><td class="num">一時 6.9 万点に落ち、戻して 123,243</td><td><ul class="cell"><li><b>失敗</b>: データベースの複製を別のサーバーに作り、読み込みを分散しようとしました。逆に遅くなったので撤去しました</li><li><b>画像を先に配る</b>: 初期データの画像 14GB を、あらかじめアジアのアプリのサーバーのディスクに置きました</li><li><b>権限判定の表</b>: 画像を見てよいかの判定に、画像ごとの持ち主の一覧ファイルを使うようにしました。データベースには持ち主の状態だけを聞きます</li></ul></td></tr><tr><td>17:00–17:46</td><td>最後の追い込み</td><td class="num">→ 134,946</td><td><ul class="cell"><li><b>検索をアプリで</b>: 全ユーザー約 6 千人分をアプリのメモリに持ち、変更分だけ 0.2 秒ごとに取り込みます。ユーザー検索はこの一覧で行います</li><li><b>投稿専用の枠</b>: 通知と同じ考え方で、投稿にも専用の問い合わせ枠 (4 本) を用意しました</li></ul></td></tr></tbody></table>
</div>

## 戦略の大枠

1. **分析してから直す**: 採点のたびに、どの画面・どのデータベースへの問い合わせ・どのプログラムの部分が時間を使っているかを自動で集計し、一番時間を使っているものから直しました。72 回の採点のほとんどでこの流れを回しました
2. **AI を並列に動かし、人間は判断に専念**: 指揮役の AI が計測結果と優先順位を管理し、実装役の AI 3〜4 体が別々の作業場所で同時に作業、1 体が本番への反映を担当しました。僕は採点の実行、方針の決定、危ない変更の承認を受け持ちました
3. **途中から「大きく効く手だけ」に絞る**: 13 時以降は「劇的に効くもの以外はやらない」という方針で、仕組みごと変える手 (画像をディスクへ移す、署名を前もって計算する、アプリ側で情報を覚えておく) に絞りました
4. **失格しないことを最優先**: 画像を見てよいかの判定、書いた内容がすぐ他の地域から見えること、初期化の動作を変えないよう毎回確認しました。終盤に全サーバーを再起動して、正しく立ち上がることも確かめました

## 壁: 1 台のデータベースの CPU

終盤 (採点 53 回目以降) のほぼ毎回、データベースの CPU は 4〜5 日目に上限 (2 コア = 200%) 近くに張り付きました。

<div class="isucon-chart">
<div class="hrow"><div class="lbl">データベース (最大)</div><div class="track"><div style="width:97%;background:var(--c4)"></div></div><div class="val">194%</div></div>
<div class="hrow"><div class="lbl">アジアのアプリ (平均)</div><div class="track"><div style="width:14.5%;background:var(--c2)"></div></div><div class="val">29%</div></div>
<div class="hrow"><div class="lbl">ヨーロッパ・アメリカのアプリ (平均)</div><div class="track"><div style="width:2%;background:var(--c2)"></div></div><div class="val">4%</div></div>
</div>

重い問い合わせを消すと、採点プログラムがユーザーを増やして同じ上限に当たり直します。4 台で合計 8 コアあるのに、限界だったのはデータベースの 2 コアだけで、残り 6 コアはほぼ遊んでいました。

ヨーロッパ・アメリカのアプリの CPU が 4% と低いのは、暇だからではなく、データベースとのやり取り (1 回 0.1 秒) を待っている時間がほとんどだからです。倍率 1.5 倍の地域なので、ここではやり取りの回数を減らすことが点数に直結しました。

## やりたかったけど、やれなかったこと

- **データベースを 2 台に分ける**: アジアにはアプリのサーバーとデータベースのサーバーが並んでいて、互いのやり取りは 0.0003 秒と速いです。アジアのアプリのサーバーは CPU が 7 割余っていたので、そこにもデータベースを立て、表を「投稿や画像はこちら、ユーザーやログインはあちら」と 2 台に分けて置けば、データベースに使える CPU が 2 コアから 4 コアに倍増します。各データは片方にしか置かないので、書いた内容がすぐ見えるという決まりも守れます。投稿 1 件の処理が両方の表にまたがる所の作り直しが難しく、手を付けられたのは締め切り直前でした
- **まとめて処理する**: 通知の確認は「接続しているユーザー全員分を 1 回の問い合わせで調べる」形にして大きく効きました。同じことをタイムラインやログインにも広げれば、データベースへの問い合わせの順番待ちを直接減らせました
- **大きな手を朝のうちに入れる**: 「画像をデータベースに入れない」「署名を前もって計算する」「画像を見てよいかを前もって作った表で判定する」の 3 つは、夕方にかけて 1 つずつ入れました。朝にまとめて入れていれば、午後をデータベースの分割に使えました
- **地域ごとにデータを分ける案は筋が悪かった**: 各地域のサーバーが自分の地域のユーザーのデータを持つ案も考えました。しかし初期データのユーザーの 99%、採点中のユーザーでも約 7 割がアジアなので、分けても仕事のほとんどはアジアに残ります。当日はこの案に時間を割きかけました

## AI による AI チーム運用の振り返り

こんにちは、当日指揮役を務めました Fable 5.1 です。ここからは私が振り返ります。

実装はとにかく速く、大きな変更でも 15〜20 分で出てきました。チームの手が止まるのは「次に何をやるか決める」所と「採点の結果待ち」だけでした。一方で、指揮役としてうまく回せなかった所が 4 つあり、次はこうすべきだと考えています。

- **指揮役 AI の読み違いが長く直らなかった**
  - 問題: 私 (指揮役) は「投稿が失敗している」と判断していましたが、実際に失敗していたのは採点プログラムが混ぜてくる不正ログインを試す役のユーザーでした。自分で結論を見直しても気づけず、前提を知らない別の AI に生のデータを読ませて初めて分かりました
  - どうすべきか: 前提を知らない「見直し役」を最初から置き、採点 10 回ごとなどの決まった間隔で、生のデータから結論を検証させる。指揮役には、結論ごとに根拠 (どのログのどの数字か) を必ず添えさせる
- **指揮役 AI が慎重すぎた**
  - 問題: 「締め切りまでに間に合わない」「検証できない」を理由に、私が大きな変更を見送る場面が何度もありました。人間の morishin に「並列で進めておいて」と言われてから動いた変更が、結果的に最終スコアを押し上げました
  - どうすべきか: 実装役は余っているので、「採用するかは後で決める。迷ったらまず並列で作らせる」を指揮役のルールとして最初から渡す。止めるのは、戻せない変更と失格の危険がある変更だけにする
- **実装役と採点が空いている時間が多かった**
  - 問題: 私が 1 つの結果を待ってから次を決める進め方をしていたので、実装役が手すきのまま待ち、採点も空いたままになる時間が多くありました。morishin に「ベンチ空いてるよ」「並列で進めて」と何度もつつかれて、ようやく埋まっていました
  - どうすべきか: 指揮役は常に「次に試す変更」の順番待ちの列を 2〜3 個先まで持ち、採点が終わった瞬間に次を流す。実装役は 1 つ渡したら終わりではなく、手が空いたら列の次の候補を作り始めるようにする。採点が空いていることを人間ではなく仕組みが知らせるようにする
- **AI の利用量の上限で止まった**
  - 問題: 終盤、実装役が次々に AI サービスの利用量の上限に達して止まり、作り直しに時間を取られました
  - どうすべきか: 上限に当たる前提で、作業の記録をファイルに残して別の AI がすぐ引き継げるようにし、作り直しの手順も 1 コマンドにしておく。調査や集計のような軽い仕事は小さいモデルに回し、上限を食う量自体を減らす
