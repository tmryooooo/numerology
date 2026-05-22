import { jsPDF } from "jspdf";
import { NumerologyResult, DATA, PY_DATA, LABELS, DESCS, CORE_ORDER } from "./numerology";

const BG = "#050a1a";
const CARD_BG = "#0d1b3e";
const ACCENT = "#9b8fc0";
const FG = "#e8dfc8";
const FG2 = "#c8bda8";
const PURPLE_BG = "#1e1440";
const FONT = "'Hiragino Sans', 'Yu Gothic UI', 'Yu Gothic', 'Noto Sans JP', 'Meiryo', sans-serif";

const PAGE_W = 794;
const PAGE_H = 1123;

function el(tag: string, style: string, html: string): string {
  return `<${tag} style="${style}">${html}</${tag}>`;
}

function buildCover(name: string, date: string, results: NumerologyResult): string {
  const year = new Date().getFullYear();
  const pyd = PY_DATA[results.personalYear];

  const coreRows = [
    [CORE_ORDER[0], CORE_ORDER[1], CORE_ORDER[2]],
    [CORE_ORDER[3], CORE_ORDER[4], CORE_ORDER[5]],
  ];

  const coreGrid = coreRows.map(row =>
    `<div style="display:flex;gap:0;">` +
    row.map((key, i) =>
      `<div style="flex:1;text-align:center;padding:20px 10px;${i < 2 ? "border-right:1px solid rgba(155,143,192,.25);" : ""}">
        <div style="font-size:11px;letter-spacing:2px;color:${ACCENT};text-transform:uppercase;margin-bottom:10px;">${LABELS[key]}</div>
        <div style="font-size:44px;color:${FG};line-height:1;">${results[key as keyof NumerologyResult]}</div>
      </div>`
    ).join("") +
    `</div>`
  ).join(`<div style="height:1px;background:rgba(155,143,192,.15);margin:0 20px;"></div>`);

  const pyBox = `
    <div style="background:${PURPLE_BG};border:1px solid rgba(155,143,192,.3);border-radius:10px;padding:22px 28px;display:flex;align-items:center;gap:24px;">
      <div>
        <div style="font-size:10px;letter-spacing:3px;color:${ACCENT};text-transform:uppercase;margin-bottom:6px;">PERSONAL YEAR ${year}</div>
        <div style="font-size:52px;color:${FG};line-height:1;">${results.personalYear}</div>
      </div>
      <div>
        <div style="font-size:15px;color:#b8a8d8;margin-bottom:8px;">${pyd?.theme ?? ""}</div>
        <div style="font-size:12px;color:${FG2};line-height:1.7;">${pyd?.body?.slice(0, 80) ?? ""}…</div>
      </div>
    </div>`;

  return `
    <div style="text-align:center;padding:60px 48px 0;">
      <div style="font-size:10px;letter-spacing:5px;color:${ACCENT};text-transform:uppercase;margin-bottom:14px;">NUMEROLOGY READING</div>
      <div style="font-size:32px;color:${FG};font-weight:400;margin-bottom:10px;">数秘術 診断レポート</div>
      <div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,${ACCENT},transparent);margin:18px auto 24px;"></div>
      <div style="font-size:16px;letter-spacing:4px;color:#b8a8d8;margin-bottom:8px;">${name.toUpperCase()}</div>
      <div style="font-size:12px;color:rgba(155,143,192,.6);margin-bottom:48px;">${date}</div>
    </div>
    <div style="margin:0 48px 28px;">
      <div style="background:${CARD_BG};border:1px solid rgba(155,143,192,.2);border-radius:12px;padding:12px 0 0;overflow:hidden;">
        <div style="font-size:9px;letter-spacing:4px;color:${ACCENT};text-transform:uppercase;text-align:center;padding-bottom:10px;">CORE NUMBERS</div>
        <div style="height:1px;background:rgba(155,143,192,.2);"></div>
        ${coreGrid}
      </div>
    </div>
    <div style="margin:0 48px;">
      ${pyBox}
    </div>
    <div style="margin-top:auto;padding:32px 48px 0;text-align:center;">
      <div style="font-size:10px;color:rgba(155,143,192,.4);letter-spacing:1px;">Numerology Reading  Generated ${new Date().toLocaleDateString("ja-JP")}</div>
    </div>`;
}

function buildDetailPage(key: string, num: number): string {
  const d = DATA[num];
  const pyd = PY_DATA[num];
  const label = LABELS[key];
  const desc = DESCS[key];

  const header = `
    <div style="background:${PURPLE_BG};border-radius:10px;padding:22px 28px;display:flex;align-items:baseline;gap:20px;margin-bottom:28px;">
      <div>
        <div style="font-size:10px;letter-spacing:3px;color:${ACCENT};text-transform:uppercase;margin-bottom:8px;">${label.toUpperCase()}</div>
        <div style="font-size:52px;color:${FG};line-height:1;">${num}</div>
      </div>
      <div style="font-size:13px;color:#b8a8d8;line-height:1.6;">${desc}</div>
    </div>`;

  if (d) {
    const strengths = d.strengths.map(s => `<div style="font-size:13px;color:${FG2};line-height:1.7;margin-bottom:4px;">・${s}</div>`).join("");
    const challenges = d.challenges.map(c => `<div style="font-size:13px;color:${FG2};line-height:1.7;margin-bottom:4px;">・${c}</div>`).join("");
    return `
      ${header}
      <div style="font-size:12px;color:#b8a8d8;letter-spacing:1px;margin-bottom:18px;">✦ ${d.keywords}</div>
      <div style="margin-bottom:18px;">
        <div style="font-size:10px;letter-spacing:3px;color:${ACCENT};text-transform:uppercase;margin-bottom:8px;">[ 本質 ]</div>
        <div style="font-size:13px;color:${FG2};line-height:1.85;">${d.essence}</div>
      </div>
      <div style="margin-bottom:18px;">
        <div style="font-size:10px;letter-spacing:3px;color:${ACCENT};text-transform:uppercase;margin-bottom:8px;">[ 才能と強み ]</div>
        ${strengths}
      </div>
      <div style="margin-bottom:22px;">
        <div style="font-size:10px;letter-spacing:3px;color:${ACCENT};text-transform:uppercase;margin-bottom:8px;">[ 課題と成長テーマ ]</div>
        ${challenges}
      </div>
      <div style="background:rgba(20,14,48,.8);border:1px solid rgba(155,143,192,.25);border-radius:10px;padding:20px 24px;text-align:center;">
        <div style="font-size:13px;color:#c4b8e0;line-height:1.95;white-space:pre-wrap;font-style:italic;">${d.message}</div>
      </div>`;
  }

  if (pyd) {
    return `
      ${header}
      <div style="font-size:16px;color:#b8a8d8;margin-bottom:20px;">${pyd.theme}</div>
      <div style="margin-bottom:18px;">
        <div style="font-size:10px;letter-spacing:3px;color:${ACCENT};text-transform:uppercase;margin-bottom:8px;">[ 今年のテーマ ]</div>
        <div style="font-size:13px;color:${FG2};line-height:1.85;">${pyd.body}</div>
      </div>
      <div style="margin-bottom:18px;">
        <div style="font-size:10px;letter-spacing:3px;color:${ACCENT};text-transform:uppercase;margin-bottom:8px;">[ おすすめの行動 ]</div>
        <div style="font-size:13px;color:${FG2};line-height:1.7;">${pyd.action}</div>
      </div>
      <div>
        <div style="font-size:10px;letter-spacing:3px;color:${ACCENT};text-transform:uppercase;margin-bottom:8px;">[ 注意点 ]</div>
        <div style="font-size:13px;color:${FG2};line-height:1.7;">${pyd.caution}</div>
      </div>`;
  }

  return header;
}

async function captureElement(htmlContent: string): Promise<HTMLCanvasElement> {
  const html2canvas = (await import("html2canvas")).default;

  const wrapper = document.createElement("div");
  wrapper.style.cssText = `
    position: fixed;
    left: -9999px;
    top: 0;
    width: ${PAGE_W}px;
    min-height: ${PAGE_H}px;
    background: ${BG};
    color: ${FG};
    font-family: ${FONT};
    padding: 48px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  `;
  wrapper.innerHTML = htmlContent;
  document.body.appendChild(wrapper);

  await new Promise(r => requestAnimationFrame(r));

  const canvas = await html2canvas(wrapper, {
    scale: 2,
    useCORS: true,
    backgroundColor: BG,
    logging: false,
    width: PAGE_W,
    height: PAGE_H,
    windowWidth: PAGE_W,
  });

  document.body.removeChild(wrapper);
  return canvas;
}

export async function generatePDF(name: string, date: string, results: NumerologyResult) {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pages: Array<{ key: string; num: number } | "cover"> = [
    "cover",
    ...CORE_ORDER.map(key => ({ key, num: results[key as keyof NumerologyResult] })),
    { key: "personalYear", num: results.personalYear },
  ];

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const html = page === "cover"
      ? buildCover(name, date, results)
      : buildDetailPage(page.key, page.num);

    const canvas = await captureElement(html);
    const imgData = canvas.toDataURL("image/jpeg", 0.92);

    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);
  }

  pdf.save(`numerology_${name.replace(/\s+/g, "_")}_${date}.pdf`);
}
