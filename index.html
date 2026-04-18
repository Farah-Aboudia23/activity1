import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { Trophy, Star, User, GraduationCap, LayoutDashboard, Send, CheckCircle2, PartyPopper, Flag, RotateCcw } from 'lucide-react';

// Firebase Configuration
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'repetition-game-v2';

// Modal Component for Encouragement
const CelebrationModal = ({ isOpen, message, onNext, isFinal }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border-4 border-indigo-500 animate-in zoom-in duration-300">
        {isFinal ? (
          <PartyPopper className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
        ) : (
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4 animate-bounce" />
        )}
        <h2 className="text-2xl font-black text-indigo-900 mb-4">أحسنتِ يا بطلة!</h2>
        <p className="text-gray-600 mb-8 text-lg font-medium">{message}</p>
        <button
          onClick={onNext}
          className={`w-full py-4 rounded-2xl font-black text-xl shadow-lg transition-all active:scale-95 ${isFinal ? 'bg-yellow-500 text-white hover:bg-yellow-600 shadow-yellow-100' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'}`}
        >
          {isFinal ? "العودة للرئيسية" : "المستوى التالي 🚀"}
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [role, setRole] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameState, setGameState] = useState('login');
  const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  
  // Game State
  const [level1Done, setLevel1Done] = useState([]);
  const [level3Slots, setLevel3Slots] = useState({ q1_1: null, q1_2: null, q1_3: null, q2_1: null, q2_2: null });
  const [draggedWord, setDraggedWord] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInAnonymously(auth);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) { console.error(err); }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (role === 'teacher' && user) {
      const q = collection(db, 'artifacts', appId, 'public', 'data', 'studentResults');
      return onSnapshot(q, (snapshot) => {
        setResults(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, (err) => console.error(err));
    }
  }, [role, user]);

  const updateProgress = async (data) => {
    if (!user || role !== 'student') return;
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'studentResults', user.uid);
    await setDoc(docRef, { 
      uid: user.uid, 
      name: studentName, 
      lastUpdate: new Date().toISOString(),
      ...data 
    }, { merge: true });
  };

  const handleStartGame = () => {
    if (!studentName.trim()) return;
    setRole('student');
    setGameState('playing');
    updateProgress({ currentLevel: 1, status: 'بدأت التحدي' });
  };

  const handleNextLevel = () => {
    if (gameState === 'completed') {
      window.location.reload();
      return;
    }
    if (currentLevel < 3) {
      const nextL = currentLevel + 1;
      setCurrentLevel(nextL);
      setShowModal(false);
      updateProgress({ currentLevel: nextL, status: `في المستوى ${nextL}` });
    }
  };

  const resetLevel3 = () => {
    setLevel3Slots({ q1_1: null, q1_2: null, q1_3: null, q2_1: null, q2_2: null });
  };

  // --- Level Logic ---

  const handleL1Answer = (qId, choice, isCorrect) => {
    if (isCorrect) {
      const newDone = [...level1Done, qId];
      setLevel1Done(newDone);
      if (newDone.length === 2) {
        setModalMessage("لقد اجتزتِ اختبار الصح والخطأ ببراعة! مستعدة للتحدي القادم؟");
        setShowModal(true);
        updateProgress({ status: 'أنهت المستوى الأول' });
      }
    } else {
      alert("حاولي مرة أخرى!");
    }
  };

  const handleL2Answer = (isCorrect) => {
    if (isCorrect) {
      setModalMessage("إجابة ذكية جداً! أنتِ الآن في طريقكِ لتصبحي مبرمجة محترفة.");
      setShowModal(true);
      updateProgress({ status: 'أنهت المستوى الثاني' });
    } else {
      alert("إجابة خاطئة، فكري في شروط التكرار!");
    }
  };

  const onDrop = (slotId) => {
    if (!draggedWord) return;
    setLevel3Slots(prev => ({ ...prev, [slotId]: draggedWord }));
    setDraggedWord(null);
  };

  const checkLevel3 = () => {
    const correct = 
      level3Slots.q1_1 === 'حالة منطقية' && 
      level3Slots.q1_2 === 'صحيحة' && 
      level3Slots.q1_3 === 'تخطي' &&
      level3Slots.q2_1 === 'الأوامر' &&
      level3Slots.q2_2 === 'تنفيذها';
    
    if (correct) {
      setModalMessage("مبروك! لقد أتممتِ جميع التحديات بنجاح فائق! أنتِ ملكة التكرار البرمجي.");
      setGameState('completed');
      setShowModal(true);
      updateProgress({ status: 'أتمت اللعبة بنجاح ✨', currentLevel: 4 }); 
    } else {
      alert("بعض الكلمات في غير مكانها الصحيح، حاولي ترتيبها بدقة!");
    }
  };

  // --- Screens ---

  if (role === 'teacher') return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-6 rounded-3xl shadow-sm border-b-4 border-indigo-100 gap-4">
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-4">
            <Trophy className="text-yellow-500 w-10 h-10" /> سباق التكرار البرمجي
          </h1>
          <button onClick={() => setRole(null)} className="bg-slate-100 px-6 py-2 rounded-xl font-bold hover:bg-slate-200 transition text-slate-600">الخروج</button>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-lg mb-10 overflow-hidden relative border-2 border-slate-50">
          <h2 className="text-xl font-black text-slate-700 mb-8 flex items-center gap-2">
            <Flag className="text-red-500" /> مسار التقدم المباشر
          </h2>
          
          <div className="space-y-12 relative">
            <div className="absolute inset-y-0 left-[25%] right-[75%] border-r-2 border-dashed border-slate-100 hidden md:block"></div>
            <div className="absolute inset-y-0 left-[50%] right-[50%] border-r-2 border-dashed border-slate-100 hidden md:block"></div>
            <div className="absolute inset-y-0 left-[75%] right-[25%] border-r-2 border-dashed border-slate-100 hidden md:block"></div>
            
            {results.sort((a,b) => b.currentLevel - a.currentLevel).map((s) => {
              const progress = Math.min((s.currentLevel / 4) * 100, 100);
              return (
                <div key={s.id} className="relative group">
                  <div className="flex justify-between mb-2 items-center">
                    <span className="font-bold text-slate-600">{s.name}</span>
                    <span className="text-xs font-mono text-slate-400">مستوى {s.currentLevel > 3 ? 'مكتمل' : s.currentLevel}</span>
                  </div>
                  <div className="h-4 bg-slate-100 rounded-full w-full relative overflow-visible">
                    <div 
                      className={`absolute top-0 right-0 h-full rounded-full transition-all duration-1000 ease-out ${s.currentLevel > 3 ? 'bg-gradient-to-l from-yellow-400 to-orange-500' : 'bg-gradient-to-l from-indigo-500 to-purple-500'}`}
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white border-2 border-indigo-500 p-1.5 rounded-full shadow-lg z-10">
                        {s.currentLevel > 3 ? (
                          <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        ) : (
                          <User className="w-5 h-5 text-indigo-600" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {results.length === 0 && (
              <div className="text-center py-20 text-slate-300">
                <LayoutDashboard className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-xl font-bold">في انتظار انطلاق المتسابقات...</p>
              </div>
            )}
          </div>
          
          <div className="mt-12 flex justify-between text-[10px] md:text-xs font-bold text-slate-400 border-t pt-4">
            <span>خط البداية</span>
            <span>المستوى 1</span>
            <span>المستوى 2</span>
            <span>المستوى 3</span>
            <span className="text-yellow-600">النهاية 🏆</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (gameState === 'login') return (
    <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-6 font-sans" dir="rtl">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md text-center border-b-[12px] border-indigo-200">
        <div className="bg-indigo-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <GraduationCap className="w-12 h-12 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">تحدي المبرمجين</h1>
        <p className="text-slate-500 mb-8 font-bold">سجلي اسمكِ وانطلقي في السباق!</p>
        <input
          type="text"
          placeholder="اكتبي اسمكِ هنا..."
          className="w-full p-5 bg-slate-100 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl mb-4 text-center text-xl font-bold outline-none transition-all"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
        <button
          onClick={handleStartGame}
          className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          بدء المغامرة <Send className="w-6 h-6" />
        </button>
        <button onClick={() => setRole('teacher')} className="mt-6 text-slate-400 hover:text-indigo-600 text-sm font-bold transition">دخول المعلمة (لوحة السباق)</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans" dir="rtl">
      <CelebrationModal 
        isOpen={showModal} 
        message={modalMessage} 
        isFinal={gameState === 'completed'}
        onNext={handleNextLevel} 
      />

      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-5 rounded-3xl shadow-sm border-b-4 border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-xl"><Trophy className="text-yellow-600 w-6 h-6" /></div>
            <span className="font-black text-slate-700 text-xl">{studentName}</span>
          </div>
          <div className="flex gap-3">
            {[1, 2, 3].map(l => (
              <div key={l} className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-all ${currentLevel >= l ? 'bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-200' : 'bg-slate-200 text-slate-400'}`}>
                {l}
              </div>
            ))}
          </div>
        </header>

        <main className="animate-in slide-in-from-bottom-10 duration-500">
          {currentLevel === 1 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-indigo-900 mb-8 text-right">المستوى الأول: صح أم خطأ ⚖️</h2>
              {[
                { id: 1, t: "التكرار هو سلسلة من الأوامر التي يتم كتابتها مرة واحدة ولكن يتم تنفيذها عدة مرات", a: true },
                { id: 2, t: "التكرار المشروط لا يحتاج إلى حالة منطقية ليعمل", a: false }
              ].map(q => (
                <div key={q.id} className={`bg-white p-8 rounded-[32px] shadow-sm border-2 transition-all ${level1Done.includes(q.id) ? 'border-green-200 bg-green-50' : 'border-slate-100'}`}>
                  <p className="text-xl font-bold text-slate-800 mb-6 leading-relaxed text-right">{q.t}</p>
                  <div className="flex gap-4 flex-row-reverse">
                    <button 
                      onClick={() => handleL1Answer(q.id, true, q.a === true)}
                      disabled={level1Done.includes(q.id)}
                      className={`flex-1 py-4 rounded-2xl font-black text-lg transition-all ${level1Done.includes(q.id) && q.a ? 'bg-green-600 text-white' : 'bg-slate-100 hover:bg-green-100 text-green-700'}`}
                    >صح</button>
                    <button 
                      onClick={() => handleL1Answer(q.id, false, q.a === false)}
                      disabled={level1Done.includes(q.id)}
                      className={`flex-1 py-4 rounded-2xl font-black text-lg transition-all ${level1Done.includes(q.id) && !q.a ? 'bg-green-600 text-white' : 'bg-slate-100 hover:bg-red-100 text-red-700'}`}
                    >خطأ</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentLevel === 2 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-indigo-900 mb-8 text-right">المستوى الثاني: اختيار العباقرة 🧠</h2>
              <div className="bg-white p-8 rounded-[40px] shadow-sm border-2 border-slate-100">
                <p className="text-2xl font-bold text-slate-800 mb-8 leading-relaxed text-right">متى يتم تنفيذ الأوامر داخل التكرار المشروط؟</p>
                <div className="space-y-4">
                  {[
                    { t: "إذا كانت الحالة صحيحة (True)", c: true },
                    { t: "إذا كانت الحالة خاطئة (False)", c: false },
                    { t: "عند إغلاق البرنامج فقط", c: false }
                  ].map((opt, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleL2Answer(opt.c)}
                      className="w-full p-5 text-right border-2 border-slate-100 rounded-2xl font-bold text-lg hover:border-indigo-500 hover:bg-indigo-50 hover:translate-x-[-8px] transition-all"
                    >
                      {opt.t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-white p-8 rounded-[40px] shadow-sm border-2 border-slate-100">
                <p className="text-2xl font-bold text-slate-800 mb-8 leading-relaxed text-right">التكرار هو ؟</p>
                <div className="space-y-4">
                  {[
                    { t: " ", c: true },
                    { t: " ", c: false },
                    { t: " ", c: false }
                  ].map((opt, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleL2Answer(opt.c)}
                      className="w-full p-5 text-right border-2 border-slate-100 rounded-2xl font-bold text-lg hover:border-indigo-500 hover:bg-indigo-50 hover:translate-x-[-8px] transition-all"
                    >
                      {opt.t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentLevel === 3 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-indigo-900 mb-4 text-right">المستوى الثالث: مهندسة الكلمات 🛠️</h2>
              <p className="text-slate-500 mb-6 font-bold text-right">اسحبي الكلمات من الصندوق وضعيها في مكانها الصحيح:</p>
              
              <div className="bg-indigo-100 p-6 rounded-3xl flex flex-wrap gap-4 justify-center border-2 border-indigo-200 mb-8">
                {['حالة منطقية', 'صحيحة', 'تخطي', 'الأوامر', 'تنفيذها'].map(word => {
                  const isUsed = Object.values(level3Slots).includes(word);
                  return (
                    <div
                      key={word}
                      draggable={!isUsed}
                      onDragStart={() => setDraggedWord(word)}
                      className={`px-6 py-3 rounded-xl font-black shadow-md cursor-grab active:cursor-grabbing transition-all ${isUsed ? 'bg-slate-300 text-slate-400 scale-90' : 'bg-white text-indigo-600 hover:scale-105'}`}
                    >
                      {word}
                    </div>
                  );
                })}
              </div>

              <div className="bg-white p-10 rounded-[40px] shadow-sm border-2 border-indigo-50 text-xl leading-[4rem] text-right font-medium relative">
                <div className="mb-10 text-right" dir="rtl">
                  <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg font-black ml-2">التكرار المشروط:</span> 
                  يعتمد على 
                  <div 
                    onDragOver={(e) => e.preventDefault()} 
                    onDrop={() => onDrop('q1_1')}
                    className={`inline-block mx-2 min-w-[140px] h-12 align-middle border-b-4 rounded-t-xl transition-all text-center ${level3Slots.q1_1 ? 'bg-indigo-600 text-white border-indigo-800 px-4' : 'bg-slate-100 border-slate-300'}`}
                  >
                    {level3Slots.q1_1}
                  </div>
                  فإذا كانت الحالة 
                  <div 
                    onDragOver={(e) => e.preventDefault()} 
                    onDrop={() => onDrop('q1_2')}
                    className={`inline-block mx-2 min-w-[100px] h-12 align-middle border-b-4 rounded-t-xl transition-all text-center ${level3Slots.q1_2 ? 'bg-indigo-600 text-white border-indigo-800 px-4' : 'bg-slate-100 border-slate-300'}`}
                  >
                    {level3Slots.q1_2}
                  </div>
                  يتم تنفيذ الأوامر، وإلا سيتم 
                  <div 
                    onDragOver={(e) => e.preventDefault()} 
                    onDrop={() => onDrop('q1_3')}
                    className={`inline-block mx-2 min-w-[100px] h-12 align-middle border-b-4 rounded-t-xl transition-all text-center ${level3Slots.q1_3 ? 'bg-indigo-600 text-white border-indigo-800 px-4' : 'bg-slate-100 border-slate-300'}`}
                  >
                    {level3Slots.q1_3}
                  </div>
                  التكرار.
                </div>

                <div className="pt-8 border-t-2 border-slate-50 text-right" dir="rtl">
                  <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg font-black ml-2">التكرار:</span>
                  هو سلسلة من 
                  <div 
                    onDragOver={(e) => e.preventDefault()} 
                    onDrop={() => onDrop('q2_1')}
                    className={`inline-block mx-2 min-w-[120px] h-12 align-middle border-b-4 rounded-t-xl transition-all text-center ${level3Slots.q2_1 ? 'bg-indigo-600 text-white border-indigo-800 px-4' : 'bg-slate-100 border-slate-300'}`}
                  >
                    {level3Slots.q2_1}
                  </div>
                  التي يتم كتابتها مرة واحدة ويتم 
                  <div 
                    onDragOver={(e) => e.preventDefault()} 
                    onDrop={() => onDrop('q2_2')}
                    className={`inline-block mx-2 min-w-[120px] h-12 align-middle border-b-4 rounded-t-xl transition-all text-center ${level3Slots.q2_2 ? 'bg-indigo-600 text-white border-indigo-800 px-4' : 'bg-slate-100 border-slate-300'}`}
                  >
                    {level3Slots.q2_2}
                  </div>
                  عدة مرات.
                </div>

                <div className="flex gap-4 mt-12">
                  <button 
                    onClick={checkLevel3}
                    className="flex-[3] bg-emerald-500 text-white py-5 rounded-2xl font-black text-2xl shadow-xl hover:bg-emerald-600 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    تحقق من الحل الفائز 🏆
                  </button>
                  <button 
                    onClick={resetLevel3}
                    className="flex-1 bg-slate-100 text-slate-500 py-5 rounded-2xl font-black text-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                    title="إعادة تعيين الكلمات"
                  >
                    <RotateCcw className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
// Modal Component for Students
const CelebrationModal = ({ isOpen, message, onNext, isFinal }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] shadow-2xl p-10 max-w-md w-full text-center border-4 border-yellow-400 animate-in zoom-in duration-300 relative overflow-hidden">
        {isFinal && (
          <div className="absolute inset-0 pointer-events-none opacity-20">
            {[...Array(10)].map((_, i) => (
              <Heart key={i} className="absolute text-red-500 animate-bounce" style={{ top: `${Math.random()*100}%`, left: `${Math.random()*100}%`, animationDelay: `${Math.random()}s` }} />
            ))}
          </div>
        )}
        
        {isFinal ? (
          <PartyPopper className="w-24 h-24 text-yellow-500 mx-auto mb-6 animate-bounce" />
        ) : (
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4 animate-pulse" />
        )}
        
        <h2 className="text-3xl font-black text-indigo-900 mb-4">
          {isFinal ? "مبارك يا أميرة البرمجة!" : "أحسنتِ يا بطلة!"}
        </h2>
        
        <p className="text-gray-600 mb-8 text-xl font-bold leading-relaxed">{message}</p>
        
        {!isFinal ? (
          <button
            onClick={onNext}
            className="w-full py-5 rounded-3xl font-black text-2xl shadow-lg transition-all active:scale-95 bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100"
          >
            المستوى التالي 🚀
          </button>
        ) : (
          <div className="p-6 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
             <p className="text-yellow-700 font-black text-lg">لقد أتممتِ السباق بنجاح باهر! 🏆</p>
             <p className="text-slate-500 text-sm mt-2 font-bold italic">الإنجاز محفوظ الآن في لوحة المعلمة</p>
          </div>
        )}
      </div>
    </div>
  );
};
