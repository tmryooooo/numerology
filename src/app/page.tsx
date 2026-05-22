"use client";
import { useState, useEffect, useCallback } from "react";
import {
  calcAll, DATA, PY_DATA, LABELS, DESCS, CORE_ORDER, NumerologyResult,
} from "@/lib/numerology";
import { calcCompatibility, CompatibilityResult } from "@/lib/compatibility";

// ─── 型 ──────────────────────────────────────────────────────────
type View = "loading" | "auth" | "main";
type MainTab = "app" | "compat" | "history";
type AuthTab = "login" | "register";
type CompatCtxKey = "overall" | "friendship" | "business" | "asBoss" | "asSubordinate" | "customer" | "seitai" | "instructor";

interface SavedReading {
  id: number; name: string; date_of_birth: string;
  results: NumerologyResult; created_at: string;
}

interface PersonInput {
  mode: "history" | "new";
  readingId: number | null;
  name: string; date: string;
}

// ─── カラー・スタイル定数 ─────────────────────────────────────────
const C = {
  bg: "radial-gradient(ellipse at 20% 50%, #0d1b3e 0%, #050a1a 50%, #0a0518 100%)",
  card: "rgba(255,255,255,.04)", cardBorder: "rgba(155,143,192,.18)",
  accent: "#9b8fc0", fg: "#e8dfc8", font: "Georgia,'Times New Roman',serif",
  purple: "linear-gradient(135deg,#3d2b6e 0%,#1e1440 100%)",
};

const S: Record<string, React.CSSProperties> = {
  app:{minHeight:"100vh",background:C.bg,fontFamily:C.font,color:C.fg,position:"relative",overflow:"hidden"},
  stars:{position:"fixed",top:0,left:0,right:0,bottom:0,pointerEvents:"none",zIndex:0,background:"radial-gradient(1px 1px at 8% 12%,rgba(255,255,255,.7) 0%,transparent 100%),radial-gradient(1px 1px at 22% 6%,rgba(255,255,255,.4) 0%,transparent 100%),radial-gradient(1.5px 1.5px at 40% 20%,rgba(255,255,255,.6) 0%,transparent 100%),radial-gradient(1px 1px at 65% 4%,rgba(255,255,255,.5) 0%,transparent 100%),radial-gradient(1px 1px at 82% 14%,rgba(255,255,255,.3) 0%,transparent 100%),radial-gradient(1px 1px at 15% 40%,rgba(255,255,255,.3) 0%,transparent 100%),radial-gradient(1.5px 1.5px at 55% 35%,rgba(200,180,255,.4) 0%,transparent 100%),radial-gradient(1px 1px at 75% 42%,rgba(255,255,255,.5) 0%,transparent 100%)"},
  wrap:{position:"relative",zIndex:1,maxWidth:700,margin:"0 auto",padding:"0 20px 100px"},
  nav:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px 0 28px",borderBottom:"1px solid rgba(155,143,192,.12)",marginBottom:32},
  navBrand:{fontSize:14,letterSpacing:4,color:C.accent,fontStyle:"italic"},
  navTabs:{display:"flex",gap:4},
  navTab:{background:"none",border:"1px solid rgba(155,143,192,.2)",borderRadius:6,color:C.accent,padding:"7px 18px",cursor:"pointer",fontSize:11,letterSpacing:2,fontFamily:C.font},
  navTabActive:{background:"rgba(100,60,200,.15)",borderColor:"rgba(155,143,192,.5)",color:C.fg},
  navRight:{display:"flex",alignItems:"center",gap:12},
  navUser:{fontSize:11,color:"rgba(155,143,192,.5)",letterSpacing:1},
  navLogout:{background:"none",border:"none",color:"rgba(155,143,192,.4)",cursor:"pointer",fontSize:11,letterSpacing:2,fontFamily:C.font},
  hdr:{textAlign:"center",marginBottom:36},
  sym:{fontSize:40,display:"block",marginBottom:10,filter:"drop-shadow(0 0 14px rgba(200,160,255,.7))"},
  sup:{fontSize:11,letterSpacing:6,textTransform:"uppercase",color:C.accent,fontStyle:"italic",margin:0},
  ttl:{fontSize:24,letterSpacing:3,color:C.fg,fontWeight:"normal",margin:"8px 0 0"},
  divider:{width:60,height:1,background:"linear-gradient(90deg,transparent,#9b8fc0,transparent)",margin:"16px auto"},
  card_:{background:C.card,border:`1px solid ${C.cardBorder}`,borderRadius:16,padding:"32px 28px",backdropFilter:"blur(10px)",boxShadow:"0 4px 40px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.06)"},
  lbl:{display:"block",fontSize:10,letterSpacing:3,textTransform:"uppercase" as const,color:C.accent,marginBottom:8},
  inp:{width:"100%",background:"rgba(255,255,255,.05)",border:"1px solid rgba(155,143,192,.3)",borderRadius:8,padding:"13px 15px",color:C.fg,fontSize:15,fontFamily:C.font,outline:"none",boxSizing:"border-box" as const},
  sel:{width:"100%",background:"rgba(13,27,62,.8)",border:"1px solid rgba(155,143,192,.3)",borderRadius:8,padding:"12px 14px",color:C.fg,fontSize:14,fontFamily:C.font,outline:"none",boxSizing:"border-box" as const},
  btn:{width:"100%",padding:14,marginTop:4,background:C.purple,border:"1px solid rgba(155,143,192,.5)",borderRadius:10,color:C.fg,fontSize:11,letterSpacing:4,textTransform:"uppercase" as const,cursor:"pointer",fontFamily:C.font,boxShadow:"0 0 20px rgba(100,60,200,.2)"},
  btnSm:{background:"none",border:"1px solid rgba(155,143,192,.25)",borderRadius:6,color:C.accent,padding:"7px 16px",cursor:"pointer",fontSize:10,letterSpacing:2,fontFamily:C.font},
  btnDanger:{color:"#e08080",borderColor:"rgba(224,128,128,.25)"},
  fg_:{marginBottom:20},
  note:{fontSize:11,color:"rgba(155,143,192,.55)",marginBottom:8,display:"block"},
  errMsg:{fontSize:12,color:"#e08080",textAlign:"center" as const,marginTop:14},
  // numerology result
  grid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:4},
  numCard:{background:C.card,border:`1px solid ${C.cardBorder}`,borderRadius:12,padding:"18px 16px",cursor:"pointer",transition:"all .2s",backdropFilter:"blur(8px)"},
  numCardActive:{background:"rgba(100,60,200,.12)",border:"1px solid rgba(155,143,192,.5)",boxShadow:"0 0 24px rgba(100,60,200,.2)"},
  nl:{fontSize:10,letterSpacing:2,textTransform:"uppercase" as const,color:C.accent,marginBottom:5},
  nn:{fontSize:38,fontWeight:"normal" as const,color:C.fg,lineHeight:1,marginBottom:4,filter:"drop-shadow(0 0 8px rgba(200,160,255,.4))"},
  nnLg:{fontSize:52,fontWeight:"normal" as const,color:C.fg,lineHeight:1,filter:"drop-shadow(0 0 12px rgba(200,160,255,.5))"},
  nd:{fontSize:11,color:"rgba(232,223,200,.45)",lineHeight:1.4},
  panel:{background:"rgba(255,255,255,.03)",border:"1px solid rgba(155,143,192,.15)",borderRadius:12,padding:"20px 18px",marginTop:4,marginBottom:12,backdropFilter:"blur(8px)"},
  btnRow:{display:"flex",gap:10,justifyContent:"center",marginTop:32,flexWrap:"wrap" as const},
  pdfBtn:{background:"linear-gradient(135deg,#2a1a4e 0%,#1a0e38 100%)",border:"1px solid rgba(155,143,192,.45)",borderRadius:8,color:"#c4b8e0",padding:"11px 24px",cursor:"pointer",fontSize:11,letterSpacing:3,textTransform:"uppercase" as const,fontFamily:C.font},
  saveBtn:{background:"linear-gradient(135deg,#1a3a2e 0%,#0e2018 100%)",border:"1px solid rgba(143,192,165,.45)",borderRadius:8,color:"#a8d8b8",padding:"11px 24px",cursor:"pointer",fontSize:11,letterSpacing:3,textTransform:"uppercase" as const,fontFamily:C.font},
  backBtn:{background:"none",border:"1px solid rgba(155,143,192,.25)",borderRadius:8,color:C.accent,padding:"11px 20px",cursor:"pointer",fontSize:11,letterSpacing:3,textTransform:"uppercase" as const,fontFamily:C.font},
  // history
  histCard:{background:C.card,border:`1px solid ${C.cardBorder}`,borderRadius:14,padding:"20px 24px",marginBottom:12,backdropFilter:"blur(8px)"},
  histCardActive:{background:"rgba(100,60,200,.08)",border:"1px solid rgba(155,143,192,.4)"},
  histTop:{display:"flex",alignItems:"flex-start",justifyContent:"space-between",cursor:"pointer"},
  histName:{fontSize:15,color:C.fg,letterSpacing:2,marginBottom:4},
  histDate:{fontSize:11,color:"rgba(155,143,192,.6)",letterSpacing:1},
  histNums:{display:"flex",gap:10,marginTop:14,flexWrap:"wrap" as const},
  histNum:{background:"rgba(255,255,255,.04)",border:"1px solid rgba(155,143,192,.15)",borderRadius:8,padding:"8px 12px",textAlign:"center" as const,minWidth:54},
  histNumLbl:{fontSize:8,letterSpacing:2,color:C.accent,textTransform:"uppercase" as const,marginBottom:4},
  histNumVal:{fontSize:20,color:C.fg,lineHeight:1},
  histActions:{display:"flex",gap:8,marginTop:14},
  // compat
  compatPersonBox:{background:"rgba(13,27,62,.5)",border:"1px solid rgba(155,143,192,.2)",borderRadius:12,padding:"20px"},
  compatModeRow:{display:"flex",gap:6,marginBottom:14},
  compatModeBtn:{flex:1,background:"none",border:"1px solid rgba(155,143,192,.2)",borderRadius:6,color:C.accent,padding:"7px 0",cursor:"pointer",fontSize:10,letterSpacing:2,fontFamily:C.font},
  compatModeBtnActive:{background:"rgba(100,60,200,.15)",borderColor:"rgba(155,143,192,.5)",color:C.fg},
  compatPersonLabel:{fontSize:10,letterSpacing:4,textTransform:"uppercase" as const,color:C.accent,marginBottom:12},
  // compat result
  scoreCircle:{width:120,height:120,borderRadius:"50%",border:"3px solid rgba(155,143,192,.3)",display:"flex",flexDirection:"column" as const,alignItems:"center",justifyContent:"center",margin:"0 auto",background:"rgba(30,20,64,.6)",boxShadow:"0 0 30px rgba(100,60,200,.2)"},
  scoreNum:{fontSize:40,color:C.fg,lineHeight:1,fontWeight:"normal" as const},
  scoreGrade:{fontSize:22,color:"#b8a8d8",marginTop:2},
  gradeLabel:{textAlign:"center" as const,fontSize:12,color:C.accent,letterSpacing:3,marginTop:10},
  ctxTabs:{display:"flex",gap:4,flexWrap:"wrap" as const,marginBottom:20,marginTop:28},
  ctxTab:{background:"none",border:"1px solid rgba(155,143,192,.2)",borderRadius:6,color:C.accent,padding:"7px 14px",cursor:"pointer",fontSize:10,letterSpacing:2,fontFamily:C.font},
  ctxTabActive:{background:"rgba(100,60,200,.15)",borderColor:"rgba(155,143,192,.5)",color:C.fg},
  ctxCard:{background:"rgba(13,27,62,.5)",border:"1px solid rgba(155,143,192,.2)",borderRadius:12,padding:"22px"},
  ctxTitle:{fontSize:10,letterSpacing:4,textTransform:"uppercase" as const,color:C.accent,marginBottom:16},
  ctxScore:{display:"flex",alignItems:"center",gap:10,marginBottom:16},
  ctxScoreBar:{flex:1,height:6,borderRadius:3,background:"rgba(155,143,192,.15)",overflow:"hidden"},
  ctxScoreFill:{height:"100%",borderRadius:3,background:"linear-gradient(90deg,#3d2b6e,#9b8fc0)",transition:"width .5s"},
  styleBox:{background:"rgba(255,255,255,.03)",border:"1px solid rgba(155,143,192,.1)",borderRadius:8,padding:"14px",marginBottom:10},
  styleLabel:{fontSize:9,letterSpacing:3,textTransform:"uppercase" as const,color:"rgba(155,143,192,.6)",marginBottom:6},
  styleText:{fontSize:12,color:"rgba(232,223,200,.8)",lineHeight:1.7},
  adviceBox:{borderLeft:"2px solid rgba(155,143,192,.4)",paddingLeft:14,marginTop:16},
  adviceText:{fontSize:13,color:"#c4b8e0",lineHeight:1.85,fontStyle:"italic" as const},
  deepBtn:{width:"100%",background:"rgba(255,255,255,.03)",border:"1px solid rgba(155,143,192,.2)",borderRadius:8,color:C.accent,padding:"12px",cursor:"pointer",fontSize:10,letterSpacing:3,fontFamily:C.font,marginTop:16},
  deepBox:{background:"rgba(13,27,62,.4)",border:"1px solid rgba(155,143,192,.15)",borderRadius:12,padding:"22px",marginTop:12},
  axisRow:{display:"flex",alignItems:"center",gap:12,marginBottom:16},
  axisLabel:{fontSize:10,letterSpacing:2,color:C.accent,width:100,flexShrink:0},
  axisBarWrap:{flex:1,height:6,borderRadius:3,background:"rgba(155,143,192,.15)",overflow:"hidden"},
  axisBarFill:{height:"100%",borderRadius:3,background:"linear-gradient(90deg,#1a3a6e,#7b68b0)",transition:"width .5s"},
  axisNum:{fontSize:12,color:C.fg,width:30,textAlign:"right" as const},
};

const CTX_LABELS: Record<CompatCtxKey, string> = {
  overall:"総合", friendship:"友人", business:"ビジネス",
  asBoss:"Aが上司", asSubordinate:"Aが部下", customer:"お客様対応",
  seitai:"整体師→顧客", instructor:"講師→受講生",
};

// ─── コンポーネント ───────────────────────────────────────────────
export default function Home() {
  const [view, setView]       = useState<View>("loading");
  const [mainTab, setMainTab] = useState<MainTab>("app");
  const [username, setUsername] = useState("");

  // auth
  const [authTab, setAuthTab] = useState<AuthTab>("login");
  const [authId, setAuthId]   = useState(""); const [authPw, setAuthPw] = useState("");
  const [authErr, setAuthErr] = useState(""); const [authLoading, setAuthLoading] = useState(false);

  // app
  const [name, setName] = useState(""); const [date, setDate] = useState("");
  const [results, setResults] = useState<NumerologyResult | null>(null);
  const [active, setActive]   = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [savedId, setSavedId] = useState<number | null>(null);

  // history
  const [readings, setReadings]   = useState<SavedReading[]>([]);
  const [histActive, setHistActive] = useState<number | null>(null);
  const [histLoading, setHistLoading] = useState(false);

  // compat
  const [personA, setPersonA] = useState<PersonInput>({mode:"history",readingId:null,name:"",date:""});
  const [personB, setPersonB] = useState<PersonInput>({mode:"history",readingId:null,name:"",date:""});
  const [compatResult, setCompatResult] = useState<CompatibilityResult | null>(null);
  const [compatCtx, setCompatCtx] = useState<CompatCtxKey>("overall");
  const [compatErr, setCompatErr] = useState("");
  const [showDeep, setShowDeep] = useState(false);

  // ── 初期認証チェック
  useEffect(() => {
    fetch("/api/auth/me").then(r=>r.json()).then(d=>{
      if(d.user){setUsername(d.user.username);setView("main");}
      else setView("auth");
    }).catch(()=>setView("auth"));
  },[]);

  const loadReadings = useCallback(()=>{
    setHistLoading(true);
    fetch("/api/readings").then(r=>r.json())
      .then(d=>setReadings(d.readings??[]))
      .finally(()=>setHistLoading(false));
  },[]);

  useEffect(()=>{
    if(view==="main") loadReadings();
  },[view,loadReadings]);

  // ── 認証
  async function onAuth(){
    setAuthErr("");setAuthLoading(true);
    try{
      const res=await fetch(authTab==="login"?"/api/auth/login":"/api/auth/register",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username:authId.trim(),password:authPw}),
      });
      const data=await res.json();
      if(!res.ok){setAuthErr(data.error);return;}
      setUsername(data.username);setView("main");
    }finally{setAuthLoading(false);}
  }

  async function onLogout(){
    await fetch("/api/auth/logout",{method:"POST"});
    setView("auth");setResults(null);setReadings([]);setCompatResult(null);
    setAuthId("");setAuthPw("");setAuthErr("");
  }

  // ── 診断
  function onCalculate(){
    if(!name.trim()||!date)return;
    setResults(calcAll(name,date));setActive(null);setSavedId(null);
  }

  async function onExportPDF(r:NumerologyResult,n:string,d:string){
    setPdfLoading(true);
    try{const{generatePDF}=await import("@/lib/generatePDF");await generatePDF(n,d,r);}
    catch(e:any){alert("PDF生成エラー: "+e.message);}
    finally{setPdfLoading(false);}
  }

  async function onSave(){
    if(!results)return;setSaveLoading(true);
    try{
      const res=await fetch("/api/readings",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({name:name.trim(),dateOfBirth:date,results})});
      const data=await res.json();setSavedId(data.id);
      loadReadings();
    }finally{setSaveLoading(false);}
  }

  async function onDelete(id:number){
    if(!confirm("この診断結果を削除しますか？"))return;
    await fetch(`/api/readings/${id}`,{method:"DELETE"});
    setReadings(prev=>prev.filter(r=>r.id!==id));
    if(histActive===id)setHistActive(null);
  }

  // ── 相性診断
  function getPersonResult(p:PersonInput):NumerologyResult|null{
    if(p.mode==="history"){
      if(!p.readingId)return null;
      return readings.find(r=>r.id===p.readingId)?.results??null;
    }
    if(!p.name.trim()||!p.date)return null;
    return calcAll(p.name,p.date);
  }

  function getPersonLabel(p:PersonInput):string{
    if(p.mode==="history"&&p.readingId){
      const r=readings.find(r=>r.id===p.readingId);
      return r?`${r.name} (${r.date_of_birth})`:"";
    }
    return p.name?`${p.name.toUpperCase()} (${p.date})`:"";
  }

  function onCalcCompat(){
    setCompatErr("");
    const ra=getPersonResult(personA);
    const rb=getPersonResult(personB);
    if(!ra){setCompatErr("人物Aを設定してください");return;}
    if(!rb){setCompatErr("人物Bを設定してください");return;}
    setCompatResult(calcCompatibility(ra,rb));
    setCompatCtx("overall");setShowDeep(false);
  }

  // ── カード詳細
  function renderDetail(key:string,num:number){
    if(key==="personalYear"){
      const d=PY_DATA[num];if(!d)return null;
      return(<div>
        <p style={{fontSize:15,color:"#d4c9b0",marginBottom:10,lineHeight:1.5}}>{d.theme}</p>
        <p style={{fontSize:13,color:"#c8bda8",lineHeight:1.85,marginBottom:12}}>{d.body}</p>
        <p style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:C.accent,marginBottom:6,marginTop:14}}>おすすめの行動</p>
        <p style={{fontSize:13,color:"#b8ad9a",lineHeight:1.7}}>{d.action}</p>
        <p style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:C.accent,marginBottom:6,marginTop:12}}>注意点</p>
        <p style={{fontSize:13,color:"#b8ad9a",lineHeight:1.7}}>{d.caution}</p>
      </div>);
    }
    const d=DATA[num];if(!d)return null;
    return(<div>
      <p style={{fontSize:12,color:"#b8a8d8",letterSpacing:1,marginBottom:14}}>✦ {d.keywords}</p>
      <p style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:C.accent,marginBottom:6}}>本質</p>
      <p style={{fontSize:13,color:"#c8bda8",lineHeight:1.85,marginBottom:8}}>{d.essence}</p>
      <p style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:C.accent,marginBottom:6,marginTop:10}}>才能と強み</p>
      {d.strengths.map((s,i)=><p key={i} style={{fontSize:13,color:"#b8ad9a",lineHeight:1.7,marginBottom:4}}>・{s}</p>)}
      <p style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:C.accent,marginBottom:6,marginTop:10}}>課題と成長テーマ</p>
      {d.challenges.map((c,i)=><p key={i} style={{fontSize:13,color:"#b8ad9a",lineHeight:1.7,marginBottom:4}}>・{c}</p>)}
      <p style={{fontSize:13,color:"#c4b8e0",lineHeight:1.9,marginTop:14,paddingTop:14,borderTop:"1px solid rgba(155,143,192,.2)",whiteSpace:"pre-wrap",fontStyle:"italic"}}>{d.message}</p>
    </div>);
  }

  // ─── PersonInput UI ──────────────────────────────────────────────
  function PersonInputUI({label,value,onChange}:{label:string;value:PersonInput;onChange:(v:PersonInput)=>void}){
    return(
      <div style={S.compatPersonBox}>
        <p style={S.compatPersonLabel}>{label}</p>
        <div style={S.compatModeRow}>
          {(["history","new"] as const).map(m=>(
            <button key={m} style={{...S.compatModeBtn,...(value.mode===m?S.compatModeBtnActive:{})}}
              onClick={()=>onChange({...value,mode:m,readingId:null,name:"",date:""})}>
              {m==="history"?"履歴から選ぶ":"新規入力"}
            </button>
          ))}
        </div>
        {value.mode==="history"?(
          <div>
            <label style={S.lbl}>診断を選択</label>
            <select style={S.sel} value={value.readingId??""} onChange={e=>onChange({...value,readingId:e.target.value?Number(e.target.value):null})}>
              <option value="">── 選択してください ──</option>
              {readings.map(r=>(
                <option key={r.id} value={r.id}>{r.name.toUpperCase()} ({r.date_of_birth})</option>
              ))}
            </select>
            {readings.length===0&&<p style={{fontSize:11,color:"rgba(155,143,192,.45)",marginTop:8}}>まず診断を保存してください</p>}
          </div>
        ):(
          <>
            <div style={{marginBottom:14}}>
              <label style={S.lbl}>フルネーム（ローマ字）</label>
              <input style={S.inp} value={value.name} onChange={e=>onChange({...value,name:e.target.value})} placeholder="YAMADA HANAKO"/>
            </div>
            <div>
              <label style={S.lbl}>生年月日</label>
              <input style={{...S.inp,colorScheme:"dark"}} type="date" value={value.date} onChange={e=>onChange({...value,date:e.target.value})}/>
            </div>
          </>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // Loading
  if(view==="loading")return(
    <div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={S.stars}/>
      <p style={{color:C.accent,letterSpacing:4,fontSize:12}}>読み込み中…</p>
    </div>
  );

  // ─── 認証画面 ────────────────────────────────────────────────────
  if(view==="auth")return(
    <div style={S.app}>
      <style>{`input:focus{border-color:rgba(155,143,192,.7)!important} button:hover{opacity:.82} input[type=date]{color-scheme:dark}`}</style>
      <div style={S.stars}/>
      <div style={{...S.wrap,paddingTop:80}}>
        <div style={S.hdr}>
          <span style={S.sym}>✦</span>
          <p style={S.sup}>Numerology Reading</p>
          <h1 style={S.ttl}>数秘術 診断</h1>
          <div style={S.divider}/>
        </div>
        <div style={S.card_}>
          <div style={{display:"flex",marginBottom:28,borderBottom:"1px solid rgba(155,143,192,.15)"}}>
            {(["login","register"] as AuthTab[]).map(t=>(
              <button key={t} style={{flex:1,background:"none",border:"none",padding:"10px 0",
                color:authTab===t?C.fg:C.accent,fontSize:12,letterSpacing:3,cursor:"pointer",fontFamily:C.font,
                borderBottom:authTab===t?"1px solid rgba(155,143,192,.6)":"none"}}
                onClick={()=>{setAuthTab(t);setAuthErr("");}}>
                {t==="login"?"ログイン":"新規登録"}
              </button>
            ))}
          </div>
          <div style={S.fg_}>
            <label style={S.lbl}>ユーザーID</label>
            <input style={S.inp} value={authId} onChange={e=>setAuthId(e.target.value)} placeholder="例: yamada_hanako" onKeyDown={e=>e.key==="Enter"&&onAuth()}/>
          </div>
          <div style={S.fg_}>
            <label style={S.lbl}>パスワード{authTab==="register"&&"（6文字以上）"}</label>
            <input style={S.inp} type="password" value={authPw} onChange={e=>setAuthPw(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&onAuth()}/>
          </div>
          <button style={S.btn} onClick={onAuth} disabled={authLoading||!authId||!authPw}>
            {authLoading?"処理中…":authTab==="login"?"ログイン":"アカウントを作成"}
          </button>
          {authErr&&<p style={S.errMsg}>{authErr}</p>}
        </div>
      </div>
    </div>
  );

  // ─── メイン画面 ─────────────────────────────────────────────────
  return(
    <div style={S.app}>
      <style>{`input:focus{border-color:rgba(155,143,192,.7)!important} button:hover{opacity:.82} input[type=date]{color-scheme:dark} select option{background:#0d1b3e}`}</style>
      <div style={S.stars}/>
      <div style={S.wrap}>

        {/* ナビ */}
        <nav style={S.nav}>
          <span style={S.navBrand}>✦ 数秘術</span>
          <div style={S.navTabs}>
            {([["app","診断"],["compat","相性"],["history","履歴"]] as [MainTab,string][]).map(([t,lbl])=>(
              <button key={t} style={{...S.navTab,...(mainTab===t?S.navTabActive:{})}} onClick={()=>setMainTab(t)}>{lbl}</button>
            ))}
          </div>
          <div style={S.navRight}>
            <span style={S.navUser}>{username}</span>
            <button style={S.navLogout} onClick={onLogout}>ログアウト</button>
          </div>
        </nav>

        {/* ══ 診断タブ ══ */}
        {mainTab==="app"&&(
          <>
            {!results?(
              <>
                <div style={S.hdr}>
                  <span style={S.sym}>✦</span>
                  <p style={S.sup}>Numerology Reading</p>
                  <h1 style={S.ttl}>数秘術 診断</h1>
                  <div style={S.divider}/>
                </div>
                <div style={S.card_}>
                  <div style={S.fg_}>
                    <label style={S.lbl}>フルネーム（ローマ字）</label>
                    <span style={S.note}>例: YAMADA HANAKO</span>
                    <input style={S.inp} value={name} onChange={e=>setName(e.target.value)} placeholder="YOUR FULL NAME"/>
                  </div>
                  <div style={S.fg_}>
                    <label style={S.lbl}>生年月日</label>
                    <input style={S.inp} type="date" value={date} onChange={e=>setDate(e.target.value)}/>
                  </div>
                  <button style={S.btn} onClick={onCalculate} disabled={!name.trim()||!date}>数字を読み解く</button>
                </div>
              </>
            ):(
              <div>
                <div style={{textAlign:"center",marginBottom:28}}>
                  <p style={{fontSize:11,letterSpacing:3,color:C.accent,textTransform:"uppercase",marginBottom:4}}>{name.toUpperCase()}</p>
                  <p style={{color:"rgba(155,143,192,.6)",fontSize:12}}>{date}</p>
                </div>
                <p style={{textAlign:"center",fontSize:11,color:"rgba(155,143,192,.45)",letterSpacing:2,marginBottom:18}}>▾ カードをクリックして解説を表示</p>
                <div style={S.grid}>
                  {CORE_ORDER.map(key=>(
                    <div key={key}>
                      <div style={{...S.numCard,...(active===key?S.numCardActive:{})}} onClick={()=>setActive(active===key?null:key)}>
                        <p style={S.nl}>{LABELS[key]}</p>
                        <p style={S.nn}>{results[key as keyof NumerologyResult]}</p>
                        <p style={S.nd}>{DESCS[key]}</p>
                      </div>
                      {active===key&&<div style={S.panel}>{renderDetail(key,results[key as keyof NumerologyResult])}</div>}
                    </div>
                  ))}
                </div>
                <p style={{fontSize:10,letterSpacing:4,textTransform:"uppercase",color:"rgba(155,143,192,.5)",textAlign:"center",margin:"24px 0 12px"}}>Personal Year</p>
                <div style={{width:"100%",height:1,background:"linear-gradient(90deg,transparent,rgba(155,143,192,.2),transparent)",margin:"8px 0 16px"}}/>
                <div style={{...({background:C.card,border:`1px solid ${C.cardBorder}`,borderRadius:12,padding:"18px 20px",cursor:"pointer",transition:"all .2s",backdropFilter:"blur(8px)",marginBottom:4}),...(active==="personalYear"?S.numCardActive:{})}}
                  onClick={()=>setActive(active==="personalYear"?null:"personalYear")}>
                  <div style={{display:"flex",alignItems:"center",gap:20}}>
                    <div><p style={S.nl}>{LABELS.personalYear}</p><p style={S.nnLg}>{results.personalYear}</p></div>
                    <div><p style={{...S.nd,fontSize:13,lineHeight:1.5}}>{DESCS.personalYear}<br/><span style={{color:"#b8a8d8",fontSize:12}}>{PY_DATA[results.personalYear]?.theme}</span></p></div>
                  </div>
                </div>
                {active==="personalYear"&&<div style={S.panel}>{renderDetail("personalYear",results.personalYear)}</div>}
                <div style={S.btnRow}>
                  <button style={S.pdfBtn} onClick={()=>onExportPDF(results,name,date)} disabled={pdfLoading}>{pdfLoading?"生成中…":"↓ PDF出力"}</button>
                  <button style={{...S.saveBtn,...(savedId?{opacity:.55,cursor:"default"}:{})}} onClick={onSave} disabled={saveLoading||!!savedId}>
                    {savedId?"✓ 保存済み":saveLoading?"保存中…":"💾 保存する"}
                  </button>
                  <button style={S.backBtn} onClick={()=>{setResults(null);setActive(null);setSavedId(null);}}>← 最初から</button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ══ 相性タブ ══ */}
        {mainTab==="compat"&&(
          <div>
            <div style={S.hdr}>
              <span style={S.sym}>◈</span>
              <p style={S.sup}>Compatibility Reading</p>
              <h1 style={S.ttl}>相性診断</h1>
              <div style={S.divider}/>
            </div>

            {!compatResult?(
              <div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
                  <PersonInputUI label="人物 A" value={personA} onChange={setPersonA}/>
                  <PersonInputUI label="人物 B" value={personB} onChange={setPersonB}/>
                </div>
                {compatErr&&<p style={{...S.errMsg,marginBottom:12}}>{compatErr}</p>}
                <button style={S.btn} onClick={onCalcCompat}>相性を診断する</button>
              </div>
            ):(
              <div>
                {/* ── 人物名表示 */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16,marginBottom:28}}>
                  <div style={{textAlign:"center"}}>
                    <p style={{fontSize:10,letterSpacing:3,color:C.accent,textTransform:"uppercase",marginBottom:4}}>Person A</p>
                    <p style={{fontSize:14,color:C.fg,letterSpacing:2}}>{getPersonLabel(personA)||"A"}</p>
                  </div>
                  <span style={{fontSize:24,color:"rgba(155,143,192,.4)"}}>◈</span>
                  <div style={{textAlign:"center"}}>
                    <p style={{fontSize:10,letterSpacing:3,color:C.accent,textTransform:"uppercase",marginBottom:4}}>Person B</p>
                    <p style={{fontSize:14,color:C.fg,letterSpacing:2}}>{getPersonLabel(personB)||"B"}</p>
                  </div>
                </div>

                {/* ── スコアサークル */}
                <div style={S.scoreCircle}>
                  <span style={S.scoreNum}>{compatResult.score}</span>
                  <span style={S.scoreGrade}>{compatResult.grade}</span>
                </div>
                <p style={S.gradeLabel}>{compatResult.gradeLabel}</p>

                {/* ── サマリー */}
                <div style={{...S.card_,marginTop:24,padding:"20px 24px"}}>
                  <p style={{fontSize:13,color:"rgba(232,223,200,.85)",lineHeight:1.85,marginBottom:16}}>{compatResult.summary}</p>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    <div>
                      <p style={{fontSize:9,letterSpacing:3,color:"#a8d8b8",textTransform:"uppercase",marginBottom:8}}>✦ 強み</p>
                      {compatResult.strengths.map((s,i)=><p key={i} style={{fontSize:12,color:"rgba(232,223,200,.7)",lineHeight:1.7,marginBottom:4}}>・{s}</p>)}
                    </div>
                    <div>
                      <p style={{fontSize:9,letterSpacing:3,color:"#e0a8a8",textTransform:"uppercase",marginBottom:8}}>▲ 課題</p>
                      {compatResult.challenges.map((c,i)=><p key={i} style={{fontSize:12,color:"rgba(232,223,200,.7)",lineHeight:1.7,marginBottom:4}}>・{c}</p>)}
                    </div>
                  </div>
                </div>

                {/* ── コミュニケーション */}
                <div style={{background:"rgba(155,143,192,.07)",border:"1px solid rgba(155,143,192,.2)",borderRadius:12,padding:"18px 20px",marginTop:20}}>
                  <p style={{fontSize:9,letterSpacing:4,textTransform:"uppercase" as const,color:"#c4a8e0",marginBottom:10}}>✦ コミュニケーションの鍵</p>
                  <p style={{fontSize:13,color:"#e8c8f8",lineHeight:1.8,fontStyle:"italic" as const,marginBottom:12}}>{compatResult.communicationKey}</p>
                  <p style={{fontSize:12,color:"rgba(232,223,200,.75)",lineHeight:1.85}}>{compatResult.communicationDeep}</p>
                </div>

                {/* ── コンテキストタブ */}
                <div style={S.ctxTabs}>
                  {(Object.keys(CTX_LABELS) as CompatCtxKey[]).map(k=>(
                    <button key={k} style={{...S.ctxTab,...(compatCtx===k?S.ctxTabActive:{})}} onClick={()=>setCompatCtx(k)}>
                      {CTX_LABELS[k]}
                    </button>
                  ))}
                </div>

                {/* ── コンテキストカード */}
                {(()=>{
                  const ctx=compatResult.contexts[compatCtx];
                  return(
                    <div style={S.ctxCard}>
                      <p style={S.ctxTitle}>{ctx.title}</p>
                      <div style={S.ctxScore}>
                        <span style={{fontSize:11,color:C.accent,width:32}}>{ctx.score}</span>
                        <div style={S.ctxScoreBar}>
                          <div style={{...S.ctxScoreFill,width:`${ctx.score}%`}}/>
                        </div>
                        <span style={{fontSize:18,color:"#b8a8d8",width:28}}>{ctx.grade}</span>
                      </div>
                      <div style={S.adviceBox}>
                        <p style={S.adviceText}>{ctx.dynamic}</p>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:14}}>
                        <div style={S.styleBox}>
                          <p style={S.styleLabel}>人物 A へのヒント</p>
                          {ctx.tipsForA.map((t,i)=><p key={i} style={{...S.styleText,marginBottom:4}}>・{t}</p>)}
                        </div>
                        <div style={S.styleBox}>
                          <p style={S.styleLabel}>人物 B へのヒント</p>
                          {ctx.tipsForB.map((t,i)=><p key={i} style={{...S.styleText,marginBottom:4}}>・{t}</p>)}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* ── 深掘り */}
                <button style={S.deepBtn} onClick={()=>setShowDeep(v=>!v)}>
                  {showDeep?"▴ 深掘りを閉じる":"▾ さらに深掘りする（数字軸分析）"}
                </button>
                {showDeep&&(
                  <div style={S.deepBox}>
                    <p style={{fontSize:10,letterSpacing:4,textTransform:"uppercase",color:C.accent,marginBottom:20}}>数字軸ごとの相性</p>
                    {[
                      {label:"ライフパス",score:compatResult.lifePathScore,weight:"40%"},
                      {label:"ディスティニー",score:compatResult.destinyScore,weight:"25%"},
                      {label:"ソウル",score:compatResult.soulScore,weight:"20%"},
                      {label:"パーソナリティ",score:compatResult.personalityScore,weight:"15%"},
                    ].map(ax=>(
                      <div key={ax.label} style={S.axisRow}>
                        <div style={{width:110,flexShrink:0}}>
                          <p style={{fontSize:9,letterSpacing:2,color:C.accent,textTransform:"uppercase",marginBottom:2}}>{ax.label}</p>
                          <p style={{fontSize:8,color:"rgba(155,143,192,.5)"}}>重み {ax.weight}</p>
                        </div>
                        <div style={S.axisBarWrap}>
                          <div style={{...S.axisBarFill,width:`${ax.score}%`}}/>
                        </div>
                        <span style={S.axisNum}>{ax.score}</span>
                      </div>
                    ))}
                    <div style={{borderTop:"1px solid rgba(155,143,192,.15)",paddingTop:18,marginTop:8}}>
                      <p style={{fontSize:9,letterSpacing:3,color:C.accent,textTransform:"uppercase",marginBottom:12}}>総合メッセージ</p>
                      <p style={{fontSize:13,color:"#c4b8e0",lineHeight:1.95,fontStyle:"italic"}}>{compatResult.deepNote}</p>
                    </div>
                  </div>
                )}

                <div style={{...S.btnRow,marginTop:24}}>
                  <button style={S.backBtn} onClick={()=>{setCompatResult(null);setShowDeep(false);}}>← 選び直す</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ 履歴タブ ══ */}
        {mainTab==="history"&&(
          <div>
            <div style={S.hdr}>
              <h1 style={{...S.ttl,fontSize:20}}>診断履歴</h1>
              <div style={S.divider}/>
            </div>
            {histLoading&&<p style={{textAlign:"center",color:"rgba(155,143,192,.45)",fontSize:13,letterSpacing:2,padding:"60px 0"}}>読み込み中…</p>}
            {!histLoading&&readings.length===0&&<p style={{textAlign:"center",color:"rgba(155,143,192,.45)",fontSize:13,letterSpacing:2,padding:"60px 0"}}>保存された診断結果がありません</p>}
            {readings.map(r=>{
              const isOpen=histActive===r.id;
              return(
                <div key={r.id} style={{...S.histCard,...(isOpen?S.histCardActive:{})}}>
                  <div style={S.histTop} onClick={()=>setHistActive(isOpen?null:r.id)}>
                    <div>
                      <p style={S.histName}>{r.name.toUpperCase()}</p>
                      <p style={S.histDate}>{r.date_of_birth} · 保存日: {r.created_at.slice(0,10)}</p>
                    </div>
                    <span style={{color:C.accent,fontSize:16}}>{isOpen?"▴":"▾"}</span>
                  </div>
                  <div style={S.histNums}>
                    {CORE_ORDER.map(key=>(
                      <div key={key} style={S.histNum}>
                        <p style={S.histNumLbl}>{LABELS[key].slice(0,5)}</p>
                        <p style={S.histNumVal}>{r.results[key as keyof NumerologyResult]}</p>
                      </div>
                    ))}
                    <div style={S.histNum}>
                      <p style={S.histNumLbl}>PY{new Date().getFullYear()}</p>
                      <p style={S.histNumVal}>{r.results.personalYear}</p>
                    </div>
                  </div>
                  {isOpen&&(
                    <div style={{marginTop:18}}>
                      <div style={S.grid}>
                        {CORE_ORDER.map(key=>{
                          const num=r.results[key as keyof NumerologyResult];
                          const d=DATA[num];
                          return(
                            <div key={key} style={{...S.numCard,cursor:"default"}}>
                              <p style={S.nl}>{LABELS[key]}</p>
                              <p style={S.nn}>{num}</p>
                              {d&&<p style={{...S.nd,fontSize:10,lineHeight:1.5}}>✦ {d.keywords}</p>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div style={S.histActions}>
                    <button style={S.btnSm} onClick={()=>onExportPDF(r.results,r.name,r.date_of_birth)} disabled={pdfLoading}>↓ PDF出力</button>
                    <button style={{...S.btnSm,...S.btnDanger}} onClick={()=>onDelete(r.id)}>削除</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
