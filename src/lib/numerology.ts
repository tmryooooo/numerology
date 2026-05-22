// ── 計算ロジック ──────────────────────────────
export const VOWELS = new Set(["A","E","I","O","U"]);
export const PYTHAGOREAN: Record<string, number> = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8
};

export function reduce(n: number, allowMaster = true): number {
  while (n > 9 && !(allowMaster && (n===11||n===22||n===33))) {
    n = String(n).split("").reduce((a,d)=>a+parseInt(d),0);
  }
  return n;
}

export interface NumerologyResult {
  lifePath: number;
  birthday: number;
  destiny: number;
  soul: number;
  personality: number;
  maturity: number;
  personalYear: number;
}

export function calcAll(name: string, date: string): NumerologyResult {
  const digits = date.replace(/-/g,"").split("").map(Number);
  const lifePath = reduce(digits.reduce((a,b)=>a+b,0));
  const birthday = reduce(parseInt(date.split("-")[2]));
  const letters = name.toUpperCase().replace(/[^A-Z]/g,"");
  const destiny = reduce(letters.split("").reduce((a,c)=>a+(PYTHAGOREAN[c]||0),0));
  const soul = reduce(letters.split("").filter(c=>VOWELS.has(c)).reduce((a,c)=>a+(PYTHAGOREAN[c]||0),0)||0);
  const personality = reduce(letters.split("").filter(c=>!VOWELS.has(c)).reduce((a,c)=>a+(PYTHAGOREAN[c]||0),0)||0);
  const maturity = reduce(lifePath+destiny);
  const [,m,d] = date.split("-").map(Number);
  const yr = new Date().getFullYear();
  const pySum = String(m).split("").map(Number).reduce((a,b)=>a+b,0)
              + String(d).split("").map(Number).reduce((a,b)=>a+b,0)
              + String(yr).split("").map(Number).reduce((a,b)=>a+b,0);
  const personalYear = reduce(pySum,false);
  return {lifePath,birthday,destiny,soul,personality,maturity,personalYear};
}

// ── 解説データ ────────────────────────────────
export interface NumberData {
  keywords: string;
  essence: string;
  strengths: string[];
  challenges: string[];
  message: string;
}

export const DATA: Record<number, NumberData> = {
  1:{keywords:"始まり、リーダーシップ、独立、開拓",essence:"物事の始まりを司るエネルギー。強い意志と主体性を持ち、誰よりも早く新しい道を切り拓く力がある。自らの力で人生を創造していく魂。",strengths:["行動力と決断力に優れ、誰よりも早く動ける","独創的な発想で新しい道を切り拓く","強い意志で困難をも突破するパワーを持つ"],challenges:["独りよがりになりやすく、他者の意見が入りにくい","協調することもまた強さであると学ぶ"],message:"あなたは「最初の一歩」そのもの。\n恐れず踏み出すその背中が、誰かの勇気になる。"},
  2:{keywords:"協調、パートナーシップ、受容、調和",essence:"相手を受け止め支えるエネルギー。2つのものを融合させ橋渡しをする才能を持つ。目立たない場所で世界のバランスを保つ、なくてはならない存在。",strengths:["繊細な共感力で相手の心を深く理解できる","異なる立場の人々を調和させる橋渡し力","直感が鋭く、言葉にならないものを感じ取る"],challenges:["自己主張が弱くなりがちで、本音を隠してしまう","他者への依存や承認欲求に気づき、自立を育む"],message:"静けさの中にこそ、あなたの力は宿っている。\n誰かを支えるその手が、世界を動かしている。"},
  3:{keywords:"創造、表現、喜び、コミュニケーション",essence:"創造と表現のエネルギー。言葉・芸術・遊びを通じて世界に喜びをもたらす。人々の心を明るくする天性の表現者。",strengths:["言葉や芸術で人の心を動かす表現力","明るいユーモアで場の空気を変える力","楽観的な視点で可能性を広げる"],challenges:["散漫になりやすく、深みより広さに流れがち","感情の波に乗りすぎず、継続する力を育む"],message:"あなたの笑顔は、誰かの暗闇に灯る光。\n表現することを恐れないで。それがあなたの使命。"},
  4:{keywords:"安定、基盤、努力、誠実",essence:"地道な努力で確実に基盤を築くエネルギー。秩序と規律を重んじ、長期的な視点で物事を組み立てる。信頼と堅実さの象徴。",strengths:["粘り強い忍耐力と緻密な計画力","約束を守る誠実さで深い信頼を得る","コツコツとした積み重ねで確かな成果を出す"],challenges:["融通が利きにくく、変化への抵抗を手放す","完璧主義に陥らず、「十分」を認める柔軟さを持つ"],message:"あなたが築くものは、嵐にも揺るがない。\n一歩一歩が、未来への最も確かな道。"},
  5:{keywords:"自由、変化、冒険、多様性",essence:"自由と変化を求める魂。多くの経験を通じて成長し、人々に刺激と新しい視点を与える。生きることそのものを冒険にする存在。",strengths:["どんな環境にも素早く適応できる柔軟性","旺盛な好奇心で多彩な経験と知識を持つ","人々に変化と刺激をもたらす触媒的な存在感"],challenges:["飽きっぽさから逃げ癖がつかないよう意識する","自由を求めるあまり、責任から目をそらさない"],message:"あなたの人生は、型にはまらない物語。\n変化を恐れず、風のように生きることが答え。"},
  6:{keywords:"愛、奉仕、責任、調和",essence:"愛と奉仕のエネルギー。家族・コミュニティへの責任感が強く、人を癒し守る力を持つ。愛することで自分も輝く、愛の体現者。",strengths:["深い思いやりで人を包み込む養育力","場全体のバランスを整える調和感覚","美意識が高く、環境や関係を美しく整える"],challenges:["完璧主義から他者への過干渉になりやすい","自分自身を愛することが他者を愛する土台と気づく"],message:"与えるほど豊かになるのが、あなたの愛。\nまず自分を満たして、その光を分け与えよう。"},
  7:{keywords:"内省、知性、真理探究、精神性",essence:"真理と知識を探求する魂。深い洞察力と精神性を持ち、物事の本質を見抜く。孤独を力に変え、叡智を世界に還す求道者。",strengths:["深い分析力と鋭い直感で本質を見抜く","一つの分野を極める専門性と探究心","精神的な深みと独特の哲学的視点"],challenges:["孤立しやすく、不信感から心を閉ざさない","頭だけでなく、感情と体の声も信頼する"],message:"あなたの問いは、世界を深くする。\n孤独は弱さではなく、叡智が生まれる場所。"},
  8:{keywords:"力、豊かさ、達成、現実創造",essence:"物質世界での達成と豊かさのエネルギー。目標を実現する強い実行力を持ち、大きなビジョンを形にする力がある。豊かさを循環させる器。",strengths:["目標に向かって動き続ける強い実行力","全体を見渡し組織を動かすリーダーシップ","現実的な判断力で成果を着実に上げる"],challenges:["支配欲や物質主義に偏りすぎないバランスを保つ","力を誇示するより、人を活かすことに使う"],message:"あなたが動けば、世界が動く。\n豊かさは独占するためではなく、循環させるためにある。"},
  9:{keywords:"博愛、完成、人道、普遍的愛",essence:"1〜9の集大成。広い視野と深い共感で人類全体に貢献しようとするエネルギー。個を超えた愛で世界を照らす、魂の完成形。",strengths:["広い包容力で誰でも受け入れる深い愛","芸術・思想・癒しで人の心に触れる力","人類全体への貢献意識と高い精神性"],challenges:["自己犠牲になりすぎず、自分の境界線を守る","過去へのこだわりを手放し、次のサイクルへ進む"],message:"あなたの愛は、国境も時代も超える。\n手放すことで、より大きなものが流れ込んでくる。"},
  11:{keywords:"直感、啓示、霊性、インスピレーション",essence:"【マスターナンバー】高い直感力と霊的感受性を持ち、人々に気づきをもたらす光の存在。2の協調性とリーダーシップが融合した、使命の数字。",strengths:["鋭い直感と先見性で時代を先読みする","カリスマ的な存在感で人々を自然と引き寄せる","深い感受性で芸術・精神性の分野に才能を発揮"],challenges:["過敏さによるエネルギー消耗に注意する","理想と現実のギャップに苦しまず、地に足をつける"],message:"あなたの閃きは、宇宙からのメッセージ。\n光を受け取るだけでなく、それを世界に届けよう。"},
  22:{keywords:"ビジョン、実現、建設、偉業",essence:"【マスタービルダー】壮大なビジョンを現実に変える力を持つ。4の実直さと11の直感が統合された、大きな使命と責任を担う数字。",strengths:["壮大な夢を現実に落とし込む稀有な実現力","長期的なビジョンで社会構造を変える大局観","揺るぎない意志と忍耐で偉業を成し遂げる"],challenges:["重すぎる使命感でプレッシャーに潰されない","完璧主義を超え、不完全な一歩を踏み出す"],message:"あなたは世界を設計する建築家。\nその夢は大きすぎない。ただ一つずつ積み上げていけばいい。"},
  33:{keywords:"無条件の愛、癒し、奉仕、マスターティーチャー",essence:"【マスターナンバー最高位】無条件の愛と深い癒しで多くの人を導く使命を持つ。6の愛と22の実現力が融合した、精神的指導者の数字。",strengths:["損得を超えた無条件の愛で人を包み込む","深い癒しと教育力で多くの魂に光をもたらす","精神的な影響力で時代を超えた価値を残す"],challenges:["自己犠牲が過剰になり燃え尽きないよう守る","使命の重さを軽やかに担う軽さを持つ"],message:"あなたの愛は、出会う人の人生を変える。\nその光を絶やさないために、まず自分を愛し続けよう。"},
};

export interface PyData {
  theme: string;
  body: string;
  action: string;
  caution: string;
}

export const PY_DATA: Record<number, PyData> = {
  1:{theme:"新しい始まり・種まきの年",body:"9年サイクルの出発点。新しいプロジェクト、転職、引っ越しなど、これから育てていくものの種を蒔く最適な年。勇気を持って最初の一歩を踏み出すことが、この年の最大のテーマ。",action:"新しいことを始める、独立・起業、自己投資",caution:"焦りは禁物。方向性をしっかり定めてから動く"},
  2:{theme:"育む・待つ・深める年",body:"昨年蒔いた種を丁寧に育てる年。焦らず関係を深め、協力やパートナーシップを大切にする時期。直感を信じ、水面下での準備と内面の充実が実を結ぶ。",action:"人間関係を深める、チームワーク、内省・学び",caution:"焦って動かない。見えない進展を信頼する"},
  3:{theme:"表現・創造・交流の年",body:"自己表現と創造性が花開く年。人との交流が活発になり、楽しみながら可能性を広げる時期。明るく積極的に発信することで、思わぬ縁とチャンスが訪れる。",action:"発信・創作活動、人脈を広げる、楽しむことを優先",caution:"感情の浮き沈みに流されず、継続性を意識する"},
  4:{theme:"基盤を固める・整える年",body:"地道な努力と計画が実を結ぶ年。焦らず着実に土台を作ることが重要。健康管理・財務整理・環境整備など、長期的な安定に向けた堅実な行動が吉。",action:"計画を立てる、健康・財務の見直し、スキルを磨く",caution:"焦りや近道を求めない。コツコツの積み重ねが全て"},
  5:{theme:"変化・自由・動き出す年",body:"大きな変化が訪れる年。新しい経験に開かれた姿勢が重要で、旅行・学び・環境の変化など行動範囲が広がる。変化を恐れず、流れに乗って動くことが鍵。",action:"環境を変える、新しい体験、旅行・学習・挑戦",caution:"衝動的な決断に注意。変化の中でも軸を保つ"},
  6:{theme:"愛・家族・責任の年",body:"人間関係と家庭に焦点が当たる年。奉仕・責任・愛情が試される時期。コミュニティへの貢献や、大切な人との絆を深めることが、この年の豊かさにつながる。",action:"家族・パートナーとの時間、地域貢献、環境を整える",caution:"自己犠牲になりすぎない。自分のケアも忘れずに"},
  7:{theme:"内省・探究・充電の年",body:"内面を深める静かな年。一人の時間を確保し、スピリチュアルな探求や学びに集中する時期。表面的な成果を焦らず、深化と充電に集中することで来年の飛躍を準備する。",action:"学問・研究・瞑想、一人時間を確保、専門性を深める",caution:"孤立しすぎない。信頼できる人との対話も大切に"},
  8:{theme:"達成・収穫・豊かさの年",body:"これまでの努力が形になる年。仕事・金銭面でのチャンスが増え、大きな成果が期待できる時期。野心を持って積極的に行動することで、豊かさの扉が開く。",action:"昇進・独立・投資、大きな目標に挑戦、実績を積む",caution:"力の過信に注意。人への感謝と謙虚さを忘れない"},
  9:{theme:"完成・手放し・感謝の年",body:"9年サイクルの終わり。不要なものを手放し、次のサイクルへの準備をする年。人・もの・考え方など、今の自分には合わなくなったものを感謝とともに手放すことが、来年の新しい始まりを豊かにする。",action:"断捨離・終わらせる、感謝を伝える、総括と振り返り",caution:"新しいことを無理に始めない。手放しの勇気を持つ"},
};

export const LABELS: Record<string, string> = {
  lifePath:"ライフパス数",
  birthday:"バースデー数",
  destiny:"ディステニー数",
  soul:"ソウルナンバー",
  personality:"パーソナリティ数",
  maturity:"マチュリティー数",
  personalYear:"パーソナルイヤー",
};

export const DESCS: Record<string, string> = {
  lifePath:"人生の目的・使命を示す中核的な数字",
  birthday:"生まれ持った才能と個性",
  destiny:"社会での役割・使命",
  soul:"魂の奥深い欲求と動機",
  personality:"他者から見えるあなたの外面",
  maturity:"成熟期に開花する本来の姿",
  personalYear:`${new Date().getFullYear()}年のあなたのテーマ`,
};

export const CORE_ORDER = ["lifePath","birthday","destiny","soul","personality","maturity"];

// ── ピナクルナンバー ──────────────────────────
export interface PinnacleDesc {
  theme: string;
  talent: string;
  challenge: string;
}

export interface PinnacleEntry {
  index: number;
  number: number;
  startAge: number;
  endAge: number | null;
  theme: string;
  talent: string;
  challenge: string;
}

export const PINNACLE_DESC: Record<number, PinnacleDesc> = {
  1:  { theme:"自立と開拓", talent:"独自のビジョンで新しい道を切り開く力。リーダーシップと行動力が際立つ時期。", challenge:"孤独感や頑固さを手放し、他者の助けを受け入れること。" },
  2:  { theme:"協力と調和", talent:"人間関係の構築・外交術・細やかな気配りが才能として開花する時期。", challenge:"自分の意見を持ち、自己犠牲になりすぎないこと。" },
  3:  { theme:"創造と表現", talent:"コミュニケーション・芸術的才能・社交性が花開き、喜びを周囲に広げられる時期。", challenge:"エネルギーを分散させず、一つのことを深める集中力を育てること。" },
  4:  { theme:"基盤作りと努力", talent:"着実な積み上げで安定した土台を構築する力。誠実さと責任感が評価される時期。", challenge:"完璧主義や硬直した思考を手放し、変化への柔軟性を持つこと。" },
  5:  { theme:"変化と自由", talent:"多様な経験・冒険・適応力が人生を豊かにする。新しい可能性が次々と広がる時期。", challenge:"一つのことを完成させる忍耐を育て、衝動的な変化を慎重に選ぶこと。" },
  6:  { theme:"愛と責任", talent:"家族・地域・人への奉仕と深い愛情が開花する。人の心を癒す力が増す時期。", challenge:"過干渉や完璧主義を手放し、相手の自立を尊重すること。" },
  7:  { theme:"探求と内省", talent:"深い分析力・専門知識・霊的洞察が磨かれる。真実を追求することで唯一無二の存在になれる時期。", challenge:"孤立を避け、人との繋がりを大切にすること。" },
  8:  { theme:"成功と権力", talent:"ビジネス力・リーダーシップ・物質的な成功が花開く。大きな目標を現実に変える力が与えられる時期。", challenge:"権力欲や物質主義に偏らず、精神的な豊かさとのバランスを保つこと。" },
  9:  { theme:"完成と博愛", talent:"人類への奉仕・芸術・精神的な豊かさが頂点に達する。大きな視野で世界を愛せる時期。", challenge:"過去を手放し、次のサイクルへ進む勇気を持つこと。" },
  11: { theme:"霊的覚醒（マスター数）", talent:"直感・インスピレーション・精神的な使命が強まる特別な時期。人々を照らす光となる可能性を持つ。", challenge:"高い感受性からくる不安やプレッシャーを乗り越え、使命を地に足つけて実行すること。" },
  22: { theme:"偉大な建設（マスター数）", talent:"壮大なビジョンを現実に変える卓越した実現力が与えられる。世界に残る何かを作れる時期。", challenge:"責任の重さに押し潰されず、自分のペースで着実に進むこと。" },
};

export function calcPinnacles(date: string): PinnacleEntry[] {
  const [yearStr, monthStr, dayStr] = date.split("-");
  const month = parseInt(monthStr);
  const day   = parseInt(dayStr);
  const year  = parseInt(yearStr);

  const m = reduce(month);
  const d = reduce(day);
  const y = reduce(String(year).split("").reduce((a,b)=>a+parseInt(b),0));

  const p1 = reduce(m + d);
  const p2 = reduce(d + y);
  const p3 = reduce(p1 + p2);
  const p4 = reduce(m + y);

  const allDigits = date.replace(/-/g,"").split("").map(Number);
  const lp = reduce(allDigits.reduce((a,b)=>a+b,0));
  const lpBase = lp === 11 ? 2 : lp === 22 ? 4 : lp;

  const end1 = 36 - lpBase;
  const end2 = end1 + 9;
  const end3 = end2 + 9;

  const desc = (n: number) => PINNACLE_DESC[n] ?? PINNACLE_DESC[1];

  return [
    { index:1, number:p1, startAge:0,    endAge:end1, ...desc(p1) },
    { index:2, number:p2, startAge:end1, endAge:end2, ...desc(p2) },
    { index:3, number:p3, startAge:end2, endAge:end3, ...desc(p3) },
    { index:4, number:p4, startAge:end3, endAge:null, ...desc(p4) },
  ];
}
