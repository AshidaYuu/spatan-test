import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Play, RotateCcw, CheckCircle, XCircle, Trophy, Settings, BookOpen, Shuffle, ListOrdered, Volume2, Edit2, Clock, Download, Layers, Eye, ThumbsUp, ThumbsDown, Library, Keyboard, Repeat, AlertCircle, Sparkles, Users } from 'lucide-react';
import { RAW_DATA_STOCK_3000 } from './data/stock3000';
import { RAW_DATA_TARGET_1200 } from './data/target1200';
import { RAW_DATA_TARGET_1400 } from './data/target1400';
import { RAW_DATA_TARGET_1900 } from './data/target1900';
import { RAW_DATA_JUNIOR_HIGH_IDIOMS } from './data/junior_high_idioms';
import { RAW_DATA_SUTASAPU_IDIOMS } from './data/sutasapu_idioms';
import StudentManager from './components/StudentManager';
import HistoryView from './components/HistoryView';
import { getStudentMistakes, saveStudentMistakes, saveTestResult } from './utils/storage';

// ==========================================
// 1. データセット定義
// ==========================================

// --- データセット1: 英単語マスター 800 ---
const RAW_DATA_MASTER_800 = `1be〜である、いる、ある、存在する[ビー]
2become〜になる、成る[ビカム]
3go行く、いく[ゴー]
4come来る、くる[カム]
5doする、行う[ドゥ]
6play(スポーツなどを)する,遊ぶ,演奏する,弾く[プレイ]
7enjoy楽しむ、たのしむ[エンジョイ]
8open開ける 開いている、あける[オープン]
9close閉じる 親密な、近い、とじる、閉める、しめる[クローズ]
10ask尋ねる、頼む、たずねる、たのむ[アスク]
11answer答える、答え、こたえる[アンサー]
12stand立っている、立つ、たつ[スタンド]
13sit座っている、座る、すわる[シット]
14takeとる、〜に持って[連れていく]、取る[テイク]
15bring持っていく[連れていく]くる、もたらす[ブリング]
16give与える、出す、あげる[ギブ]
17practice練習する、れんしゅうする[プラクティス]
18study勉強する、研究する、べんきょうする[スタディ]
19learn学ぶ、習得する、まなぶ[ラーン]
20see見る、会う、みる、あう[シー]
21look見る、（形容詞を伴い）〜に見える、みる[ルック]
22watch見る 腕時計、みる、ウォッチ[ウォッチ]
23meet出会う、会う、であう、あう[ミート]
24hear聞く、聞こえる、きく、聴く[ヒア]
25listen聴く、聞く、きく[リスン]
26like好んでいる、〜のような、好き、すき[ライク]
27love愛している、大好きである、愛、あい[ラブ]
28have持っている、食べる、経験する、もっている[ハブ]
29hold（一時的に）持つ、保持する、開催する、もつ[ホールド]
30catchとらえる、つかむ、捕まえる、キャッチ[キャッチ]
31get得る、〜になる、手に入れる[ゲット]
32buy買う、かう[バイ]
33drink飲む、飲み物、のむ[ドリンク]
34eat食べる、たべる[イート]
35make作る、〜を…にする、つくる[メイク]
36cook料理する、作る、料理人、つくる[クック]
37say言う、いう[セイ]
38tell話す、伝える、はなす、つたえる[テル]
39speak話す、はなす[スピーク]
40talk話す、はなす[トーク]
41think思っている、考える、おもう、かんがえる[シンク]
42feel感じている、〜だと思う、〜の感じがする、感じる、かんじる[フィール]
43walk歩く、あるく[ウォーク]
44run走る、はしる[ラン]
45swim泳ぐ、およぐ[スイム]
46sing歌う、うたう[シング]
47wash洗う、あらう[ウォッシュ]
48cleanきれいにする、そうじする、きれいな、掃除する[クリーン]
49read読む、よむ[リード]
50write書く、かく[ライト]
51find見つける、〜とわかる、みつける[ファインド]
52put置く、おく[プット]
53know知っている、しっている[ノウ]
54thank感謝する[サンク]
55want欲している、ほしい、欲しい[ウォント]
56need必要としている、必要、ひつよう[ニード]
57help助ける、手伝う、助け、たすける、てつだう[ヘルプ]
58leave去る、残す、〜のままにする、さる、のこす[リーブ]
59try試す、努力する、ためす[トライ]
60work働く、仕事、作品、はたらく[ワーク]
61use使う、使用、使いみち、つかう[ユース]
62change変わる、変える、変化、つり銭、かわる、かえる[チェンジ]
63show見せる、案内する、みせる[ショウ]
64call呼ぶ、電話をかける、よぶ[コール]
65live住んでいる、生きている、すんでいる[リブ]
66visit訪問する、訪れる、おとずれる[ビジット]
67fly飛ぶ、飛ばす、とぶ[フライ]
68start始まる、始める、はじまる、はじめる[スタート]
69stop止まる、止める、やめる、とまる、とめる[ストップ]
70stayとどまる、滞在する、滞在[ステイ]
71beautiful美しい、心地よい、見事だ、うつくしい、綺麗、きれい[ビューティフル]
72prettyきれい、感じがいい、かわいい、かなり、綺麗、可愛い[プリティ]
73cuteかわいい、可愛い[キュート]
74big大きい、おおきい[ビッグ]
75large大きい、おおきい[ラージ]
76little小さな、かわいらしい、ちいさな[リトル]
77small小さい、ちいさい[スモール]
78cold寒い、冷たい、風邪、さむい、つめたい[コールド]
79cool涼しい、ほどよく冷たい、かっこいい、すずしい[クール]
80warm暖かい、温かい、あたたかい[ウォーム]
81hot暑い、熱い、辛い、あつい[ホット]
82high高い、高く、たかい[ハイ]
83low低い、低く、ひくい[ロウ]
84tall背の高い、高い、たかい[トール]
85long長い、ながい[ロング]
86short短い、不足している、みじかい[ショート]
87old古い、年をとった、〜歳（年）の、ふるい[オールド]
88new新しい、あたらしい[ニュー]
89young若い、わかい[ヤング]
90good良い、ためになること、よい、いい[グッド]
91great偉大な、すばらしい、大きな、凄い、すごい[グレイト]
92nice良い、よい、ナイス[ナイス]
93wonderfulすばらしい、驚嘆すべき、素晴らしい[ワンダフル]
94fine良い、（天気や体調などが）悪くない、よい、元気[ファイン]
95bad良くない、悪い、わるい[バッド]
96happy楽しい、幸福な、うれしい、幸運な、幸せ、しあわせ[ハッピー]
97gladうれしい、嬉しい[グラッド]
98sad悲しい、かなしい[サッド]
99sorry気の毒に思って、すまないと思って、残念に思って、ごめんなさい[ソーリー]
100dear親愛なる、愛する人[ディア]
101tired疲れている、飽きている、つかれた、疲れた[タイアード]
102hungryお腹がすいている、空腹、はらぺこ[ハングリー]
103thirstyのどが渇いている、喉が渇いた[サースティ]
104manyたくさんの、多くの、数多くの[メニー]
105muchたくさんの、多くの、多量の[マッチ]
106someいくらかの、ある〜[サム]
107right正しい、右の、正解、右、みぎ[ライト]
108wrong間違った、調子が悪い、間違い[ロング]
109busy忙しい、いそがしい[ビジー]
110free自由な、ひまな、無料の、じゆう[フリー]
111allすべての、全部、ぜんぶ[オール]
112everyどの〜も、毎〜、あらゆる[エブリ]
113anyどんな〜でも[エニー]
114next次の、来〜、となりの、つぎの[ネクスト]
115last最後の、この前の、さいごの[ラスト]
116white白い、しろい、白、しろ[ホワイト]
117black黒い、くろい、黒、くろ[ブラック]
118red赤い、あかい、赤、あか[レッド]
119blue青い、あおい、青、あお[ブルー]
120green緑色の、みどり、緑[グリーン]
121yellow黄色の、きいろ、黄色[イエロー]
122not〜ない[ノット]
123up上に［へ］、うえ[アップ]
124down下に［へ］、した[ダウン]
125out外に［へ・で］、そと[アウト]
126backうしろへ［に］、戻る、背中[バック]
127forward前方へ［に］、前へ[フォワード]
128hereここに［へ・で］、ここ[ヒア]
129thereそこに［へ・で］、そこ[ゼア]
130justちょうど、ただ[ジャスト]
131now今、いま[ナウ]
132ago〜前に、まえに[アゴー]
133thenその時、それから、そのとき[ゼン]
134today今日、きょう[トゥデイ]
135yesterdayきのう、昨日[イエスタデイ]
136tomorrowあす、将来、明日、あした[トゥモロー]
137tonight今夜、こんや[トゥナイト]
138laterあとで、より遅く、後で[レイター]
139a.m.午前、ごぜん[エーエム]
140p.m.午後、ごご[ピーエム]
141too～も（また）、～すぎる[トゥー]
142also～もまた（同様に）[オルソー]
143veryとても、非常に[ベリー]
144well上手に、よく／健康で[ウェル]
145hard一生懸命に、激しく、硬い、かたい[ハード]
146againふたたび、また、再び[アゲイン]
147alwaysいつも、常に[オールウェイズ]
148usuallyたいてい、ふつう、普通[ユージュアリー]
149oftenよく、たびたび、しばしば[オフン]
150sometimes時々、ときどき[サムタイムズ]
151homeわが家に、故郷に、家、いえ[ホーム]
152away離れて[アウェイ]
153outside外に（で・は）、外、そと[アウトサイド]
154almostほとんど[オールモスト]
155still依然として、まだ[スティル]
156really本当に、ほんとうに[リアリー]
157together一緒に、いっしょに[トゥギャザー]
158pleaseどうぞ／喜ばせる、お願いします[プリーズ]
159let’s～しよう[レッツ]
160early早く、早い、はやく、はやい[アーリー]
161late遅く、遅れて／遅い、おそく、おそい[レイト]
162a / an（不特定の）あるひとつの、〜ごとに[ア/アン]
163theその（訳さないことが多い）[ザ]
164I私は、わたし[アイ]
165youあなたは、あなたたちは[ユー]
166he彼は、かれ[ヒー]
167she彼女は、かのじょ[シー]
168we私たちは、わたしたち[ウィー]
169they彼らは、彼女らは、それらは[ゼイ]
170itそれは[イット]
171thisこれは、この、これを[ディス]
172thatあれは、それは、あの、あれを[ザット]
173theseこれらは（の・を）[ディーズ]
174thoseあれらは（の・を）、それらは（の・を）[ゾーズ]
175what何、どんなもの（こと）、何の、どんな、なに[ワット]
176whoだれ、誰[フー]
177whoseだれの（もの）、誰の[フーズ]
178whichどれ、どちら、どの、どちらの[ウィッチ]
179whenいつ[ウェン]
180whereどこ[ウェア]
181whyなぜ、なんで[ホワイ]
182howどのように、どう、どれくらい[ハウ]
183at～で［に］、～めがけて[アット]
184in～（の中）に［で］、中、なか[イン]
185for～に向けて、～のために、～の間[フォー]
186to～へ［に］、～まで[トゥー]
187on～（の上）に、～に（曜日や日付）、上、うえ[オン]
188off～から離れて、オフ[オフ]
189of～（の中で）の、～について[オブ]
190with～と（一緒に）、～を持って[ウィズ]
191from～から、～で[フロム]
192by～のそばに、～までに、～で、～によって[バイ]
193near～の近くに、ちかく[ニア]
194after～のあとに、～したあとで、後、あと[アフター]
195before～の前に、～する前に、前、まえ[ビフォー]
196over～の真上に、～を越えて[オーバー]
197under～の下に、～未満、下、した[アンダー]
198about～について、～のあたりに、約[アバウト]
199around～の周りに、～のあたりに、約、まわり[アラウンド]
200family家族、かぞく[ファミリー]
201parent親、おや[ペアレント]
202father父、ちち、お父さん[ファーザー]
203mother母、はは、お母さん[マザー]
204brother兄弟、きょうだい、兄、弟[ブラザー]
205sister姉妹、しまい、姉、妹[シスター]
206son息子、むすこ[サン]
207daughter娘、むすめ[ドーター]
208grandfather祖父、おじいさん[グランドファーザー]
209grandmother祖母、おばあさん[グランドマザー]
210uncleおじ、叔父、伯父[アンクル]
211auntおば、叔母、伯母[アント]
212cousinいとこ、従兄弟[カズン]
213child子ども、こども[チャイルド]
214kid子ども(childのくだけた表現)、こども、キッズ[キッド]
215house家、いえ[ハウス]
216bath入浴、浴室、お風呂、ふろ[バス]
217bedベッド、寝台[ベッド]
218doorドア、玄関、1軒、扉、とびら[ドア]
219floor床、（建物の）階、ゆか[フロア]
220room部屋、空間、余地、へや[ルーム]
221window窓、まど[ウィンドウ]
222wall壁、塀、かべ[ウォール]
223garden庭園、菜園、庭、にわ[ガーデン]
224desk机、つくえ[デスク]
225tableテーブル、表[テーブル]
226chairいす、椅子[チェア]
227TVテレビ[ティービー]
228program番組、計画、プログラム[プログラム]
229telephone電話、でんわ[テレフォン]
230videoビデオ、映像[ビデオ]
231CDCD、シーディー[シーディー]
232computerコンピューター、PC[コンピュータ]
233Internetインターネット[インターネット]
234e-mail電子メール、メール[イーメール]
235letter手紙、文字、てがみ[レター]
236clock掛け時計、置き時計、時計、とけい[クロック]
237light明かり、光、（色が）薄い、ライト、ひかり[ライト]
238body体、からだ[ボディ]
239head頭、あたま[ヘッド]
240face顔、直面する、かお[フェイス]
241eye目、め[アイ]
242mouth口、くち[マウス]
243hair髪、かみ[ヘア]
244hand手、て[ハンド]
245leg脚、あし[レッグ]
246school学校、がっこう[スクール]
247subject教科、主題、主語、科目[サブジェクト]
248art芸術、美術、アート[アート]
249history歴史、れきし[ヒストリー]
250music音楽、おんがく[ミュージック]
251English英語、えいご[イングリッシュ]
252classクラス、授業、学級、じゅぎょう[クラス]
253clubクラブ、部活[クラブ]
254groupグループ、集団[グループ]
255teamチーム[チーム]
256fanファン、扇風機[ファン]
257homework宿題、しゅくだい[ホームワーク]
258teacher先生、せんせい、教師[ティーチャー]
259Mr.（男性に対して）〜さん、〜様、〜先生[ミスター]
260Ms.（女性に対して）〜さん、〜様、〜先生[ミズ]
261student学生、がくせい、生徒[ステューデント]
262friend友だち、友人、ともだち、友達[フレンド]
263everyoneだれも皆、みんな[エブリワン]
264gym体育館、ジム[ジム]
265groundグラウンド、用地、地面[グラウンド]
266test試験、検査、テスト[テスト]
267number数、数字、番号、ナンバー[ナンバー]
268picture絵、写真、え、しゃしん[ピクチャー]
269sign標識、符号、合図、身ぶり、署名、サイン[サイン]
270color色、いろ[カラー]
271word単語、ことば、言葉[ワード]
272dictionary辞書、辞典、じしょ[ディクショナリー]
273book本、（動）予約する、ほん[ブック]
274notebookノート、手帳[ノートブック]
275penペン[ペン]
276eraser消しゴム、黒板ふき、けしごむ[イレイサー]
277bagカバン、袋、バッグ[バッグ]
278event出来事、行事、催し物、試合、イベント[イベント]
279festival祭り、〜祭、まつり[フェスティバル]
280sportスポーツ[スポーツ]
281game試合、遊び、ゲーム[ゲーム]
282player選手、競技者、演奏者、プレイヤー[プレイヤー]
283racketラケット[ラケット]
284animal動物、どうぶつ[アニマル]
285bird鳥、とり[バード]
286fish魚、魚釣りをする、さかな[フィッシュ]
287petペット[ペット]
288flower花、はな[フラワー]
289tree木、き[ツリー]
290fruitくだもの、果実、フルーツ[フルーツ]
291year年、〜歳、とし[イヤー]
292season季節、時期、きせつ[シーズン]
293month月、つき[マンス]
294week週、しゅう[ウィーク]
295day日、日中、ひ[デイ]
296date日付、デート、ひづけ[デイト]
297morning朝、午前、あさ[モーニング]
298noon正午、昼、ひる[ヌーン]
299afternoon午後、ごご[アフタヌーン]
300evening夕方、晩、ゆうがた[イブニング]
301night夜、よる[ナイト]
302time時、時間、〜回、〜度、〜倍、とき、じかん[タイム]
303hour時間、じかん[アワー]
304minute分、ふん[ミニット]
305January 1月、いちがつ[ジャニュアリー]
306February 2月、にがつ[フェブラリー]
307March 3月、さんがつ[マーチ]
308April 4月、しがつ[エイプリル]
309May 5月、ごがつ[メイ]
310June 6月、ろくがつ[ジューン]
311July 7月、しちがつ[ジュライ]
312August 8月、はちがつ[オーガスト]
313September 9月、くがつ[セプテンバー]
314October 10月、じゅうがつ[オクトーバー]
315November 11月、じゅういちがつ[ノーベンバー]
316December 12月、じゅうにがつ[ディセンバー]
317Sunday日曜日、にちようび[サンデー]
318Monday月曜日、げつようび[マンデー]
319Tuesday火曜日、かようび[チューズデー]
320Wednesday水曜日、すいようび[ウェンズデー]
321Thursday木曜日、もくようび[サーズデー]
322Friday金曜日、きんようび[フライデー]
323Saturday土曜日、どようび[サタデー]
324spring春、はる[スプリング]
325summer夏、なつ[サマー]
326fall秋、あき、落ちる[フォール]
327winter冬、ふゆ[ウィンター]
328people人々、ひとびと[ピープル]
329man男性、人間、男、おとこ[マン]
330woman女性、女、おんな[ウーマン]
331boy少年、男の子[ボーイ]
332girl少女、女の子[ガール]
333food食べ物、たべもの、フード[フード]
334cooking料理、りょうり、クッキング[クッキング]
335breakfast朝食、あさごはん[ブレックファスト]
336lunch昼食、ひるごはん、ランチ[ランチ]
337dinner夕食、主要な食事、ゆうごはん、ディナー[ディナー]
338curryカレー料理、カレー[カレー]
339rice米、ごはん、こめ、ライス[ライス]
340breadパン[ブレッド]
341egg卵、たまご[エッグ]
342cakeケーキ[ケーキ]
343tea紅茶、お茶[ティー]
344juiceジュース、汁[ジュース]
345milkミルク、牛乳、ぎゅうにゅう[ミルク]
346water水、（動）水をやる、みず[ウォーター]
347cupカップ[カップ]
348glassコップ、グラス、ガラス[グラス]
349dish皿、料理、さら[ディッシュ]
350place場所、ばしょ[プレイス]
351library図書館、図書室、としょかん[ライブラリー]
352park公園、駐車場、（動）駐車する、こうえん[パーク]
353restaurantレストラン[レストラン]
354zoo動物園、どうぶつえん[ズー]
355car自動車、車、くるま[カー]
356busバス[バス]
357train列車、（動）訓練する、電車、でんしゃ[トレイン]
358moneyお金、かね[マネー]
359dollarドル[ダラー]
360begin始まる、始める、はじまる、はじめる[ビギン]
361finish終わる、終える、おわる、おえる[フィニッシュ]
362keep保つ、持ち続ける、～のままでいる、たもつ[キープ]
363borrow借りる、かりる[ボロウ]
364lend貸す、かす[レンド]
365wear着ている、身につけている、きる[ウェア]
366remember覚えている、思い出す、おぼえている、おもいだす[リメンバー]
367forget忘れる、わすれる[フォゲット]
368breakこわす、こわれる、休憩、壊す[ブレイク]
369build建てる、たてる[ビルド]
370arrive着く、つく、到着する[アライブ]
371reach着く、届く、達する、つく、とどく[リーチ]
372ride乗る、のる[ライド]
373save救う、蓄える、節約する、すくう、ためる[セーブ]
374rise上がる、昇る、あがる、のぼる[ライズ]
375raise上げる、あげる、育てる[レイズ]
376touch触れる、接触、手触り、さわる、タッチ[タッチ]
377move動かす、動く、うごかす、うごく[ムーブ]
378carry運ぶ、はこぶ[キャリー]
379hit打つ、うつ、ヒット[ヒット]
380set置く、定める、沈む、セットする[セット]
381wish願う、願い、ねがう[ウィッシュ]
382hope望む、〜だとよいと思う、のぞむ、希望[ホープ]
383miss乗り遅れる、逃す、〜がなくてさびしく思う、ミス[ミス]
384worry心配する、しんぱいする[ウォーリー]
385excuse大目に見る、許す、言い訳[エクスキューズ]
386agree同意する、賛成する[アグリー]
387wait待つ、まつ[ウェイト]
388followあとについていく、従う、したがう[フォロー]
389lose失う、負ける、うしなう、まける[ルーズ]
390sell売る、売れる、うる[セル]
391throw投げる、なげる[スロウ]
392turn回す、曲がる、順番、まわす、まがる[ターン]
393return戻る、帰る、戻す、返す、もどる、かえる[リターン]
394pass回す、経過する、合格する、通る、とおる[パス]
395collect集める、あつめる[コレクト]
396join加わる、参加する、参加[ジョイン]
397send送る、おくる[センド]
398travel旅行する、りょこうする[トラベル]
399cut切る、きる、カット[カット]
400spend（お金や時間を）ついやす、使う、費やす、すごす、過ごす[スペンド]
401grow成長する、栽培する、そだつ、育てる[グロウ]
402die死ぬ、枯れる、しぬ[ダイ]
403cry叫ぶ、泣く、さけぶ、なく[クライ]
404sleep眠る、眠り、ねむる、寝る[スリープ]
405dance踊る、踊り、おどる、ダンス[ダンス]
406teach教える、おしえる[ティーチ]
407understand理解する、わかる、分かった[アンダースタンド]
408win勝つ、勝ちとる、かつ[ウィン]
409mean意味する、意図する、〜のつもりである、いみする[ミーン]
410sound～のように聞こえる、音、おと[サウンド]
411smileほほ笑む、ほほ笑み、笑う、わらう[スマイル]
412laugh笑う、わらう[ラフ]
413pay払う、はらう、支払う[ペイ]
414drive運転する、うんてんする、ドライブ[ドライブ]
415ring鳴る、鳴りひびく、鳴らす、指輪、輪、なる、ゆびわ[リング]
416land着陸する、上陸する、陸、土地、とち[ランド]
417pick選ぶ、摘む、つつく、えらぶ、拾う[ピック]
418seem～のように思われる、～らしい[シーム]
419mind気にする、かまう、いやだと思う、思い、精神、心[マインド]
420rich金持ちの、豊かな、ゆたかな[リッチ]
421poor貧しい、乏しい、へたな、かわいそうな、まずしい[プア]
422strong強い、つよい[ストロング]
423weak弱い、よわい[ウィーク]
424same同じ、同じもの（こと）、おなじ[セイム]
425different異なっている、違う、ちがう[ディファレント]
426easy簡単な、気楽な、かんたん、やさしい[イージー]
427difficult難しい、むずかしい[ディフィカルト]
428otherほかの／ほかの人・もの、他の[アザー]
429anotherもうひとつの／もうひとつの人・もの、別の[アナザー]
430both両方の／両方とも、両方、りょうほう[ボース]
431eachおのおのの／おのおの・各自、それぞれ[イーチ]
432half半分の／半分、はんぶん[ハーフ]
433fullいっぱいの、満タン[フル]
434onlyただひとつの／ただ～だけ、唯一[オンリー]
435betterより優れた／もっと、より良い[ベター]
436best最も優れた／一番、ベスト、最高、さいこう[ベスト]
437moreより多くの／もっと[モア]
438most最も多くの／ほとんどの、最も、もっとも[モスト]
439important重要な／大切な、じゅうよう、たいせつ[インポータント]
440useful役に立つ、便利、べんり[ユースフル]
441careful注意深い、気をつける[ケアフル]
442popular人気がある、にんき[ポピュラー]
443deliciousとてもおいしい、美味しい[デリシャス]
444famous有名な、ゆうめい[フェイマス]
445dangerous危険な／危ない、きけん、あぶない[デンジャラス]
446safe安全な／差し支えない、あんぜん[セーフ]
447interested興味を抱いている／興味がある、きょうみがある[インタレスティッド]
448interesting興味を抱かせる／興味深い、面白い、おもしろい[インタレスティング]
449excited興奮している／わくわくしている[エキサイテッド]
450exciting興奮させる／わくわくさせる[エキサイティング]
451surprised驚いている、おどろいた[サプライズド]
452amazing驚くべき、すばらしい、すごい[アメイジング]
453angry怒っている、おこっている[アングリー]
454sleepy眠たい、ねむい[スリーピー]
455lucky運がいい／ついている、ラッキー[ラッキー]
456friendly友好的な／親しみやすい、フレンドリー[フレンドリー]
457kind親切な、しんせつ、種類[カインド]
458sweet甘い／甘いお菓子（複数形で）、あまい[スイート]
459afraid恐れて／こわがって、怖い、こわい[アフレイド]
460favorite一番好きな／お気に入りの／お気に入りのもの・人[フェイバリット]
461sure確信して／確実な／もちろん[シュア]
462sick病気の／吐き気がする、病気[シック]
463quiet静かな／平穏な、しずか[クワイエット]
464special特別な、とくべつ[スペシャル]
465own自分自身の／独自の／所有する、自分の[オウン]
466loud（声や音が）大きな／大声で、うるさい[ラウド]
467ready準備ができている／用意ができている、準備、じゅんび[レディ]
468comicマンガの／喜劇の／マンガの本、漫画[コミック]
469fast速い／速く、はやい[ファスト]
470soonまもなく／早めに、すぐに[スーン]
471quicklyすばやく／すぐに、速く、はやく[クイックリー]
472maybeもしかすると、たぶん[メイビー]
473probablyきっと（70〜80%の確率で）、おそらく[プロバブリー]
474finallyついに／最後に、とうとう[ファイナリー]
475once1度／1回／かつて、一度、一回[ワンス]
476twice2度／2回／2倍、二度、二回[トゥワイス]
477never一度も〜ない／決して〜ない[ネバー]
478everこれまでに[エバー]
479yetまだ（〜ない）／もう（〜しましたか）[イエット]
480alreadyすでに（肯定文で）／もう[オールレディ]
481even～でさえも／（形）対等の[イーブン]
482as同じくらい、〜として[アズ]
483abroad外国へ［で］、海外、かいがい[アブロード]
484elseその他に、ほか[エルス]
485far遠く（に）／はるかに／（形）遠い、とおい[ファー]
486straightまっすぐに／（形）まっすぐな[ストレイト]
487especially特に、とくに[エスペシャリー]
488actually実際に（は）／実は、じつは[アクチュアリー]
489suddenly突然に、突然、とつぜん[サドンリー]
490can（しようと思えば）〜できる／〜でありえる、できる[キャン]
491couldcanの過去形／〜できた（思考・認知などについて）、できた[クッド]
492will〜します／（きっと）〜だろう[ウィル]
493wouldwillの過去形／〜でしょうか？（丁寧な依頼）[ウッド]
494must〜しなければならない／〜に違いない[マスト]
495may〜してよろしい／〜かもしれない[メイ]
496should〜したほうがいい／〜のはずだ[シュッド]
497shall（〜しましょうか？）〜しませんか？／〜しましょうか？[シャル]
498and〜と／そして／それで／（命令文のあとで）そうすれば[アンド]
499or〜か／それとも／さもないと[オア]
500butしかし／でも／〜を除いて[バット]
501soそれで／だから／非常に／そんなに／そう[ソー]
502howeverしかしながら[ハウエバー]
503when〜するとき（に）／〜すると／〜したら、いつ[ウェン]
504if（もし）〜なら／〜したら／〜かどうか、もし[イフ]
505because（なぜなら）〜なので／〜だから[ビコーズ]
506while〜の間（に）／〜だが／一方で[ホワイル]
507although / though〜だが／〜だけれども[オーゾー]
508than〜よりも／〜と比べて[ザン]
509that（接続詞）〜ということ[ザット]
510across〜を横切って[アクロス]
511through〜を通り抜けて、〜を通して[スルー]
512against〜に（反）対して[アゲインスト]
513along〜に沿って／（副詞）どんどん先へ[アロング]
514between（2つのもの）の間に、あいだ[ビトウィーン]
515among（3つ以上のもの）の間に、なか[アマング]
516behind〜の背後に／〜のうしろに、後ろ[ビハインド]
517during〜の間ずっと／〜の間に[デューリング]
518into〜の中に［へ］[イントゥー]
519past〜を過ぎて、過去[パスト]
520since〜から／〜して以来／〜なので、以来[シンス]
521until / till〜までずっと／〜するまでずっと[アンティル]
522without〜なしで[ウィズアウト]
523above〜の上（のほう）に[アバブ]
524below〜の下（のほう）に[ビロウ]
525nature自然／性質／本質、しぜん[ネイチャー]
526world世界／世の中、せかい[ワールド]
527country国／田舎、くに[カントリー]
528field野原／畑／競技場／分野、フィールド[フィールド]
529hill丘／小山、おか[ヒル]
530rock岩、いわ、ロック[ロック]
531river川、かわ[リバー]
532sky空、そら[スカイ]
533sea海、うみ[シー]
534lake湖、みずうみ[レイク]
535earth地球／大地、ちきゅう[アース]
536moon月、つき[ムーン]
537star星／スター、ほし[スター]
538mountain山、やま[マウンテン]
539island島、しま[アイランド]
540weather天気、てんき[ウェザー]
541sun太陽／日光、たいよう[サン]
542rain雨／雨が降る、あめ[レイン]
543snow雪／雪が降る、ゆき[スノウ]
544cloud雲、くも[クラウド]
545wind風（大風を含む）、かぜ[ウィンド]
546city都市／市、まち[シティ]
547town町、まち[タウン]
548village村、むら[ビレッジ]
549building建物、たてもの、ビル[ビルディング]
550shopping買い物、かいもの[ショッピング]
551shop店、みせ[ショップ]
552movie映画、えいが[ムービー]
553concertコンサート[コンサート]
554hallホール／会館／（大）広間[ホール]
555seat座席／着席させる、席、せき[シート]
556museum博物館／美術館、はくぶつかん、びじゅつかん[ミュージアム]
557station駅／署／局、えき[ステーション]
558street街路／通り、道、みち[ストリート]
559tower塔、タワー[タワー]
560hospital病院、びょういん[ホスピタル]
561post office郵便局、ゆうびんきょく[ポストオフィス]
562bridge橋、はし[ブリッジ]
563castle城、しろ[キャッスル]
564temple寺／寺院、てら[テンプル]
565person人、ひと[パーソン]
566name名前／名づける、なまえ[ネーム]
567age年齢／時代、とし、ねんれい[エイジ]
568job仕事、しごと[ジョブ]
569birthday誕生日、たんじょうび[バースデー]
570baby赤ちゃん、あかちゃん[ベイビー]
571wife妻、つま[ワイフ]
572husband夫、おっと[ハズバンド]
573doctor医者、博士、いしゃ[ドクター]
574nurse看護師、かんごし[ナース]
575patient患者、かんじゃ[ペイシェント]
576scientist科学者、かがくしゃ[サイエンティスト]
577engineer技術者、エンジニア[エンジニア]
578musician音楽家、ミュージシャン[ミュージシャン]
579farmer農家、のうか[ファーマー]
580host主人（役）、主催者、ホスト[ホスト]
581hero英雄、主人公、ヒーロー[ヒーロー]
582line線、列、行、ライン[ライン]
583point点、要点、指をさす、ポイント[ポイント]
584top頂上、トップ[トップ]
585side側、側面、サイド[サイド]
586front前部、正面、前の、正面の、フロント[フロント]
587part部分、役割、パート[パート]
588piece1片、1個、1枚、ピース[ピース]
589north北、北の、北に［へ］、きた[ノース]
590south南、南の、南に［へ］、みなみ[サウス]
591east東、東の、東に［へ］、ひがし[イースト]
592west西、西の、西に［へ］、にし[ウエスト]
593left左、左の、左に［へ］、ひだり[レフト]
594right右、右の、右に［へ］、みぎ、正しい[ライト]
595thingもの、こと[シング]
596something何か、あるもの［こと］、なにか[サムシング]
597everythingどれも皆（すべてのもの、すべてのこと）、すべて[エブリシング]
598anything何か、何も（〜ない）、何でも[エニシング]
599nothing何も〜ない[ナッシング]
600life生命、生活、人生、いのち[ライフ]
601partyパーティー、一団[パーティー]
602song歌、うた[ソング]
603presentプレゼント、贈る、提示する、提供する、贈り物[プレゼント]
604cameraカメラ[カメラ]
605cardカード、トランプ[カード]
606message伝言、メッセージ[メッセージ]
607diary日記、にっき[ダイアリー]
608box箱、はこ[ボックス]
609paper紙、かみ[ペーパー]
610wood木材、き[ウッド]
611fire火、火事、解雇する、ひ[ファイア]
612meat肉、にく[ミート]
613tooth歯、は[トゥース]
614chopsticks箸、はし[チョップスティックス]
615bottleびん、ボトル[ボトル]
616clothes衣服、服、ふく[クローズ]
617uniformユニフォーム、制服、せいふく[ユニフォーム]
618rule規則、支配、ルール[ルール]
619courseコース、進路、課程[コース]
620way道、方向、方法、みち、ほうほう[ウェイ]
621lotたくさん、多数、多量[ロット]
622robotロボット[ロボット]
623bike自転車、バイク[バイク]
624boatボート、船[ボート]
625plane飛行機、ひこうき[プレーン]
626fun楽しみ、楽しいこと、たのしみ[ファン]
627question質問、問題、しつもん[クエスチョン]
628idea考え、案、思いつき、アイデア[アイデア]
629wake目が覚める、目を覚ます、おきる[ウェイク]
630shout大声で叫ぶ、さけぶ[シャウト]
631lie横になる、うそをつく、嘘[ライ]
632marry〜と結婚する、けっこん[マリー]
633happen（偶然に）起こる、おこる[ハプン]
634surprise驚かせる、驚き[サプライズ]
635impress感銘を与える、印象づける、感動[インプレス]
636cheer元気づける、応援する[チアー]
637encourage勇気づける、励ます[エンカレッジ]
638hurt傷つける、痛む、いたむ[ハート]
639push押す、おす[プッシュ]
640hide隠す、隠れる、かくす[ハイド]
641guide案内する、案内人、ガイド[ガイド]
642believe信じている、〜と思う、信じる、しんじる[ビリーブ]
643realize悟る、実現する、気づく[リアライズ]
644guess（当て推量で）言い当てる、推測する[ゲス]
645imagine想像する、そうぞうする[イマジン]
646express表現する、ひょうげんする[エクスプレス]
647wonder〜かしらと思う、不思議に思う[ワンダー]
648expect期待する、予期する、きたいする[エクスペクト]
649respect尊敬する、尊重する、そんけいする[リスペクト]
650decide決める、決心する、きめる[ディサイド]
651relaxくつろぐ、ゆるめる、リラックス[リラックス]
652fight戦う、名：戦い、たたかう[ファイト]
653notice気づく、名：通知、掲示、きづく[ノーティス]
654discover発見する、はっけんする[ディスカバー]
655produce生産する、産出する、せいさんする[プロデュース]
656reduce減らす、へらす[リデュース]
657introduce紹介する、しょうかいする[イントロデュース]
658reuse再利用する[リユース]
659recycle再生利用する、リサイクル[リサイクル]
660waste無駄にする、無駄に使う、名：廃物、廃棄物、むだ[ウェイスト]
661develop発展する、発展させる、開発する、かいはつ[ディベロップ]
662protect保護する、まもる、守る[プロテクト]
663steal盗む、ぬすむ[スティール]
664exchange交換する、こうかんする[エクスチェンジ]
665communicate伝達する、意思を通わせる、コミュニケーション[コミュニケート]
666explain説明する、せつめいする[エクスプレイン]
667invite招く、招待する[インバイト]
668smell～なにおいがする、名：におい[スメル]
669choose選ぶ、えらぶ[チューズ]
670climb登る、のぼる[クライム]
671continue続ける、つづける[コンティニュー]
672tie結ぶ、（複数形で）絆、むすぶ[タイ]
673enter入る、はいる、入学[エンター]
674kill殺す、ころす[キル]
675drop落ちる、落とす、名：しずく、おちる[ドロップ]
676serve（食事を）出す、仕える[サーブ]
677receive受けとる、受け取る、うけとる[レシーブ]
678solve解く、解決する、とく[ソルブ]
679report報告する、報道する、名：報告（書）、レポート[レポート]
680appear現れる、あらわれる[アピア]
681support支える、養う、支持する、サポート[サポート]
682cost（費用が）かかる、名：費用、コスト[コスト]
683add加える、くわえる、足す[アッド]
684prepare準備する、じゅんびする[プリペア]
685hurry急ぐ、急がせる、名：急ぎ、いそぐ[ハリー]
686promise約束する、名：約束、やくそく[プロミス]
687fill満たす、いっぱいにする[フィル]
688share分け合う、共有する、名：分け前、シェア[シェア]
689shy内気な、恥ずかしがりの、シャイ[シャイ]
690nervous神経質な、緊張[ナーバス]
691able〜できる、可能な[エイブル]
692proud誇りに思っている、自慢に思っている、誇り[プラウド]
693dying死にかけている、瀕死の[ダイイング]
694dead死んでいる、死[デッド]
695healthy健康な、健康に良い、けんこう[ヘルシー]
696international国際的な、こくさい[インターナショナル]
697foreign外国の、がいこく[フォーリン]
698traditional伝統的な、でんとう[トラディショナル]
699local地元の、その土地の、ローカル[ローカル]
700strange奇妙な、見知らぬ、変な[ストレンジ]
701real本当の、本物の、心からの、現実の、リアル[リアル]
702true真実の、本当、ほんとう[トゥルー]
703serious本気である、まじめな、重大な、深刻な、シリアス[シリアス]
704perfect完全な、完璧な、パーフェクト[パーフェクト]
705possible可能な、ありえる、起こりえる[ポッシブル]
706human人間の、人間らしい、にんげん[ヒューマン]
707natural自然の、当然の、ナチュラル[ナチュラル]
708wild野生の、ワイルド[ワイルド]
709plasticプラスチック製の、ビニール製の[プラスチック]
710softやわらかい、おだやかな、ソフト[ソフト]
711heavy重い、おもい[ヘビー]
712round丸い、まるい[ラウンド]
713simple簡単な、単純な、質素な、シンプル[シンプル]
714necessary必要な、ひつよう[ネセサリー]
715funnyおかしな、こっけいな、変わった、面白い[ファニー]
716terribleひどい、ものすごい、恐ろしい[テリブル]
717deep深い、ふかい[ディープ]
718dry乾いた、乾く、乾かす、ドライ[ドライ]
719public公の、公共の、公立の、大衆の、公衆の[パブリック]
720dark暗い、暗がり、くらい[ダーク]
721wide幅広い、広い、ひろい[ワイド]
722expensive高価な、高い、たかい[エクスペンシブ]
723cheap安い、やすい[チープ]
724suchそのような、そんなに、こんなに、あんなに[サッチ]
725few（数が）少ない、すくない[フュー]
726severalいくつかの、いく人かの[セベラル]
727whole全体の、全体、ぜんたい[ホール]
728enough十分な、じゅうぶん[イナフ]
729feeling感情、感覚、気持ち、きもち[フィーリング]
730experience経験、けいけん[エクスペリエンス]
731memory記憶、記念、思い出、メモリー[メモリー]
732interest興味、関心／興味をいだかせる、きょうみ[インタレスト]
733dream夢／夢を見る、ゆめ[ドリーム]
734interview会見、面接／会見する、面接する、インタビュー[インタビュー]
735opinion意見、いけん[オピニオン]
736skill技能、技術、スキル[スキル]
737power能力、力、権力、パワー、ちから[パワー]
738information情報、じょうほう[インフォメーション]
739communication意思疎通、伝達、通信、コミュニケーション[コミュニケーション]
740chance機会、チャンス[チャンス]
741language言語、げんご、ことば[ランゲージ]
742speech演説、スピーチ[スピーチ]
743plan計画／計画する、プラン[プラン]
744future将来、未来、みらい[フューチャー]
745newsニュース、知らせ[ニュース]
746fact事実、じじつ[ファクト]
747shape形、姿、状態、かたち[シェイプ]
748care世話、注意、気にする、ケア[ケア]
749rest休息、休養、休む、やすみ[レスト]
750attention注意、配慮、ちゅうい[アテンション]
751effort努力、どりょく[エフォート]
752luck運、幸運、ラック[ラック]
753health健康、けんこう[ヘルス]
754trouble困難、悩ます、トラブル[トラブル]
755headache頭痛、ずつう[ヘッドエイク]
756medicine薬、医学、くすり[メディスン]
757temperature温度、おんど、気温[テンパチャー]
758plant植物、工場、植える、しょくぶつ[プラント]
759vegetable野菜、やさい[ベジタブル]
760order注文、命令、順序、依頼、注文する、命令する、オーダー[オーダー]
761designデザイン、設計、設計する[デザイン]
762college大学、だいがく[カレッジ]
763tournamentトーナメント、試合[トーナメント]
764electricity電気、でんき[エレクトリシティ]
765convenience便利、都合、便利なもの〔こと〕[コンビニエンス]
766example例、れい[エグザンプル]
767view眺め、視界、考え（方）、景色[ビュー]
768reason理由、理性、りゆう[リーズン]
769activity活動、アクティビティ[アクティビティ]
770volunteerボランティア、志願者[ボランティア]
771period期間、時代、きかん[ピリオド]
772century世紀、せいき[センチュリー]
773society社会、しゃかい[ソサエティ]
774community地域社会、共同体、コミュニティ[コミュニティ]
775culture文化、ぶんか[カルチャー]
776custom（社会の）慣習、習慣[カスタム]
777population人口、（特定地域の）住民、じんこう[ポピュレーション]
778amount総計、量、りょう[アマウント]
779vacation休暇、休み、バケーション[バケーション]
780trip旅行、りょこう[トリップ]
781difference違い、ちがい[ディファレンス]
782situation状況、じょうきょう、シチュエーション[シチュエーション]
783matter問題、事柄、物質[マター]
784exam試験、テスト[イグザム]
785experiment実験、実験する、じっけん[エクスペリメント]
786mistake間違い、間違える、ミス[ミステイク]
787company会社、仲間、かいしゃ[カンパニー]
788factory工場、こうじょう[ファクトリー]
789customer顧客、客、きゃく[カスタマー]
790war戦争、せんそう[ウォー]
791earthquake地震、じしん[アースクエイク]
792danger危険、きけん[デンジャー]
793technology科学技術、テクノロジー、技術[テクノロジー]
794influence影響、影響を及ぼす、えいきょう[インフルエンス]
795problem問題、もんだい[プロブレム]
796oil油、石油、オイル[オイル]
797gas気体、ガス、ガソリン[ガス]
798energyエネルギー[エネルギー]
799noise騒音、雑音、ノイズ[ノイズ]
800garbageゴミ、ごみ[ガーベッジ]
801traffic accident交通事故、じこ[トラフィックアクシデント]
802environment環境、かんきょう[エンバイロメント]
803pollution汚染、おせん[ポリューション]
804global warming地球温暖化、おんだんか[グローバルウォーミング]
805peace平和、へいわ[ピース]`;

// --- データセット追加: イングリッシュゲート ---
const RAW_DATA_ENGLISH_GATE = `1favoriteお気に入り
2bank銀行
3basketballバスケットボール
4baseball野球
5bookstore本屋
6sleepy眠い
7sing歌う
8book本
9science科学
10school学校
11sister姉／妹
12pencilえんぴつ
13speak話す
14tennisテニス
15student学生
16study勉強する
17swim泳ぐ
18teaお茶
19teacher先生
20watch見る／腕時計
21Nice to meet you.はじめまして。
22Good bye.さようなら。
23Have a nice day!よい一日を！`;

// --- データセット2: 関正生 難関高校英単語 ---
const RAW_DATA_SEKI_KOKO = `1cancel中止にする、取り消す[キャンセル]
2cost（お金が）かかる、費用[コスト]
3trust信頼する[トラスト]
4receive受け取る[レシーブ]
5hit打つ、（災害が）襲う[ヒット]
6shut閉める[シャット]
7drop落ちる、落とす[ドロップ]
8check確認する[チェック]
9attend出席する[アテンド]
10express表現する[エクスプレス]
11choose選ぶ[チューズ]
12celebrate祝う[セレブレイト]
13support支える[サポート]
14notice気づく、注目する[ノーティス]
15continue続く、続ける[コンティニュー]
16judge判断する[ジャッジ]
17perform行う、演じる[パフォーム]
18post貼る、掲示する、投函する[ポスト]
19prepare準備する[プリペア]
20invent発明する[インベント]
21guess推測する、思う[ゲス]
22attract引きつける、魅了する[アトラクト]
23follow後を追う、従う[フォロー]
24add加える[アッド]
25pay支払う[ペイ]
26offer提供する、申し出る[オファー]
27exchange交換する[エクスチェンジ]
28expect期待する、予想する[エクスペクト]
29share共有する、分ける[シェア]
30imagine想像する[イマジン]
31seem～のようだ[シーム]
32graduate卒業する[グラジュエイト]
33appear現れる、見える[アピア]
34marry結婚する[マリー]
35disappear消える[ディスアピア]
36rise昇る、上がる[ライズ]
37raise上げる、育てる、（お金を）集める[レイズ]
38lead導く[リード]
39lieいる、ある、横になる[ライ]
40cause引き起こす[コーズ]
41lay置く、横にする[レイ]
42contribute貢献する、〜の原因になる[コントリビュート]
43impress印象を与える、感動させる[インプレス]
44hurt傷つける[ハート]
45amaze驚かせる[アメイズ]
46injure傷つける[インジャー]
47shock衝撃を与える[ショック]
48wound負傷させる、ケガをさせる[ウーンド]
49die死ぬ[ダイ]
50protect守る、保護する[プロテクト]
51survive生き延びる、〜より長生きする[サバイブ]
52destroy破壊する[デストロイ]
53escape逃げる[エスケープ]
54waste無駄にする[ウェイスト]
55burn燃やす[バーン]
56jumpジャンプする、跳ぶ[ジャンプ]
57knockノックする[ノック]
58cheer元気づける、歓声をあげる[チアー]
59brush磨く、ブラシ[ブラシ]
60shake振る[シェイク]
61greet挨拶する[グリート]
62pack詰める、荷物をまとめる[パック]
63pull引く[プル]
64hide隠す[ハイド]
65fold折りたたむ、（腕を）組む[フォールド]
66boilゆでる、沸かす[ボイル]
67bake焼く[ベイク]
68feed食べ物を与える[フィード]
69technology科学技術[テクノロジー]
70view眺め、見方、意見[ビュー]
71fact事実[ファクト]
72reason理由[リーズン]
73opinion意見[オピニオン]
74purpose目的[パーパス]
75result結果[リザルト]
76challenge挑戦、やりがい[チャレンジ]
77trouble心配、困難[トラブル]
78business仕事、事業[ビジネス]
79difficulty困難、苦労[ディフィカルティ]
80article記事[アーティクル]
81course進路、方向、コース[コース]
82experience経験[エクスペリエンス]
83symbol象徴、記号[シンボル]
84age年齢、時代[エイジ]
85peace平和[ピース]
86factory工場[ファクトリー]
87person人[パーソン]
88memory記憶[メモリー]
89skill技術[スキル]
90tool道具[ツール]
91silence静けさ、沈黙[サイレンス]
92instrument楽器、道具[インストゥルメント]
93furniture家具一式[ファニチャー]
94population人口[ポピュレーション]
95port港[ポート]
96fortune運、財産[フォーチュン]
97value価値[バリュー]
98adviceアドバイス、助言[アドバイス]
99decision決心、決断[デシジョン]
100truth真実[トゥルース]
101discount割引[ディスカウント]
102address住所、演説[アドレス]
103fee報酬、授業料、公共料金、手数料[フィー]
104figure人物、数字、図[フィギュア]
105rest休息、残り[レスト]
106interest興味、利益、利子[インタレスト]
107sight視力、景色[サイト]
108environment環境[エンバイロメント]
109manner方法、マナー[マナー]
110climate気候[クライメート]
111temperature温度[テンパチャー]
112oil石油、油[オイル]
113average平均[アベレージ]
114land陸地、国土[ランド]
115nature自然[ネイチャー]
116ocean海、大洋[オーシャン]
117island島[アイランド]
118desert砂漠[デザート]
119continent大陸[コンティネント]
120dessertデザート[デザート]
121jungleジャングル[ジャングル]
122leaf葉[リーフ]
123grass草[グラス]
124damage損害、被害[ダメージ]
125nest巣[ネスト]
126disaster災害[ディザスター]
127flood洪水[フラッド]
128space場所、宇宙[スペース]
129planet惑星[プラネット]
130pain痛み[ペイン]
131health健康[ヘルス]
132medicine薬[メディスン]
133fever熱[フィーバー]
134nurse看護師[ナース]
135soapせっけん[ソープ]
136past過去の、過去[パスト]
137meal食事[ミール]
138century世紀[センチュリー]
139recipeレシピ、調理法[レシピ]
140human人間、人類[ヒューマン]
141god神[ゴッド]
142soldier兵士[ソルジャー]
143heaven天国[ヘブン]
144enemy敵[エネミー]
145war戦争[ウォー]
146violence暴力[バイオレンス]
147government政府[ガバメント]
148capital首都、大文字[キャピタル]
149nation国家[ネイション]
150president大統領、社長[プレジデント]
151state州、国、状態[ステイト]
152mayor市長[メイヤー]
153law法律[ロー]
154vocabulary語彙[ボキャブラリー]
155statue像[スタチュー]
156sentence文[センテンス]
157movement動き、運動[ムーブメント]
158novel小説[ノベル]
159mystery謎、推理小説[ミステリー]
160relationship関係[リレーションシップ]
161gestureジェスチャー、身振り[ジェスチャー]
162community地域社会、共同体[コミュニティ]
163custom習慣、税関、関税[カスタム]
164neighbor近所の人、隣人[ネイバー]
165joke冗談[ジョーク]
166audience聴衆、観客[オーディエンス]
167guest招待客、宿泊客[ゲスト]
168customer顧客[カスタマー]
169passenger乗客[パッセンジャー]
170department部門[デパートメント]
171section部分、部門[セクション]
172owner所有者[オーナー]
173manager経営者、部長[マネージャー]
174visitor訪問者[ビジター]
175clerk事務員、店員[クラーク]
176tourist旅行者[ツーリスト]
177sightseeing観光[サイトシーイング]
178award賞、授与する[アワード]
179Olympicsオリンピック[オリンピックス]
180ceremony式、儀式[セレモニー]
181medalメダル[メダル]
182prize賞[プライズ]
183quizクイズ、小テスト[クイズ]
184essay作文、エッセイ[エッセイ]
185score得点[スコア]
186project計画、プロジェクト[プロジェクト]
187report報告書、レポート[レポート]
188presentationプレゼンテーション、発表[プレゼンテーション]
189topic話題[トピック]
190percentパーセント[パーセント]
191lesson練習、授業[レッスン]
192meterメートル[メーター]
193gym体育館[ジム]
194bottom底[ボトム]
195medium中間、媒体、手段[ミディアム]
196middle中間の[ミドル]
197circle円[サークル]
198road道路[ロード]
199traffic交通[トラフィック]
200flight飛行、航空便[フライト]
201block区画、ブロックする[ブロック]
202cyclingサイクリング、自転車に乗ること[サイクリング]
203step歩み、足元、段[ステップ]
204stairs階段[ステアーズ]
205elevatorエレベーター[エレベーター]
206track跡、道[トラック]
207field野原、田畑、分野[フィールド]
208hallホール、廊下[ホール]
209ceiling天井[シーリング]
210roof屋根[ルーフ]
211piece1つ、ひとかけら、作品[ピース]
212slice薄切り[スライス]
213sheet1枚の紙、シーツ[シート]
214noise騒音[ノイズ]
215styleスタイル、様式、方法[スタイル]
216scheduleスケジュール、予定を立てる[スケジュール]
217calendarカレンダー[カレンダー]
218listリストに入れる[リスト]
219meeting会議、ミーティング[ミーティング]
220systemシステム、制度[システム]
221model模型、型、手本[モデル]
222designデザイン、設計する[デザイン]
223courtコート、裁判所[コート]
224typeタイプ、活字[タイプ]
225engineer技術者、エンジニア[エンジニア]
226voice声[ボイス]
227actor俳優[アクター]
228actress女優[アクトレス]
229theater劇場、映画館[シアター]
230film映画[フィルム]
231professionalプロ、専門家[プロフェッショナル]
232license免許[ライセンス]
233shape形、（健康）状態[シェイプ]
234secret秘密[シークレット]
235date日付、デート[デイト]
236gift贈り物、才能[ギフト]
237cloth布[クロス]
238tieネクタイ、結ぶ[タイ]
239costume衣装[コスチューム]
240hole穴[ホール]
241copyコピー、（本・雑誌などの）冊、部[コピー]
242purse財布、ハンドバッグ[パース]
243aquarium水族館[アクアリウム]
244kid子ども[キッド]
245twin双子[ツイン]
246wave波、手を振る[ウェーブ]
247flag旗[フラッグ]
248rainbow虹[レインボー]
249cageかご[ケージ]
250vase花瓶[ベース]
251noteメモ、注意する、気づく[ノート]
252helpful役立つ、助けになる[ヘルプフル]
253useful役立つ[ユースフル]
254common共通の、よくある[コモン]
255traditional伝統的な、従来の[トラディショナル]
256original最初の、元々の、独創的な[オリジナル]
257unique独特の[ユニーク]
258local地元の、その土地の[ローカル]
259own自分自身の、所有する[オウン]
260dead死んでいる[デッド]
261comfortable心地よい、快適な[コンフォータブル]
262serious深刻な、まじめな[シリアス]
263severalいくつかの[セベラル]
264various様々な[バリアス]
265tough骨の折れる、丈夫な[タフ]
266normal普通の[ノーマル]
267precious貴重な[プレシャス]
268whole全体の、完全な[ホール]
269exact正確な[イグザクト]
270direct直接の、指導する、監督する[ダイレクト]
271rapid急速な[ラピッド]
272extra余分な[エクストラ]
273opposite反対の[オポジット]
274empty空の[エンプティ]
275physical身体の[フィジカル]
276total全部の、合計の[トータル]
277former以前の、前者の[フォーマー]
278ordinary普通の[オーディナリー]
279possible可能な[ポッシブル]
280impossible不可能な[インポッシブル]
281convenient便利な、都合がよい[コンビニエント]
282alive生きている[アライブ]
283asleep眠っている[アスリープ]
284certain確信して、ある～[サートゥン]
285ready準備ができた[レディ]
286fond大好きな[フォンド]
287proud誇りを持った[プラウド]
288similar似ている[シミラー]
289native本来その土地の、生まれつきの[ネイティブ]
290familiarよく知っている[ファミリア]
291absent欠席して[アブセント]
292independent独立した[インディペンデント]
293fluent流ちょうな[フルーエント]
294tropical熱帯の[トロピカル]
295wild野生の[ワイルド]
296mild穏やかな[マイルド]
297global地球規模の[グローバル]
298electric電気の[エレクトリック]
299scientific科学的な[サイエンティフィック]
300modern現代の[モダン]
301legal法律の、合法の[リーガル]
302individual個々の、個別の[インディビジュアル]
303personal個人の、個人的な[パーソナル]
304private個人的な、プライベートな[プライベート]
305public公共の[パブリック]
306elderly年配の[エルダーリー]
307male男性の・オスの[メール]
308female女性の・メスの[フィメール]
309equal平等の[イコール]
310blind盲目の・目が見えない[ブラインド]
311deaf耳が聞こえない[デフ]
312boring退屈な[ボーリング]
313enjoyable楽しい[エンジョイアブル]
314attractive魅力的な[アトラクティブ]
315terrible恐ろしい・ひどい[テリブル]
316pleasant楽しい・感じの良い[プレザント]
317positive前向きな・肯定的な[ポジティブ]
318negative消極的な・否定的な[ネガティブ]
319crazy気が狂った・夢中である[クレイジー]
320pale青ざめた[ペイル]
321lonely寂しい[ロンリー]
322honest正直な[オネスト]
323brave勇敢な[ブレイブ]
324shy恥ずかしがりの[シャイ]
325polite礼儀正しい・丁寧な[ポライト]
326nervous緊張して・神経質な[ナーバス]
327fair公平な・見本市[フェア]
328rude無礼な・失礼な[ルード]
329gentle優しい[ジェントル]
330smart賢い[スマート]
331foolish愚かな[フーリッシュ]
332clever賢い[クレバー]
333stupidバカな[ステューピッド]
334bright明るい・頭が良い[ブライト]
335thin薄い・細い・やせた[シン]
336thick厚い・太い[シック]
337loud（声・音が）大きい[ラウド]
338fresh新鮮な[フレッシュ]
339daily毎日の・日常の[デイリー]
340crowded混雑した[クラウディッド]
341perfect完璧な[パーフェクト]
342excellentすばらしい[エクセレント]
343fantasticすばらしい[ファンタスティック]
344outdoor屋外の[アウトドア]
345round丸い[ラウンド]
346tinyとても小さな[タイニー]
347huge巨大な[ヒュージ]
348giant巨大な[ジャイアント]
349primary最初の・重要な[プライマリー]
350basic基本的な[ベーシック]
351roughざらざらした・おおざっぱな[ラフ]
352elementary初歩の[エレメンタリー]
353smoothなめらかな[スムース]
354everyday日々の[エブリデイ]
355pure純粋な・きれいな[ピュア]
356clearきれいな・わかりやすい[クリア]
357sharp鋭い[シャープ]
358overseas海外へ[オーバーシーズ]
359outdoors外で[アウトドアーズ]
360upstairs上の階で[アップステアーズ]
361downtown町の中心部に[ダウンタウン]
362almostほとんど[オールモスト]
363nearlyほとんど[ニアリー]
364mostlyたいていは・大部分は[モストリー]
365actually実際は[アクチュアリー]
366unfortunately不運にも・あいにく[アンフォーチュネートリー]
367instead代わりに[インステッド]
368anymoreもはや（〜ない）[エニモア]
369thereforeしたがって[ゼアフォア]
370besidesその上・〜に加えて[ビサイズ]
371especially特に[エスペシャリー]
372gradually徐々に・だんだん[グラジュアリー]
373nowadays最近[ナウアデイズ]
374recently最近[リーセントリー]
375lately最近[レイトリー]
376eventuallyついに・結局は[イベンチュアリー]
377immediatelyすぐに・直接[イミディエートリー]
378hardlyほとんど〜ない[ハードリー]
379scarcelyほとんど〜ない[スケアスリー]
380rarelyめったに〜ない[レアリー]
381perhapsもしかすると[パーハップス]
382quiteかなり・完全に[クワイト]
383ratherむしろ・やや[ラザー]
384indeed本当に・実際には[インディード]
385forward前へ[フォワード]
386both両方とも[ボース]
387eitherどちらか・（否定で）どちらも〜ない[イーザー]
388neitherどちらも〜ない[ニーザー]
389straightまっすぐに[ストレイト]
390forever永遠に[フォーエバー]
391ahead前に[アヘッド]
392elseその他に[エルス]
393sincerely心から・敬具[シンシアリー]
394away離れて[アウェイ]
395aloud声に出して[アラウド]
396somedayいつか[サムデイ]
397sometimeいつか[サムタイム]
398somehow何とかして・なぜか[サムハウ]
399somewhereどこかで・どこかに[サムウェア]
400everywhereどこでも・あらゆるところで[エブリウェア]
401anytimeいつでも[エニタイム]
402anywhereどこでも[エニウェア]
403according〜によると[アコーディング]
404per〜につき[パー]
405whether〜かどうか・〜であろうと[ウェザー]`;

// --- データセット3: ターゲット1900 (1~800) ---

const DATA_SETS = {
  master800: {
    id: 'master800',
    title: '英単語マスター 800',
    data: RAW_DATA_MASTER_800
  },
  englishGate: {
    id: 'englishGate',
    title: 'イングリッシュゲート',
    data: RAW_DATA_ENGLISH_GATE
  },
  seki_koko: {
    id: 'seki_koko',
    title: '関正生 難関高校英単語 (1-405)',
    data: RAW_DATA_SEKI_KOKO
  },
  target1900: {
    id: 'target1900',
    title: 'ターゲット1900 (1~800)',
    data: RAW_DATA_TARGET_1900
  },
  stock3000: {
    id: 'stock3000',
    title: 'Stock 3000',
    data: RAW_DATA_STOCK_3000
  },
  target1200: {
    id: 'target1200',
    title: 'ターゲット1200',
    data: RAW_DATA_TARGET_1200
  },
  target1400: {
    id: 'target1400',
    title: 'ターゲット1400',
    data: RAW_DATA_TARGET_1400
  },
  juniorHighIdioms: {
    id: 'juniorHighIdioms',
    title: '中学英熟語',
    data: RAW_DATA_JUNIOR_HIGH_IDIOMS
  },
  sutasapuIdioms: {
    id: 'sutasapuIdioms',
    title: 'スタサプ英熟語',
    data: RAW_DATA_SUTASAPU_IDIOMS
  }

};

// ==========================================
// 2. 型定義 & ユーティリティ
// ==========================================

const normalizeWordAndMeaning = (word, meaning) => {
  let normalizedWord = word.trim();
  let normalizedMeaning = meaning.trim();

  const trailingDigitsMatch = normalizedWord.match(/^(.*?)(\d+)$/);
  if (trailingDigitsMatch) {
    const baseWord = trailingDigitsMatch[1].trim();
    const digits = trailingDigitsMatch[2];
    if (baseWord.length > 0) {
      normalizedWord = baseWord;
      normalizedMeaning = `${digits}${normalizedMeaning}`;
    }
  }

  return { word: normalizedWord, meaning: normalizedMeaning };
};
const parseWordList = (rawData) => {
  const lines = rawData.split('\n').filter(line => line.trim() !== '');

  return lines.map(line => {
    // フォーマット: ID + Word + Meaning + [Reading]
    const match = line.match(/^(\d+)([a-zA-Z0-9\s\.\-\’\'\/!\?~]+)([^\[]+)(\[(.+?)\])?$/);

    if (!match) {
      const fallbackMatch = line.match(/^(\d+)([a-zA-Z0-9\s\.\-\’\'\/!\?~]+?)(.*)$/);
      if (!fallbackMatch) {
        return { id: 0, word: line, meaning: 'Parse Error', pronunciation: '', variations: [] };
      }
      const id = parseInt(fallbackMatch[1], 10);
      let word = fallbackMatch[2].trim();
      let meaningRaw = fallbackMatch[3].trim();
      ({ word, meaning: meaningRaw } = normalizeWordAndMeaning(word, meaningRaw));
      const splitRegex = /[、,／/\s\[\]\(\)（）]+/;
      const variations = meaningRaw.split(splitRegex).filter(s => s.length > 0);
      return { id, word, meaning: meaningRaw, pronunciation: '', variations };
    }

    const id = parseInt(match[1], 10);
    let word = match[2].trim();
    let meaningRaw = match[3].trim();
    ({ word, meaning: meaningRaw } = normalizeWordAndMeaning(word, meaningRaw));
    const pronunciation = match[5] ? match[5].trim() : ''; // []の中身

    // 区切り文字を強化
    const splitRegex = /[、,／/\s\[\]\(\)（）]+/;
    let variations = meaningRaw.split(splitRegex).filter(s => s.length > 0);

    const cleanVariations = variations.map(v => v.replace(/[〜\(\)（）\[\]]/g, '')).filter(v => v.length > 0);
    variations = [...new Set([...variations, ...cleanVariations])];

    return {
      id,
      word,
      meaning: meaningRaw,
      pronunciation,
      variations
    };
  });
};

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const attachDatasetMetadata = (words, datasetId) =>
  words.map(word => ({ ...word, datasetId }));

const VOICE_THRESHOLD = 0.22;
const QUESTION_MODE_STORAGE_KEY = 'word-test-app:question-mode';



// ==========================================
// 3. メインコンポーネント
// ==========================================

export default function App() {
  const [appState, setAppState] = useState('home');
  const [selectedDatasetId, setSelectedDatasetId] = useState('master800');
  const [questionMode, setQuestionMode] = useState('enToJa');
  const [currentStudent, setCurrentStudent] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [mistakesLoaded, setMistakesLoaded] = useState(false);

  // 選択されたデータセットに基づいて単語リストを生成
  const wordList = useMemo(() => {
    const dataset = Object.values(DATA_SETS).find(d => d.id === selectedDatasetId) || DATA_SETS.master800;
    return parseWordList(dataset.data);
  }, [selectedDatasetId]);

  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(10);
  const [isRandom, setIsRandom] = useState(false);
  const [timeLimit, setTimeLimit] = useState(1);
  const [flashcardPhase, setFlashcardPhase] = useState('question');

  const [testWords, setTestWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1);
  const [results, setResults] = useState([]);

  // 復習モード用のState
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [reviewTargetWords, setReviewTargetWords] = useState([]); // 復習で固定された単語リスト

  // 間違い単語リスト
  const [mistakeWords, setMistakeWords] = useState([]);
  const [isMistakeMode, setIsMistakeMode] = useState(false);
  const [isSpartanMode, setIsSpartanMode] = useState(false); // 徹底復習モード
  const [showSpartanResetOverlay, setShowSpartanResetOverlay] = useState(false);


  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedMode = window.localStorage.getItem(QUESTION_MODE_STORAGE_KEY);
    if (storedMode === 'enToJa' || storedMode === 'jaToEn') {
      setQuestionMode(storedMode);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(QUESTION_MODE_STORAGE_KEY, questionMode);
  }, [questionMode]);

  const timerRef = useRef(null);
  const spartanResetTimerRef = useRef(null);
  const sessionCorrectCountsRef = useRef({}); // セッションごとの連続正解数管理

  const addWordToMistakeList = useCallback((word) => {
    if (!word) return;
    setMistakeWords(prev => {
      const exists = prev.some(item => item.id === word.id && item.datasetId === word.datasetId);
      if (exists) return prev;
      return [...prev, { ...word }];
    });
  }, []);

  const removeWordFromMistakeList = useCallback((word) => {
    if (!word) return;
    setMistakeWords(prev => prev.filter(item => !(item.id === word.id && item.datasetId === word.datasetId)));
  }, []);

  const executeSpartanReset = useCallback(() => {
    if (spartanResetTimerRef.current) {
      clearTimeout(spartanResetTimerRef.current);
      spartanResetTimerRef.current = null;
    }

    // スパルタモードリセット時、2回連続正解した単語はリストから除外する
    setTestWords(prev => {
      // 現在の単語リストから、既にマスターした（2回連続正解）単語を除外
      const nextWords = prev.filter(word => {
        const key = `${word.datasetId}-${word.id}`;
        return (sessionCorrectCountsRef.current[key] || 0) < 2;
      });

      // もし全てマスターしてしまった場合は、空配列を返して終了判定へ任せる
      // （※この関数内で終了遷移まではしないが、Resultへの遷移は handleSelfCheck 側のフローで処理されるか、
      //   もしくはここで空になった場合、次のレンダリングで何かハンドリングが必要かも。
      //   現状のロジックだと空リストになると描画エラーになる可能性があるため、
      //   ここでのフィルタリング後に空なら、強制的にリザルトへ飛ばすなどの処置が安全だが、
      //   一旦空配列をセットし、useEffectなどで検知させるか、あるいは空の場合はリセットしない（=全クリ）扱いにする）

      if (nextWords.length === 0) {
        // 全単語マスター完了 -> 結果画面へ
        setAppState('result');
        return [];
      }

      return shuffleArray(nextWords);
    });

    setResults([]);
    setCurrentIndex(0);
    setFlashcardPhase('question');
    setShowSpartanResetOverlay(false);
  }, []);

  // 生徒変更時に間違いリストを読み込み
  useEffect(() => {
    setMistakesLoaded(false);
    if (currentStudent) {
      setMistakeWords(getStudentMistakes(currentStudent.id));
      setMistakesLoaded(true);
    } else {
      setMistakeWords([]);
    }
  }, [currentStudent]);

  // 間違いリスト変更時に保存 (ロード完了後のみ)
  useEffect(() => {
    if (currentStudent && mistakesLoaded) {
      saveStudentMistakes(currentStudent.id, mistakeWords);
    }
  }, [mistakeWords, currentStudent, mistakesLoaded]);

  const goHome = useCallback(() => {
    // リザルト画面からホームに戻る時、テスト結果を保存
    if (appState === 'result' && !isReviewMode && !isMistakeMode && currentStudent) {
      const actualCorrectCount = results.filter(r => r.isCorrect).length;
      const score = results.length > 0 ? Math.round((actualCorrectCount / results.length) * 100) : 0;

      saveTestResult({
        studentId: currentStudent.id,
        datasetId: selectedDatasetId,
        range: { start: rangeStart, end: rangeEnd },
        score: actualCorrectCount,
        total: results.length,
        mistakes: results.filter(r => !r.isCorrect).length
      });
    }

    setAppState('home');
    setIsMistakeMode(false);
    setIsReviewMode(false);
    setFlashcardPhase('question');
  }, [appState, isReviewMode, isMistakeMode, currentStudent, results, selectedDatasetId, rangeStart, rangeEnd]);

  // データセットが変更されたら、rangeEndを自動調整
  useEffect(() => {
    setRangeEnd(Math.min(10, wordList.length));
    setRangeStart(1);
  }, [wordList.length]);



  const speakWord = useCallback((text, datasetId, wordId, onEnd) => {
    // Custom Audio Logic for ALL datasets (MP3/M4A -> TTS)
    if (datasetId) {
      const filename = text.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const audioPath = `/audio/${datasetId}/${filename}.mp3`;
      const audio = new Audio(audioPath);

      const handleEnd = () => {
        if (onEnd) onEnd();
      };

      audio.onended = handleEnd;

      let isFallbackTriggered = false;

      const fallbackToM4AOrTTS = () => {
        if (isFallbackTriggered) return;
        isFallbackTriggered = true;

        // Fallback: Try m4a if mp3 fails
        if (audioPath.endsWith('.mp3')) {
          const m4aPath = audioPath.replace('.mp3', '.m4a');
          const audioM4a = new Audio(m4aPath);

          audioM4a.onended = handleEnd;

          // M4A Failures -> TTS
          const fallbackToTTS = () => {
            console.warn(`Audio m4a failed: ${filename}.m4a`);
            speakWordTTS(text, onEnd);
          };

          audioM4a.onerror = fallbackToTTS;

          audioM4a.play().catch(err => {
            console.warn(`Audio m4a play error: ${filename}.m4a`, err);
            fallbackToTTS();
          });
        } else {
          speakWordTTS(text, onEnd);
        }
      };

      audio.onerror = (e) => {
        console.warn(`Audio MP3 failed (onerror): ${filename}.mp3`, e);
        fallbackToM4AOrTTS();
      };

      audio.play().catch(e => {
        console.warn("Audio MP3 play error (catch)", e);
        fallbackToM4AOrTTS();
      });
      return;
    }

    speakWordTTS(text, onEnd);
  }, []);

  const speakWordTTS = (text, onEnd) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => { if (onEnd) onEnd(); };
      utterance.onerror = () => { if (onEnd) onEnd(); };
      window.speechSynthesis.speak(utterance);
    } else {
      if (onEnd) onEnd();
    }
  };

  const startTest = useCallback(() => {
    const validStart = Math.max(1, Math.min(rangeStart, wordList.length));
    const validEnd = Math.min(wordList.length, Math.max(rangeEnd, validStart));
    let words = wordList.filter(w => w.id >= validStart && w.id <= validEnd);

    if (words.length === 0) {
      alert('指定範囲に単語がありません');
      return;
    }

    words = attachDatasetMetadata(words, selectedDatasetId);
    if (isRandom) words = shuffleArray(words);

    setTestWords(words);
    setCurrentIndex(0);
    setResults([]);
    setIsReviewMode(false); // 通常テスト
    setIsMistakeMode(false);
    setFlashcardPhase('question');
    setAppState('test');
  }, [rangeStart, rangeEnd, wordList, isRandom, selectedDatasetId]);

  // 復習モード開始（初回）
  const startReview = useCallback(() => {
    const wrongWordIds = results.filter(r => !r.isCorrect).map(r => r.wordId);
    let reviewWords = wordList.filter(w => wrongWordIds.includes(w.id));

    if (reviewWords.length === 0) return;

    // 変更: 徹底復習を始める前に、直前のテスト結果を保存する
    if (!isReviewMode && !isMistakeMode && currentStudent) {
      const actualCorrectCount = results.filter(r => r.isCorrect).length;
      saveTestResult({
        studentId: currentStudent.id,
        datasetId: selectedDatasetId,
        range: { start: rangeStart, end: rangeEnd },
        score: actualCorrectCount,
        total: results.length,
        mistakes: results.filter(r => !r.isCorrect).length
      });
    }

    reviewWords = attachDatasetMetadata(reviewWords, selectedDatasetId);
    // 変更: 復習モードは設定に関わらず常にランダムにシャッフルする
    reviewWords = shuffleArray(reviewWords);

    // 復習ターゲットを固定
    setReviewTargetWords(reviewWords);
    setTestWords(reviewWords);
    setIsReviewMode(true); // 復習モードON
    setIsMistakeMode(false);

    // セッション正解数をリセット
    sessionCorrectCountsRef.current = {};

    setCurrentIndex(0);
    setResults([]);
    setFlashcardPhase('question');
    setAppState('test');
  }, [results, wordList, selectedDatasetId]); // isRandomへの依存を削除

  // 復習リトライ（リストを減らさずに再挑戦）
  const retryReview = useCallback(() => {
    // 変更: リトライ時も常にシャッフル
    let words = shuffleArray([...reviewTargetWords]);

    setTestWords(words);
    setCurrentIndex(0);
    setResults([]);
    setFlashcardPhase('question');
    setIsMistakeMode(false);

    // セッション正解数をリセット
    sessionCorrectCountsRef.current = {};

    setAppState('test');
  }, [reviewTargetWords]); // isRandomへの依存を削除

  const startMistakeDrill = useCallback(() => {
    if (mistakeWords.length === 0) return;
    let words = shuffleArray([...mistakeWords]);

    setTestWords(words);
    setCurrentIndex(0);
    setResults([]);
    setIsReviewMode(false);
    setIsMistakeMode(true);

    // セッション正解数をリセット
    sessionCorrectCountsRef.current = {};

    setFlashcardPhase('question');
    setAppState('test');
  }, [mistakeWords]);

  const handleRemoveCurrentMistakeWord = useCallback(() => {
    if (!isMistakeMode) return;
    const currentWord = testWords[currentIndex];
    if (!currentWord) return;

    removeWordFromMistakeList(currentWord);
    const updatedWords = testWords.filter(word => !(word.id === currentWord.id && word.datasetId === currentWord.datasetId));
    setTestWords(updatedWords);

    if (updatedWords.length === 0) {
      setResults([]);
      setCurrentIndex(0);
      goHome();
      return;
    }

    const nextIndex = Math.min(currentIndex, updatedWords.length - 1);
    setCurrentIndex(nextIndex);
    setFlashcardPhase('question');
  }, [isMistakeMode, testWords, currentIndex, removeWordFromMistakeList, goHome]);

  // 問題開始・フェーズ変更時の処理
  useEffect(() => {
    if (appState !== 'test') return;

    let isMounted = true;
    const currentWord = testWords[currentIndex];

    if (flashcardPhase === 'answer') {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    setTimeLeft(timeLimit);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const startTimer = () => {
      if (!isMounted) return;

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        if (!isMounted) {
          if (timerRef.current) clearInterval(timerRef.current);
          return;
        }
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setFlashcardPhase('answer');
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    if (!currentWord || flashcardPhase !== 'question') {
      return () => {
        isMounted = false;
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    }

    if (questionMode === 'enToJa') {
      const delayTimer = setTimeout(() => {
        if (!isMounted) return;

        speakWord(currentWord.word, currentWord.datasetId, currentWord.id, () => {
          if (isMounted) {
            startTimer();
          }
        });
      }, 600);

      return () => {
        isMounted = false;
        clearTimeout(delayTimer);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        window.speechSynthesis.cancel();
      };
    }

    startTimer();
    return () => {
      isMounted = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentIndex, appState, speakWord, testWords, timeLimit, flashcardPhase, questionMode]);


  const handleSelfCheck = useCallback((isCorrect) => {
    const currentWord = testWords[currentIndex];
    if (!currentWord) return;

    const key = `${currentWord.datasetId}-${currentWord.id}`;

    if (!isCorrect) {
      addWordToMistakeList(currentWord);
      // 間違えたら連続正解数をリセット
      sessionCorrectCountsRef.current[key] = 0;
    } else {
      // 正解したら連続正解数を +1 (undefinedなら1)
      sessionCorrectCountsRef.current[key] = (sessionCorrectCountsRef.current[key] || 0) + 1;
    }

    // --- 変更点: 復習モード & スパルタモードのサドンデス機能 ---
    // 修正: スパルタモードは「苦手モード」の時だけ有効にする (普通のテストには影響させない)
    if ((isReviewMode || (isSpartanMode && isMistakeMode)) && !isCorrect) {
      // alert削除 -> オーバーレイ表示へ変更
      setShowSpartanResetOverlay(true);

      // 1.5秒後にリセット実行
      spartanResetTimerRef.current = setTimeout(() => {
        executeSpartanReset();
      }, 1500);

      return;
    }
    // ---------------------------------------

    const result = {
      wordId: currentWord.id,
      word: currentWord.word,
      correctMeaning: currentWord.meaning,
      pronunciation: currentWord.pronunciation,
      transcript: '自己採点',
      isCorrect: isCorrect,
      status: isCorrect ? 'correct' : 'incorrect',
      datasetId: currentWord.datasetId
    };

    setResults(prev => [...prev, result]);

    if (currentIndex < testWords.length - 1) {
      setCurrentIndex(idx => idx + 1);
      setFlashcardPhase('question');
    } else {
      setAppState('result');
    }
  }, [testWords, currentIndex, isReviewMode, isSpartanMode, isRandom, addWordToMistakeList, executeSpartanReset]);

  const handleToggleCorrect = (index) => {
    setResults(prev => {
      const newResults = [...prev];
      const target = newResults[index];
      const newIsCorrect = !target.isCorrect;

      newResults[index] = {
        ...target,
        isCorrect: newIsCorrect,
        status: newIsCorrect ? 'correct' : 'incorrect',
        overridden: newIsCorrect
      };
      return newResults;
    });
  };

  // --- キーボード操作の実装 ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (appState === 'home') {
        if (e.key === 'Enter') {
          e.preventDefault();
          startTest();
        }
      } else if (appState === 'test') {
        if (flashcardPhase === 'question') {
          // Space or Enter to show answer
          if (e.code === 'Space' || e.key === 'Enter' || e.key === 'ArrowDown') {
            e.preventDefault(); // Prevent scroll
            setFlashcardPhase('answer');
          }
        } else if (flashcardPhase === 'answer') {
          // ArrowRight/Left for Yes/No
          if (e.key === 'ArrowRight' || e.key === 'y') {
            e.preventDefault();
            handleSelfCheck(true);
          } else if (e.key === 'ArrowLeft' || e.key === 'n') {
            e.preventDefault();
            handleSelfCheck(false);
          }
        }
      } else if (appState === 'result') {
        // Result画面でのキー操作
        if (e.key === 'Enter') {
          e.preventDefault();
          goHome();
        }
        // 'R'キーで復習スタートできるようにしても良いかも
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appState, flashcardPhase, startTest, handleSelfCheck, goHome]);


  const handleDownloadPDF = () => {
    const wrongAnswers = results.filter(r => !r.isCorrect);

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <title>英単語テスト 復習リスト</title>
        <style>
          body { font-family: "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif; padding: 40px; color: #333; }
          h1 { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
          .meta { text-align: right; margin-bottom: 30px; font-size: 0.9em; color: #666; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #999; padding: 12px; text-align: left; }
          th { background-color: #f0f0f0; width: 10%; }
          .col-word { width: 25%; font-weight: bold; font-size: 1.2em; }
          .col-pron { width: 15%; font-size: 0.9em; color: #555; }
          .col-check { width: 10%; text-align: center; }
          .check-box { display: inline-block; width: 15px; height: 15px; border: 1px solid #333; }
          @media print {
            .no-print { display: none; }
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <h1>英単語テスト 復習リスト</h1>
        <div class="meta">実施日: ${new Date().toLocaleDateString()}</div>
        ${wrongAnswers.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>英単語</th>
                <th>読み方</th>
                <th>意味</th>
                <th class="col-check">確認</th>
              </tr>
            </thead>
            <tbody>
              ${wrongAnswers.map(res => `
                <tr>
                  <td>${res.wordId}</td>
                  <td class="col-word">${res.word}</td>
                  <td class="col-pron">${res.pronunciation}</td>
                  <td>${res.correctMeaning}</td>
                  <td class="col-check"><span class="check-box"></span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : `<p style="text-align:center; font-size: 1.2em; margin-top: 50px;">全問正解です！素晴らしい！</p>`}
        
        <div class="no-print" style="text-align: center; margin-top: 30px;">
          <p style="font-size: 14px; color: #333; margin-bottom: 15px; font-weight: bold;">
            このページを「PDFとして保存」してください
          </p>
          <button onclick="window.print()" style="padding: 12px 24px; font-size: 16px; cursor: pointer; background: #333; color: #fff; border: none; border-radius: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
            印刷 / PDF保存画面を開く
          </button>
        </div>
        <script>
          setTimeout(() => {
            window.print();
          }, 800);
        </script>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  // ==========================================
  // UI Render
  // ==========================================

  if (!currentStudent) {
    return <StudentManager onSelectStudent={setCurrentStudent} />;
  }

  if (showHistory) {
    return (
      <HistoryView
        student={currentStudent}
        onBack={() => setShowHistory(false)}
      />
    );
  }

  if (appState === 'home') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-slate-800 font-sans">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">

          <div className="flex items-center justify-between w-full mb-6 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                {currentStudent.name.charAt(0)}
              </div>
              <span className="font-bold text-slate-700">{currentStudent.name}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowHistory(true)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors" title="学習記録">
                <Clock className="w-5 h-5" />
              </button>
              <button onClick={() => setCurrentStudent(null)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="ユーザー切り替え">
                <Users className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mb-6 flex justify-center">
            <div className="bg-indigo-100 p-4 rounded-full">
              <BookOpen className="w-10 h-10 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">英単語 暗記カード</h1>
          <p className="text-slate-500 mb-8 text-sm">英→日／日→英の2モードで瞬発力を鍛えよう！</p>

          <div className="bg-slate-100 rounded-lg p-6 mb-8 text-left space-y-6">

            {/* 単語帳選択 */}
            <div>
              <div className="flex items-center gap-2 mb-2 text-slate-700 font-semibold"><Library className="w-5 h-5" /><span>単語帳を選択</span></div>
              <select
                value={selectedDatasetId}
                onChange={(e) => setSelectedDatasetId(e.target.value)}
                className="w-full p-3 border rounded-lg bg-white font-bold text-slate-800 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {Object.values(DATA_SETS).map(dataset => (
                  <option key={dataset.id} value={dataset.id}>{dataset.title}</option>
                ))}
              </select>
            </div>

            {/* 出題形式 */}
            <div>
              <div className="flex items-center gap-2 mb-2 text-slate-700 font-semibold"><Keyboard className="w-5 h-5" /><span>出題形式</span></div>
              <div className="flex items-center justify-between bg-white p-1 rounded-lg border border-slate-200">
                <button
                  onClick={() => setQuestionMode('enToJa')}
                  className={`flex-1 py-3 rounded-md text-sm font-bold transition-all flex flex-col gap-1 ${questionMode === 'enToJa' ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <span className="text-base font-black">英 → 日</span>
                  <span className="text-[10px] tracking-widest uppercase">Word → 意味</span>
                </button>
                <button
                  onClick={() => setQuestionMode('jaToEn')}
                  className={`flex-1 py-3 rounded-md text-sm font-bold transition-all flex flex-col gap-1 ${questionMode === 'jaToEn' ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <span className="text-base font-black">日 → 英</span>
                  <span className="text-[10px] tracking-widest uppercase">意味 → Word</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {questionMode === 'enToJa' ? '英単語が表示されるので和訳を答えます。' : '日本語の意味が表示されるので英単語を答えます。'}
              </p>
            </div>



            {/* 出題範囲 */}
            <div>
              <div className="flex items-center gap-2 mb-4 text-slate-700 font-semibold"><Settings className="w-5 h-5" /><span>出題範囲 (No.1 - {wordList.length})</span></div>
              <div className="flex items-center gap-4 justify-between">
                <div className="flex-1"><label className="block text-xs text-slate-500 mb-1">Start</label><input type="number" value={rangeStart} onChange={(e) => setRangeStart(Number(e.target.value))} className="w-full p-2 border rounded text-center text-lg font-bold" /></div>
                <span className="text-slate-400 px-2">〜</span>
                <div className="flex-1"><label className="block text-xs text-slate-500 mb-1">End</label><input type="number" value={rangeEnd} onChange={(e) => setRangeEnd(Number(e.target.value))} className="w-full p-2 border rounded text-center text-lg font-bold" /></div>
              </div>
            </div>

            {/* 制限時間 */}
            <div>
              <div className="flex items-center gap-2 mb-2 text-slate-700 font-semibold"><Clock className="w-5 h-5" /><span>制限時間 (秒)</span></div>
              <div className="flex items-center justify-between bg-white p-1 rounded-lg border border-slate-200">
                {[1, 3, 5, 10, 15, 20].map((sec) => (
                  <button key={sec} onClick={() => setTimeLimit(sec)} className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${timeLimit === sec ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{sec}秒</button>
                ))}
              </div>
            </div>

            {/* 設定スイッチ群 */}
            <div className="space-y-3">
              {/* 出題順 */}
              <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                <button onClick={() => setIsRandom(false)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-bold transition-all ${!isRandom ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><ListOrdered className="w-4 h-4" /> 順番通り</button>
                <button onClick={() => setIsRandom(true)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-bold transition-all ${isRandom ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><Shuffle className="w-4 h-4" /> ランダム</button>
              </div>
            </div>

          </div>

          <button onClick={startTest} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2">
            <Play className="w-5 h-5" /> テストを開始 <span className="text-indigo-200 text-xs font-normal ml-2">[Enter]</span>
          </button>

          <div className="mt-6 bg-slate-100 rounded-xl p-5 text-left border border-slate-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-slate-600 font-semibold mb-1">
                  <AlertCircle className="w-4 h-4" /> 苦手単語リスト
                </div>
                <p className="text-3xl font-black text-slate-800">
                  {mistakeWords.length}
                  <span className="text-base font-medium text-slate-500 ml-1">単語</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">テストで間違えた単語が自動追加されます</p>
              </div>
              <div className="flex flex-col items-stretch gap-3 w-48">
                {mistakeWords.length > 0 && (
                  <div
                    onClick={() => setIsSpartanMode(prev => !prev)}
                    className={`cursor-pointer border-2 rounded-xl p-2 transition-all group ${isSpartanMode ? 'bg-indigo-50 border-indigo-500' : 'bg-white border-slate-200 hover:border-indigo-300'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold ${isSpartanMode ? 'text-indigo-700' : 'text-slate-600'}`}>徹底復習モード</span>
                      <div className={`relative w-8 h-4 rounded-full transition-colors ${isSpartanMode ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                        <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${isSpartanMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
                      </div>
                    </div>
                    <div className="text-[9px] text-slate-500 leading-tight">
                      1ミスで即終了＆リセット。<br />完璧を目指す鬼モード。
                    </div>
                  </div>
                )}

                <button
                  onClick={startMistakeDrill}
                  disabled={mistakeWords.length === 0}
                  className={`w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 ${mistakeWords.length === 0 ? 'bg-white text-slate-300 border border-dashed border-slate-200 cursor-not-allowed' : isSpartanMode ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200' : 'bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-200'}`}
                >
                  <Repeat className="w-4 h-4" />
                  {isSpartanMode ? '徹底復習開始' : '苦手を練習'}
                </button>
              </div>
            </div>
            {mistakeWords.length > 0 && (
              <div className="mt-3 text-xs text-slate-500">
                <span className="font-bold text-slate-600">最近追加:</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {mistakeWords.slice(-5).map(word => (
                    <span key={`${word.datasetId}-${word.id}`} className="bg-white px-2 py-1 rounded-full border border-slate-200 text-slate-600 font-semibold">
                      {word.word}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (appState === 'test') {
    const currentWord = testWords[currentIndex];
    if (!currentWord) return null;
    const progressPercent = ((currentIndex + 1) / testWords.length) * 100;
    const answerButtonDisabled = false;
    const isEnglishQuestion = questionMode === 'enToJa';
    const isEnglishVisible = isEnglishQuestion || flashcardPhase === 'answer';
    const questionText = isEnglishQuestion ? currentWord.word : currentWord.meaning;
    const questionHeadingClass = `${isEnglishQuestion ? 'text-5xl leading-tight' : 'text-3xl leading-relaxed'} font-extrabold tracking-tight break-words mb-4`;
    const audioButtonTitle = isEnglishQuestion ? '英単語をもう一度聞く' : '答えの英単語を聞く';

    return (
      <div className={`min-h-screen text-white flex flex-col items-center p-4 relative overflow-hidden transition-colors duration-500 ${isReviewMode ? 'bg-slate-800' : isMistakeMode ? 'bg-slate-800' : 'bg-slate-900'}`}>
        {isReviewMode && (
          <div className="absolute top-0 w-full bg-red-500/10 h-full pointer-events-none z-0"></div>
        )}
        {isMistakeMode && !isReviewMode && (
          <div className="absolute top-0 w-full bg-amber-400/10 h-full pointer-events-none z-0"></div>
        )}

        <div className="w-full max-w-md absolute top-0 left-0 h-2 bg-slate-800 z-20">
          <div className={`h-full transition-all duration-500 ease-out ${isReviewMode ? 'bg-red-500' : isMistakeMode ? 'bg-amber-400' : 'bg-green-500'}`} style={{ width: `${progressPercent}%` }} />
        </div>

        <div className="w-full max-w-md mt-6 flex justify-between items-center text-sm text-slate-400 z-10">
          <span className="font-mono text-white font-bold">
            {isReviewMode && <span className="text-red-400 mr-2 font-bold animate-pulse">復習中 (全問正解まで継続)</span>}
            {!isReviewMode && isMistakeMode && <span className="text-amber-300 mr-2 font-bold animate-pulse">苦手単語モード</span>}
            {currentIndex + 1} <span className="text-slate-600">/</span> {testWords.length}
          </span>
          <button onClick={goHome} className="text-slate-500 hover:text-white">中断</button>
        </div>

        {/* --- 共通: 単語表示エリア --- */}
        <div className="flex-1 w-full max-w-md flex flex-col justify-center items-center relative z-10">
          <div className="mb-10 relative">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 text-3xl font-bold transition-colors ${timeLeft <= 3 ? 'border-red-500 text-red-500' : (isReviewMode ? 'border-red-400 text-red-400' : isMistakeMode ? 'border-amber-400 text-amber-200' : 'border-indigo-500 text-indigo-400')}`}>
              {flashcardPhase === 'answer' ? <Layers className="w-10 h-10" /> : timeLeft}
            </div>
          </div>

          <div className="w-full bg-white text-slate-900 rounded-3xl p-8 text-center shadow-2xl mb-8 min-h-[220px] flex flex-col justify-center relative">
            <span className="text-sm text-slate-400 font-bold tracking-widest uppercase mb-2">No.{currentWord.id}</span>
            <h2 className={questionHeadingClass}>{questionText}</h2>
            {isEnglishVisible && (
              <button
                onClick={() => speakWord(currentWord.word, currentWord.datasetId, currentWord.id)}
                className="absolute top-4 right-4 p-2 text-indigo-200 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                title={audioButtonTitle}
              >
                <Volume2 className="w-6 h-6" />
              </button>
            )}

            {flashcardPhase === 'answer' && (
              <div className="mt-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4">
                {questionMode === 'enToJa' ? (
                  <>
                    {currentWord.pronunciation && <p className="text-lg text-slate-500 mb-1">({currentWord.pronunciation})</p>}
                    <p className="text-xl font-bold text-indigo-600">{currentWord.meaning}</p>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-slate-400 font-semibold tracking-widest uppercase mb-1">英単語</p>
                    <p className="text-3xl font-black text-slate-900">{currentWord.word}</p>
                    {currentWord.pronunciation && <p className="text-lg text-slate-500 mt-1">({currentWord.pronunciation})</p>}
                  </>
                )}
              </div>
            )}
          </div>
        </div>



        {/* --- 操作ボタン --- */}
        <div className="w-full max-w-md mb-8 z-10">
          {flashcardPhase === 'question' ? (
            <button
              onClick={() => setFlashcardPhase('answer')}
              disabled={answerButtonDisabled}
              className={`w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 text-lg flex items-center justify-center gap-2 ${isReviewMode ? 'bg-red-600 hover:bg-red-700 shadow-red-900/50' : isMistakeMode ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-900/30 text-slate-900' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-900/50'} ${answerButtonDisabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <Eye className="w-5 h-5" /> 答えを見る <span className={`${isReviewMode ? 'text-red-300' : isMistakeMode ? 'text-amber-100' : 'text-indigo-300'} text-xs font-normal ml-2`}>[Space]</span>
            </button>
          ) : (
            <div className="flex gap-3">
              <button onClick={() => handleSelfCheck(false)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                <ThumbsDown className="w-5 h-5" /> わからない <span className="text-red-200 text-xs font-normal ml-1">[←]</span>
              </button>
              <button onClick={() => handleSelfCheck(true)} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                <ThumbsUp className="w-5 h-5" /> わかった <span className="text-green-200 text-xs font-normal ml-1">[→]</span>
              </button>
            </div>
          )}
          {isMistakeMode && (
            <button onClick={handleRemoveCurrentMistakeWord} className="mt-3 w-full border border-amber-300 text-amber-200 hover:bg-white/10 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
              <XCircle className="w-4 h-4" /> この単語を苦手リストから外す
            </button>
          )}
        </div>

        {/* Spartan Mode Reset Overlay */}
        {showSpartanResetOverlay && (
          <div className="absolute inset-0 z-50 bg-slate-900/95 flex flex-col items-center justify-center animate-in fade-in duration-300">
            <div className="text-center p-8">
              <div
                onClick={executeSpartanReset}
                className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 cursor-pointer hover:bg-slate-700 transition-colors active:scale-95"
              >
                <XCircle className="w-10 h-10 text-slate-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">TRY AGAIN</h2>
            </div>
          </div>
        )}
      </div >
    );
  }

  if (appState === 'result') {
    // 手動修正も反映した正しい正解数を計算
    const actualCorrectCount = results.filter(r => r.isCorrect).length;
    const score = Math.round((actualCorrectCount / results.length) * 100) || 0;
    const wrongAnswers = results.filter(r => !r.isCorrect);

    if (isMistakeMode) {
      const remaining = mistakeWords.length;
      return (
        <div className="min-h-screen bg-amber-50 flex flex-col items-center p-4 font-sans">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <Layers className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">苦手単語フラッシュカード</h2>
            <p className="text-slate-500 text-sm mb-6">今回学習した単語: {results.length}語</p>

            <div className="bg-slate-100 rounded-xl p-4 text-left mb-6">
              <p className="text-sm text-slate-500">リストに残っている単語</p>
              <p className="text-4xl font-black text-slate-800 mt-1">{remaining}<span className="text-base text-slate-500 font-medium ml-1">語</span></p>
              {remaining === 0 && <p className="text-sm text-amber-500 mt-1 font-semibold">全て外せました！</p>}
            </div>

            {remaining > 0 ? (
              <button onClick={startMistakeDrill} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mb-3">
                <Repeat className="w-5 h-5" /> 残りを続けて練習
              </button>
            ) : (
              <div className="mb-3 text-sm text-slate-500">リストは空です。通常のテストに戻りましょう！</div>
            )}

            <button onClick={goHome} className="w-full border border-slate-200 text-slate-600 font-bold py-4 rounded-xl hover:bg-slate-50 flex items-center justify-center gap-2">
              <BookOpen className="w-5 h-5" /> ホームに戻る
            </button>

            {remaining > 0 && (
              <div className="mt-6 text-left">
                <div className="text-xs font-bold text-slate-500 mb-2">現在のリスト</div>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {mistakeWords.map(word => (
                    <span key={`${word.datasetId}-${word.id}`} className="px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
                      {word.word}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // 復習モードで全問正解した場合
    if (isReviewMode && wrongAnswers.length === 0) {
      return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center p-4 font-sans text-white">
          <div className="w-full max-w-md flex-1 flex flex-col justify-center items-center pb-10">
            <div className="bg-yellow-500/20 p-6 rounded-full mb-6 animate-bounce">
              <Trophy className="w-16 h-16 text-yellow-500" />
            </div>
            <h2 className="text-3xl font-bold mb-2 text-center text-yellow-400">復習完了！</h2>
            <p className="text-slate-300 mb-8 text-center">
              おめでとうございます！<br />
              苦手な {results.length} 単語をすべて克服しました。
            </p>

            <button onClick={goHome} className="w-full max-w-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl shadow-lg shadow-indigo-900/50 text-xl flex items-center justify-center gap-2 transition-all transform active:scale-95">
              <BookOpen className="w-6 h-6" /> ホームに戻る
            </button>
          </div>
        </div>
      );
    }

    // 通常のリザルト画面
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 font-sans">
        <div className="w-full max-w-md pb-32 no-print">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center mb-6">
            {wrongAnswers.length === 0 ? (
              <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-2 animate-bounce" />
            ) : (
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-8 h-8 text-slate-400" />
              </div>
            )}

            <h2 className="text-lg text-slate-500 font-bold">SCORE</h2>
            <div className="text-6xl font-black text-slate-800 my-2">{score}<span className="text-2xl text-slate-400 font-normal">pts</span></div>
            <div className="text-slate-400 font-medium">{actualCorrectCount} / {results.length} 正解</div>

            {wrongAnswers.length === 0 && (
              <div className="mt-4 text-indigo-600 font-bold bg-indigo-50 py-2 px-4 rounded-full inline-block animate-pulse">
                Perfect!! 🎉
              </div>
            )}
          </div>

          {/* 復習・保存ボタンエリア */}
          {wrongAnswers.length > 0 && (
            <div className="mb-8 space-y-3">
              <div className="text-center text-sm font-bold text-slate-600 mb-1">間違えた単語: {wrongAnswers.length}問</div>

              {/* 復習開始ボタン */}
              <button onClick={startReview} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all transform active:scale-95">
                <Sparkles className="w-5 h-5 animate-pulse" /> 徹底復習する (全問正解まで)
              </button>

              <button onClick={handleDownloadPDF} className="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all">
                <Download className="w-5 h-5" /> 復習リストをPDF保存
              </button>
            </div>
          )}

          <div className="text-xs text-center text-slate-400 mb-4">※「修正」ボタンで正解に変更できます</div>

          <h3 className="text-sm font-bold text-slate-500 mb-2 ml-2">全回答 (確認・修正)</h3>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {results.map((res, idx) => (
              <div key={idx} className={`p-3 border-b border-slate-100 last:border-0 flex items-center gap-3 ${!res.isCorrect ? 'bg-red-50/50' : ''}`}>
                <div className="flex-shrink-0">{res.isCorrect ? <CheckCircle className={`w-6 h-6 ${res.overridden ? 'text-indigo-500' : 'text-green-500'}`} /> : <XCircle className="w-6 h-6 text-red-400" />}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-800">{res.word}</span>
                    <span className="text-xs text-slate-400">No.{res.wordId}</span>
                  </div>
                  <div className="text-xs text-slate-400 truncate">意味: {res.correctMeaning}</div>
                  {res.overridden && <div className="text-[10px] text-indigo-500 font-bold mt-1">手動修正済み</div>}
                </div>
                <button onClick={() => handleToggleCorrect(idx)} className={`p-2 rounded-lg text-xs font-bold transition-colors flex flex-col items-center gap-1 min-w-[60px] ${res.isCorrect ? 'bg-slate-100 text-slate-400 hover:bg-slate-200' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'}`}><Edit2 className="w-4 h-4" /> {res.isCorrect ? '戻す' : '修正'}</button>
              </div>
            ))}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 shadow-lg-top flex justify-center z-50 no-print">
          <div className="w-full max-w-md">
            <button onClick={goHome} className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
              <RotateCcw className="w-4 h-4" /> ホームに戻る <span className="text-slate-400 text-xs font-normal ml-2">[Enter]</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
