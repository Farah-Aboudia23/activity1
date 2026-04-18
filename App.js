import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  deleteDoc, 
  query 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  Cpu, 
  Leaf, 
  Lock, 
  Unlock, 
  Zap, 
  AlertCircle, 
  Droplet, 
  FileText, 
  Award, 
  Trash2 
} from 'lucide-react';

// --- Firebase Configuration ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'sustainable-lab-v2';

// --- Components ---
const Icon = ({ name: name, size = 20, className = "" }) => {
  const icons = {
    cpu: <Cpu size={size} className={className} />,
    leaf: <Leaf size={size} className={className} />,
    lock: <Lock size={size} className={className} />,
    unlock: <Unlock size={size} className={className} />,
    zap: <Zap size={size} className={className} />,
    "alert-circle": <AlertCircle size={size} className={className} />,
    droplet: <Droplet size={size} className={className} />,
    "file-text": <FileText size={size} className={className} />,
    award: <Award size={size} className={className} />,
    "trash-2": <Trash2 size={size} className={className} />
  };
  return icons[name] || null;
};

const reinforcementMessages = [
  "أنتِ مبرمجة متميزة! ذكاؤكِ يساهم في حماية البيئة.",
  "عمل رائع! لقد أتقنتِ مفهوم التكرار بكفاءة عالية.",
  "مذهل! تفكيركِ المنطقي يقودكِ نحو مستقبل تقني مشرق.",
  "بارك الله في جهودكِ، حل ذكي ومختصر تماماً كالمحترفين."
];

const InteractivePlant = ({ progress }) => {
  const height = 30 + (progress * 0.6);
  const color = progress < 50 ? "#94a3b8" : (progress < 100 ? "#4ade80" : "#16a34a");
  const leafOpacity = progress > 20 ? 1 : 0;
  const secondLeafOpacity = progress > 60 ? 1 : 0;

  return (
    <div className="flex flex-col items-center justify-end h-40 w-full overflow-visible">
      <svg width="100" height="130" viewBox="0 0 100 130" className="transition-all duration-500">
        <ellipse cx="50" cy="120" rx="30" ry="8" fill="#78350f" opacity="0.2" />
        <rect x="48" y={120 - height} width="4" height={height} rx="2" fill={color} className="transition-all duration-500" />
        <g opacity={leafOpacity} transform={`translate(50, ${110 - height * 0.4})`} className="transition-all duration-500">
          <path d="M0 0 C 15 -8, 25 8, 0 15 C -8 8, -8 -8, 0 0" fill={color} transform="rotate(-30)" />
        </g>
        <g opacity={secondLeafOpacity} transform={`translate(50, ${110 - height * 0.7})`} className="transition-all duration-500">
          <path d="M0 0 C -15 -8, -25 8, 0 15 C 8 8, 8 -8, 0 0" fill={color} transform="rotate(30)" />
        </g>
        {progress >= 100 && (
          <g transform={`translate(50, ${125 - height})`} className="animate-bounce">
            <circle cx="0" cy="0" r="6" fill="#facc15" />
            {[0, 72, 144, 216, 288].map(deg => (
              <ellipse key={deg} cx="9" cy="0" rx="6" ry="4" fill="#fde047" transform={`rotate(${deg})`} />
            ))}
          </g>
        )}
      </svg>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('student');
  const [step, setStep] = useState(1);
  const [studentName, setStudentName] = useState('');
  const [responses, setResponses] = useState({ q1: '', q2: '', reflection: '' });
  const [moisture, setMoisture] = useState(0);
  const [showQ2, setShowQ2] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedData, setSubmittedData] = useState([]);
  const [currentReinforcement, setCurrentReinforcement] = useState('');

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const TEACHER_PASSWORD = "1234";

  const correctAnswerQ1 = "(1) تجعل الكود أقصر، أسرع في البرمجة وأقل أخطاء.";
  const correctAnswerQ2 = "(1) عندما يصبح الشرط خاطئاً (أي وصلت الرطوبة لـ 100%).";

  // Auth Initialization
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth failed", error);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Real-time Data Fetching for Teacher View
  useEffect(() => {
    if (!user) return;

    const q = collection(db, 'artifacts', appId, 'public', 'data', 'submissions');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort in JS to follow RULE 2 (no complex queries)
      const sorted = docs.sort((a, b) => b.timestamp - a.timestamp);
      setSubmittedData(sorted);
    }, (error) => {
      console.error("Firestore sync error:", error);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (moisture >= 100) {
      const timer = setTimeout(() => setShowQ2(true), 600);
      return () => clearTimeout(timer);
    }
  }, [moisture]);

  const handleNextStep = (currentStepResponse, correctResponse, nextStep) => {
    if (currentStepResponse === correctResponse) {
      setErrorMessage('');
      setStep(nextStep);
    } else {
      setErrorMessage('إجابة خاطئة! حاولي مرة أخرى لاكتشاف سر الكود المستدام.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const saveSubmission = async () => {
    if (!user) return;
    
    try {
      const newEntry = { 
        ...responses, 
        name: studentName, 
        timestamp: Date.now(),
        dateStr: new Date().toLocaleString('ar-SA')
      };
      
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'submissions'), newEntry);
      
      const msg = reinforcementMessages[Math.floor(Math.random() * reinforcementMessages.length)];
      setCurrentReinforcement(msg);
      setStep(5);
    } catch (err) {
      console.error("Submission failed", err);
    }
  };

  const deleteEntry = async (docId) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'submissions', docId));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const checkPassword = () => {
    if (enteredPassword === TEACHER_PASSWORD) {
      setView('teacher');
      setIsPasswordModalOpen(false);
      setEnteredPassword('');
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 2000);
    }
  };

  const Header = () => (
    <header className="bg-[#00a99d] p-4 flex justify-between items-center text-white shadow-md sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-lg"><Icon name="leaf" /></div>
        <h1 className="font-bold text-lg">مختبر البرمجة المستدامة</h1>
      </div>
      <button 
        onClick={() => view === 'teacher' ? setView('student') : setIsPasswordModalOpen(true)} 
        className={`flex items-center gap-2 text-sm px-4 py-2 rounded-full transition-all ${view === 'teacher' ? 'bg-white text-[#00a99d] shadow-inner font-bold' : 'bg-white/10 hover:bg-white/20'}`}
      >
        {view === 'teacher' ? 'العودة للمختبر' : 'لوحة المعلمة'}
        <Icon name={view === 'teacher' ? "unlock" : "lock"} size={16} />
      </button>
    </header>
  );

  if (isPasswordModalOpen) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="lock" size={32} className="text-[#00a99d]" />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">منطقة المعلمة</h3>
          <p className="text-slate-500 text-sm mb-6">يرجى إدخال كلمة المرور (1234)</p>
          <input 
            type="password" 
            className={`w-full p-4 rounded-xl border-2 text-center text-2xl font-black outline-none transition-all mb-4 ${passwordError ? 'border-red-500 bg-red-50' : 'border-slate-100 bg-slate-50 focus:border-[#00a99d]'}`}
            value={enteredPassword}
            onChange={(e) => setEnteredPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && checkPassword()}
            autoFocus
            placeholder="••••"
          />
          <div className="flex gap-3">
            <button onClick={() => setIsPasswordModalOpen(false)} className="flex-1 py-3 text-slate-400 font-bold">إلغاء</button>
            <button onClick={checkPassword} className="flex-1 bg-[#00a99d] text-white py-3 rounded-xl font-bold">دخول</button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'teacher') {
    return (
      <div className="min-h-screen bg-slate-50 font-['Tajawal']" dir="rtl">
        <Header />
        <div className="p-8 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-2">
            <span className="bg-[#00a99d] w-3 h-8 rounded-full"></span>
            استجابات الطالبات السحابية ({submittedData.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {submittedData.length === 0 ? (
              <div className="col-span-full py-20 text-center text-slate-400 border-2 border-dashed rounded-3xl bg-white">في انتظار إجابات الطالبات...</div>
            ) : (
              submittedData.map(d => (
                <div key={d.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative group overflow-hidden animate-in fade-in slide-in-from-bottom duration-300">
                  <button 
                    onClick={() => deleteEntry(d.id)}
                    className="absolute top-4 left-4 p-2 text-slate-200 hover:text-red-500 transition-colors"
                  >
                    <Icon name="trash-2" size={18} />
                  </button>
                  <div className="font-bold text-teal-600 mb-1 ml-6">{d.name}</div>
                  <div className="text-[10px] text-slate-400 mb-4">{d.dateStr}</div>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-teal-500 block">الفائدة من التكرار:</span>
                      <p className="text-xs text-slate-600 leading-relaxed">{d.q1}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-teal-500 block">متى يتوقف While:</span>
                      <p className="text-xs text-slate-600 leading-relaxed">{d.q2}</p>
                    </div>
                    <div className="bg-teal-50/50 p-3 rounded-xl">
                      <span className="text-[10px] font-bold text-slate-400 mb-1 block">الاستنتاج:</span>
                      <p className="text-slate-700 text-sm italic leading-relaxed">"{d.reflection}"</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 font-['Tajawal']" dir="rtl">
      <Header />
      <div className="max-w-4xl mx-auto px-4 mt-10">
        
        {step === 1 && (
          <div className="bg-white rounded-[2.5rem] shadow-xl p-12 text-center border-t-[12px] border-[#00a99d] animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="cpu" size={40} className="text-[#00a99d]" />
            </div>
            <h1 className="text-4xl font-black text-slate-800 mb-4">مختبر البرمجة المستدامة</h1>
            <p className="text-slate-500 text-lg mb-10">استكشفي معنا كيف نكتب أكواداً ذكية تحافظ على مواردنا وبيئتنا.</p>
            <button onClick={() => setStep(2)} className="bg-[#00a99d] text-white px-12 py-5 rounded-full font-bold text-xl hover:scale-105 transition-all shadow-lg shadow-teal-100">ابدأ المهمة</button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-[2.5rem] shadow-lg overflow-hidden border border-slate-100 animate-in slide-in-from-left duration-500">
            <div className="bg-[#00a99d] p-6 text-white font-bold flex items-center gap-2"><Icon name="zap" /> المرحلة الأولى: اختصار الكود</div>
            <div className="p-8">
              <p className="text-slate-600 mb-8 font-medium">ساعدي نورة في تحويل الكود الطويل إلى كود ذكي باستخدام التكرار.</p>
              
              <div className="grid md:grid-cols-2 gap-8 mb-10 items-start">
                <div className="bg-emerald-50 p-6 rounded-3xl border-2 border-emerald-100 shadow-inner opacity-70">
                  <h4 className="text-center text-[11px] font-black text-emerald-600 mb-4 uppercase">بدون تكرار (كود طويل)</h4>
                  <div className="flex flex-col items-center gap-1 scale-90">
                    {[1,2,3,4].map(i => (
                      <React.Fragment key={i}>
                        <div className="bg-[#eab308] px-3 py-1 text-white text-[10px] rounded font-bold w-full text-center">انتظر 1 ثانية</div>
                        <div className="bg-[#4f46e5] px-3 py-1 text-white text-[10px] rounded font-bold w-full text-center">تحرك 50 خطوة</div>
                        <div className="bg-[#4f46e5] px-3 py-1 text-white text-[10px] rounded font-bold w-full text-center">استدر 90 درجة</div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="bg-emerald-50 p-6 rounded-3xl border-2 border-emerald-100 shadow-inner">
                  <h4 className="text-center text-[11px] font-black text-emerald-600 mb-4 uppercase">استخدام التكرار (كود ذكي)</h4>
                  <div className="max-w-[200px] mx-auto bg-[#eab308] p-3 rounded-2xl">
                    <div className="text-white text-xs font-bold mb-2">كرر <span className="bg-white text-slate-800 px-2 rounded mx-1">4</span> مرات</div>
                    <div className="bg-white/10 p-2 rounded-xl space-y-1">
                      <div className="bg-[#eab308] px-2 py-1 text-white text-[10px] rounded font-bold">انتظر 1 ثانية</div>
                      <div className="bg-[#4f46e5] px-2 py-1 text-white text-[10px] rounded font-bold">تحرك 50 خطوة</div>
                      <div className="bg-[#4f46e5] px-2 py-1 text-white text-[10px] rounded font-bold">استدر 90 درجة</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="font-bold text-slate-700 block text-lg">سؤال (1): ما هي الفائدة الأساسية من استخدام "التكرار"؟</label>
                {[
                  "(1) تجعل الكود أقصر، أسرع في البرمجة وأقل أخطاء.",
                  "(2) لا تفرق بشيء سوى أنها تزيد عدد اللبنات البرمجية.",
                  "(3) تجعل الكود أبطأ ولا يعمل في الأجهزة القديمة."
                ].map(opt => (
                  <button key={opt} onClick={() => { setResponses({...responses, q1: opt}); setErrorMessage(''); }} className={`w-full p-5 text-right rounded-2xl border-2 transition-all font-bold ${responses.q1 === opt ? 'border-[#00a99d] bg-teal-50 text-[#00a99d]' : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`}>{opt}</button>
                ))}

                {errorMessage && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 font-bold animate-bounce">
                    <Icon name="alert-circle" /> {errorMessage}
                  </div>
                )}

                <button disabled={!responses.q1} onClick={() => handleNextStep(responses.q1, correctAnswerQ1, 3)} className="w-full bg-slate-800 text-white p-5 rounded-2xl font-bold mt-4 shadow-xl disabled:opacity-30">المرحلة التالية</button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-[2.5rem] shadow-lg overflow-hidden border border-slate-100 animate-in slide-in-from-left duration-500">
            <div className="bg-blue-600 p-6 text-white font-bold flex items-center gap-2"><Icon name="droplet" /> المرحلة الثانية: الري الذكي (While)</div>
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-slate-50 rounded-[2rem] p-6 border-2 border-slate-100 flex flex-col justify-center items-center h-[280px] shadow-inner">
                  <InteractivePlant progress={moisture} />
                  <div className="w-full mt-4">
                    <div className="flex justify-between text-[10px] font-black text-slate-400 mb-1 px-1">
                      <span>مستوى الرطوبة:</span>
                      <span>{moisture}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden p-0.5">
                      <div className={`h-full rounded-full transition-all duration-300 ${moisture >= 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${moisture}%` }}></div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button 
                    onMouseDown={() => {
                      const interval = setInterval(() => {
                        setMoisture(m => { if (m >= 100) { clearInterval(interval); return 100; } return m + 4; });
                      }, 80);
                      const stop = () => { clearInterval(interval); window.removeEventListener('mouseup', stop); };
                      window.addEventListener('mouseup', stop);
                    }}
                    disabled={moisture >= 100}
                    className={`py-6 rounded-3xl font-black text-xl shadow-lg transition-all ${moisture >= 100 ? 'bg-emerald-100 text-emerald-600 scale-95' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'}`}
                  >
                    {moisture >= 100 ? "تم الري بنجاح!" : "اضغطي باستمرار للري"}
                  </button>
                </div>
              </div>

              {showQ2 && (
                <div className="mt-8 pt-8 border-t-2 border-slate-50 space-y-4 animate-in fade-in slide-in-from-bottom">
                  <label className="font-bold text-slate-700 block text-lg">سؤال (2): متى يتوقف تكرار (While) عن العمل؟</label>
                  {[
                    "(1) عندما يصبح الشرط خاطئاً (أي وصلت الرطوبة لـ 100%).",
                    "(2) يتوقف بمجرد الضغط على زر الفأرة مرة واحدة فقط.",
                    "(3) لا يتوقف أبداً وسيستمر البرنامج في العمل للأبد."
                  ].map(opt => (
                    <button key={opt} onClick={() => { setResponses({...responses, q2: opt}); setErrorMessage(''); }} className={`w-full p-5 text-right rounded-2xl border-2 transition-all font-bold ${responses.q2 === opt ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-500 hover:bg-slate-50'}`}>{opt}</button>
                  ))}
                  
                  {errorMessage && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 font-bold animate-bounce">
                      <Icon name="alert-circle" /> {errorMessage}
                    </div>
                  )}

                  <button disabled={!responses.q2} onClick={() => handleNextStep(responses.q2, correctAnswerQ2, 4)} className="w-full bg-slate-800 text-white p-5 rounded-2xl font-bold mt-4 shadow-xl disabled:opacity-30">تجهيز التقرير</button>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100 animate-in zoom-in duration-500">
            <h2 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-3">
              <Icon name="file-text" className="text-teal-600" /> تقرير المختبر السحابي
            </h2>
            <div className="space-y-6">
              <div>
                <label className="font-bold text-slate-600 block mb-2">أسماء الطالبات (الثنائي):</label>
                <input type="text" className="w-full p-4 rounded-xl border-2 bg-slate-50 outline-none focus:border-teal-500 transition-all font-bold" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="اكتبي الأسماء هنا..." />
              </div>
              <div>
                <label className="font-bold text-slate-600 block mb-2">ماذا استنتجتِ عن تكرار (While) من خلال التجربة؟</label>
                <textarea rows="4" className="w-full p-4 rounded-xl border-2 bg-slate-50 outline-none focus:border-teal-500 transition-all font-bold" value={responses.reflection} onChange={(e) => setResponses({...responses, reflection: e.target.value})} placeholder="استنتجنا أن تكرار While..." />
              </div>
              <button disabled={!studentName || !responses.reflection} onClick={saveSubmission} className="w-full bg-[#00a99d] text-white p-5 rounded-2xl font-black text-xl shadow-lg hover:bg-teal-700 disabled:opacity-30 transition-all">إرسال التقرير سحابياً</button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="bg-white rounded-[3rem] shadow-2xl p-16 text-center border-b-8 border-emerald-500 animate-in zoom-in duration-700">
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Icon name="award" size={56} className="text-emerald-500" />
            </div>
            <h1 className="text-4xl font-black text-slate-800 mb-4">تم الإرسال بنجاح!</h1>
            
            <div className="bg-emerald-50 p-6 rounded-[2rem] mb-8 border border-emerald-100">
              <p className="text-xl text-emerald-700 font-bold leading-relaxed">{currentReinforcement}</p>
            </div>

            <p className="text-slate-400 mb-2 italic">لقد استلمت المعلمة تقريركن الآن عبر الإنترنت.</p>
            <button onClick={() => setStep(1)} className="text-teal-600 font-bold hover:underline">العودة للبداية</button>
          </div>
        )}
      </div>
    </div>
  );
}
