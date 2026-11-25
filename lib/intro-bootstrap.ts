import { INTRO_SESSION_KEY } from "./intro-session";

/** Parser-owned readiness. No hydration, assets, promises or timeout. */
export const INTRO_BOOTSTRAP = `(()=>{
  const root=document.documentElement;
  let seen=false;
  try{seen=sessionStorage.getItem(${JSON.stringify(INTRO_SESSION_KEY)})==="1"}catch{}
  root.dataset.intro=seen?"skip":"loading";
  const ready=()=>{
    if(!document.querySelector("[data-essential-ready],[data-page-ready]"))return false;
    root.dataset.intro=seen?"skip":"ready";
    try{sessionStorage.setItem(${JSON.stringify(INTRO_SESSION_KEY)},"1")}catch{}
    performance.mark("bullshill:essential-ready");
    window.dispatchEvent(new Event("bullshill:essential-ready"));
    return true;
  };
  if(!ready()){
    const observer=new MutationObserver(()=>{if(ready())observer.disconnect()});
    observer.observe(document.body,{childList:true,subtree:true});
  }
})()`;
