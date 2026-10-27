import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {getFirestore,collection,doc,getDoc,setDoc,deleteDoc,onSnapshot} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {getAuth,signInAnonymously,signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {getStorage,ref,uploadBytes,getDownloadURL} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import {firebaseConfig,adminEmail} from "./firebase-config.js";
const app=initializeApp(firebaseConfig),fs=getFirestore(app),au=getAuth(app),st=getStorage(app);let uid=null;
try{uid=(await signInAnonymously(au)).user.uid}catch(e){}
const dref=p=>({
 get:async()=>{const s=await getDoc(doc(fs,p));return{exists:s.exists(),data:()=>s.data()}},
 set:x=>setDoc(doc(fs,p),x),delete:()=>deleteDoc(doc(fs,p)),
 onSnapshot:(f,e)=>onSnapshot(doc(fs,p),s=>f({exists:s.exists(),data:()=>s.data()}),e)});
const db={doc:dref,collection:p=>({onSnapshot:(f,e)=>onSnapshot(collection(fs,p),s=>f({docs:s.docs.map(d=>({id:d.id,data:()=>d.data()}))}),e)})};
const user={can:()=>true,isOwner:()=>false,id:async()=>uid};
window.claude={use:async n=>n=="db"?db:n=="user"?user:null};
// دخول مدير النظام الحقيقي: كلمة السر تُتحقق من خادم Firebase
window.__adminAuth=async pw=>{const r=await signInWithEmailAndPassword(au,adminEmail,pw);uid=r.user.uid};
window.__upload=async f=>{const r=ref(st,"ads/"+Date.now()+"_"+f.name.replace(/[^\w.]/g,"_"));await uploadBytes(r,f);return getDownloadURL(r)};
window.__boot&&window.__boot();
