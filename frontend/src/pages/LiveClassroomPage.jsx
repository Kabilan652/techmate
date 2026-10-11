import React, { useMemo, useState } from "react";
import {
  Video, Users, Clock3, Plus, Copy, Play, Square, Radio, BookOpen,
  CheckCircle2, XCircle, BarChart3, CalendarDays, KeyRound, ArrowRight,
  MessageSquare, Sparkles, ClipboardList, CircleHelp, Wifi
} from "lucide-react";

const initialSessions = [
  {
    id: "session-demo",
    code: "SQL729",
    title: "Introduction to SQL JOINs",
    subject: "SQL",
    topic: "INNER JOIN",
    date: "Today",
    time: "10:00 AM",
    status: "live",
    instructor: "You",
    participants: [
      { id: 1, name: "Arun Kumar", joined: true, score: 2, answered: 2 },
      { id: 2, name: "Priya S", joined: true, score: 1, answered: 2 },
      { id: 3, name: "Rahul M", joined: true, score: 2, answered: 2 },
      { id: 4, name: "Divya R", joined: false, score: 0, answered: 0 },
    ],
    questions: [
      {
        id: 1,
        question: "Which SQL JOIN returns only matching rows from both tables?",
        options: ["LEFT JOIN", "INNER JOIN", "CROSS JOIN", "FULL OUTER JOIN"],
        answer: 1,
        skill: "SQL JOINs",
      },
      {
        id: 2,
        question: "Which JOIN keeps every row from the left table?",
        options: ["RIGHT JOIN", "INNER JOIN", "LEFT JOIN", "CROSS JOIN"],
        answer: 2,
        skill: "SQL JOINs",
      },
      {
        id: 3,
        question: "Which JOIN produces combinations of rows from both tables?",
        options: ["CROSS JOIN", "LEFT JOIN", "INNER JOIN", "SELF JOIN"],
        answer: 0,
        skill: "SQL JOINs",
      },
    ],
  },
];

const cn = (...classes) => classes.filter(Boolean).join(" ");

function StatCard({ icon: Icon, label, value, helper }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-500">{label}</span>
        <span className="rounded-xl bg-indigo-50 p-2 text-indigo-600"><Icon size={19} /></span>
      </div>
      <div className="mt-3 text-3xl font-black tracking-tight text-slate-900">{value}</div>
      {helper && <p className="mt-1 text-xs text-slate-500">{helper}</p>}
    </div>
  );
}

function Badge({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700",
    green: "bg-emerald-100 text-emerald-700",
    red: "bg-red-100 text-red-700",
    indigo: "bg-indigo-100 text-indigo-700",
    amber: "bg-amber-100 text-amber-800",
  };
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold", tones[tone])}>{children}</span>;
}

export default function LiveClassroomPage() {
  const [role, setRole] = useState("instructor");
  const [sessions, setSessions] = useState(initialSessions);
  const [activeSessionId, setActiveSessionId] = useState("session-demo");
  const [view, setView] = useState("overview");
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState("");
  const [createForm, setCreateForm] = useState({ title: "", subject: "Computer Science", topic: "", date: "", time: "" });
  const [joinCode, setJoinCode] = useState("");
  const [studentName, setStudentName] = useState("New Student");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState(null);
  const [submittedAnswer, setSubmittedAnswer] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const currentQuestion = activeSession?.questions?.[questionIndex];
  const joinedCount = activeSession?.participants?.filter((p) => p.joined).length || 0;
  const averageScore = useMemo(() => {
    const participants = activeSession?.participants?.filter((p) => p.joined && p.answered > 0) || [];
    if (!participants.length) return 0;
    return Math.round(participants.reduce((sum, p) => sum + (p.score / p.answered) * 100, 0) / participants.length);
  }, [activeSession]);

  const updateActiveSession = (updater) => {
    setSessions((previous) => previous.map((session) => session.id === activeSessionId ? updater(session) : session));
  };

  const createSession = (event) => {
    event.preventDefault();
    const code = `${createForm.subject.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase() || "TMA"}${Math.floor(100 + Math.random() * 900)}`;
    const newSession = {
      id: `session-${Date.now()}`, code, ...createForm, date: createForm.date || "Today",
      time: createForm.time || "Starting now", status: "live", instructor: "You",
      participants: [], questions: [
        { id: 1, question: `Quick check: what is the key idea behind ${createForm.topic || createForm.title}?`, options: ["Understand the concept", "Skip all practice", "Memorize without context", "Ignore feedback"], answer: 0, skill: createForm.topic || createForm.title },
      ],
    };
    setSessions((previous) => [newSession, ...previous]);
    setActiveSessionId(newSession.id);
    setQuestionIndex(0);
    setView("session");
    setShowCreate(false);
    setCreateForm({ title: "", subject: "Computer Science", topic: "", date: "", time: "" });
    setNotice("Your session is ready. Share the session code with students.");
  };

  const joinSession = (event) => {
    event.preventDefault();
    const match = sessions.find((s) => s.code.toUpperCase() === joinCode.trim().toUpperCase());
    if (!match) {
      setNotice("No session was found for that code. Try SQL729 for the demo session.");
      return;
    }
    setActiveSessionId(match.id);
    setSessions((previous) => previous.map((session) => session.id !== match.id ? session : {
      ...session,
      participants: session.participants.some((p) => p.name.toLowerCase() === studentName.trim().toLowerCase())
        ? session.participants.map((p) => p.name.toLowerCase() === studentName.trim().toLowerCase() ? { ...p, joined: true } : p)
        : [...session.participants, { id: Date.now(), name: studentName.trim() || "Student", joined: true, score: 0, answered: 0 }],
    }));
    setQuestionIndex(0);
    setStudentAnswer(null);
    setSubmittedAnswer(false);
    setRevealed(false);
    setShowJoin(false);
    setRole("student");
    setView("session");
    setNotice("You joined the session in this preview.");
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(activeSession.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setNotice(`Session code: ${activeSession.code}`);
    }
  };

  const endSession = () => {
    updateActiveSession((session) => ({ ...session, status: "ended" }));
    setView("report");
    setNotice("Session ended. This preview report is based on local demo data.");
  };

  const submitStudentAnswer = () => {
    if (studentAnswer === null || submittedAnswer) return;
    const correct = studentAnswer === currentQuestion.answer;
    updateActiveSession((session) => ({
      ...session,
      participants: session.participants.map((p) =>
        p.name.toLowerCase() === studentName.trim().toLowerCase()
          ? { ...p, answered: p.answered + 1, score: p.score + (correct ? 1 : 0), joined: true }
          : p
      ),
    }));
    setSubmittedAnswer(true);
    setRevealed(true);
  };

  const nextQuestion = () => {
    if (questionIndex < activeSession.questions.length - 1) {
      setQuestionIndex((index) => index + 1);
      setStudentAnswer(null);
      setSubmittedAnswer(false);
      setRevealed(false);
    } else {
      setView("report");
    }
  };

  const nav = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "session", label: "Live session", icon: Radio },
    { id: "report", label: "Session report", icon: ClipboardList },
  ];

  return (
    <div className="h-full overflow-y-auto bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6 pb-12">
        <header className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-indigo-700 via-blue-600 to-violet-600 p-6 text-white shadow-lg shadow-indigo-200/50 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-indigo-100">
                <Video size={14} /> TechMate Live Classroom
              </div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Bring learning to life.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-100 sm:text-base">
                Run interactive learning sessions, launch quick quizzes, track participation, and identify topics that need more practice.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowCreate(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-indigo-700 shadow-sm transition hover:bg-indigo-50">
                <Plus size={18} /> Create session
              </button>
              <button onClick={() => setShowJoin(true)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/20">
                <KeyRound size={18} /> Join with code
              </button>
            </div>
          </div>
        </header>

        {notice && (
          <div className="flex items-start justify-between gap-4 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-800">
            <span>{notice}</span>
            <button onClick={() => setNotice("")} className="font-bold text-indigo-500 hover:text-indigo-800">Dismiss</button>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            {nav.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setView(id)} className={cn("inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition", view === id ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100")}>
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1">
            <span className="pl-2 text-xs font-bold uppercase tracking-wide text-slate-400">Preview as</span>
            <button onClick={() => { setRole("instructor"); setView("overview"); }} className={cn("rounded-lg px-3 py-2 text-sm font-bold", role === "instructor" ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50")}>Instructor</button>
            <button onClick={() => { setRole("student"); setView("overview"); }} className={cn("rounded-lg px-3 py-2 text-sm font-bold", role === "student" ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50")}>Student</button>
          </div>
        </div>

        {view === "overview" && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard icon={Radio} label="Active sessions" value={sessions.filter((s) => s.status === "live").length} helper="Across your classroom" />
              <StatCard icon={Users} label="Participants" value={sessions.reduce((n, s) => n + s.participants.filter((p) => p.joined).length, 0)} helper="Joined in this preview" />
              <StatCard icon={ClipboardList} label="Questions ready" value={sessions.reduce((n, s) => n + s.questions.length, 0)} helper="Across available sessions" />
              <StatCard icon={BarChart3} label="Average accuracy" value={`${averageScore}%`} helper="Based on answered questions" />
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-slate-900">{role === "instructor" ? "Your classroom sessions" : "Available live sessions"}</h2>
                  <p className="mt-1 text-sm text-slate-500">{role === "instructor" ? "Create a session or open one to manage quizzes and participation." : "Choose a session or join with its session code."}</p>
                </div>
                <Badge tone="green"><span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" /> Preview mode</Badge>
              </div>
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-indigo-200 hover:bg-slate-50/70 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600"><BookOpen size={22} /></div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-900">{session.title}</h3>
                          <Badge tone={session.status === "live" ? "green" : "slate"}>{session.status === "live" ? "● Live now" : "Ended"}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">{session.subject} · {session.topic || "General topic"}</p>
                        <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
                          <span className="inline-flex items-center gap-1"><CalendarDays size={14} /> {session.date} · {session.time}</span>
                          <span className="inline-flex items-center gap-1"><Users size={14} /> {session.participants.filter((p) => p.joined).length} participants</span>
                          <span className="inline-flex items-center gap-1"><KeyRound size={14} /> Code: {session.code}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => { setActiveSessionId(session.id); setQuestionIndex(0); setView("session"); }} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700">
                      {role === "instructor" ? "Manage session" : "Open session"} <ArrowRight size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3"><div className="rounded-xl bg-emerald-50 p-3 text-emerald-600"><Sparkles size={21} /></div><div><h3 className="font-black text-slate-900">Adaptive learning connection</h3><p className="text-sm text-slate-500">Designed for PS-21</p></div></div>
                <p className="mt-4 text-sm leading-6 text-slate-600">Live quiz attempts can become student-response events. In the integrated version, these events will feed the DKT model and help recommend the next exercise for each learner.</p>
                <div className="mt-4 flex flex-wrap gap-2"><Badge tone="indigo">Response tracking</Badge><Badge tone="indigo">Skill mastery</Badge><Badge tone="indigo">Next exercise</Badge></div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3"><div className="rounded-xl bg-amber-50 p-3 text-amber-600"><Wifi size={21} /></div><div><h3 className="font-black text-slate-900">Preview limitations</h3><p className="text-sm text-slate-500">Frontend-only prototype</p></div></div>
                <p className="mt-4 text-sm leading-6 text-slate-600">This interface uses local demo state. Sessions and answers are not shared across browsers or saved to a database yet. Real multi-user live updates require backend APIs and Socket.IO integration.</p>
              </div>
            </div>
          </>
        )}

        {view === "session" && activeSession && (
          <div className="grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
            <section className="space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2"><Badge tone={activeSession.status === "live" ? "green" : "slate"}>{activeSession.status === "live" ? "LIVE SESSION" : "SESSION ENDED"}</Badge><Badge>{activeSession.subject}</Badge></div>
                    <h2 className="mt-3 text-2xl font-black text-slate-900">{activeSession.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{activeSession.topic} · Hosted by {activeSession.instructor}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Session code</p>
                    <div className="mt-1 flex items-center gap-2"><span className="text-xl font-black tracking-widest text-indigo-700">{activeSession.code}</span><button title="Copy session code" onClick={copyCode} className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-indigo-600"><Copy size={16} /></button></div>
                    {copied && <p className="mt-1 text-xs font-semibold text-emerald-600">Copied!</p>}
                  </div>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-400">Participants</p><p className="mt-1 text-2xl font-black text-slate-900">{joinedCount}</p></div>
                  <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-400">Quiz questions</p><p className="mt-1 text-2xl font-black text-slate-900">{activeSession.questions.length}</p></div>
                  <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-400">Average accuracy</p><p className="mt-1 text-2xl font-black text-slate-900">{averageScore}%</p></div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-indigo-500">Live quiz</p><h3 className="mt-1 text-xl font-black text-slate-900">Question {questionIndex + 1} of {activeSession.questions.length}</h3></div><Badge tone="amber">{currentQuestion?.skill || "Practice"}</Badge></div>
                {currentQuestion ? (
                  <>
                    <h4 className="text-lg font-bold leading-7 text-slate-900">{currentQuestion.question}</h4>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {currentQuestion.options.map((option, index) => {
                        const isChosen = studentAnswer === index;
                        const isRight = revealed && currentQuestion.answer === index;
                        const isWrong = revealed && isChosen && currentQuestion.answer !== index;
                        return <button key={option} onClick={() => { if (role === "student" && !submittedAnswer) setStudentAnswer(index); }} disabled={role === "instructor" || submittedAnswer} className={cn("flex items-center gap-3 rounded-xl border p-4 text-left text-sm font-semibold transition", isRight ? "border-emerald-300 bg-emerald-50 text-emerald-800" : isWrong ? "border-red-300 bg-red-50 text-red-800" : isChosen ? "border-indigo-300 bg-indigo-50 text-indigo-800" : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200", role === "instructor" && "cursor-default")}>
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-black">{String.fromCharCode(65 + index)}</span>{option}
                          {isRight && <CheckCircle2 className="ml-auto shrink-0 text-emerald-600" size={18} />}
                          {isWrong && <XCircle className="ml-auto shrink-0 text-red-600" size={18} />}
                        </button>;
                      })}
                    </div>
                    {role === "student" && !submittedAnswer && <button disabled={studentAnswer === null} onClick={submitStudentAnswer} className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300">Submit answer</button>}
                    {role === "student" && revealed && <div className={cn("mt-4 rounded-xl p-4 text-sm font-semibold", studentAnswer === currentQuestion.answer ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800")}>{studentAnswer === currentQuestion.answer ? "Correct answer! Great work." : `Not quite. Correct answer: ${currentQuestion.options[currentQuestion.answer]}.`} Your response is reflected in this local preview.</div>}
                    {role === "instructor" && <div className="mt-5 flex flex-wrap gap-3"><button onClick={() => setRevealed((value) => !value)} className="rounded-xl border border-indigo-200 px-4 py-2.5 text-sm font-bold text-indigo-700 hover:bg-indigo-50">{revealed ? "Hide answer" : "Reveal answer"}</button><button onClick={nextQuestion} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700">{questionIndex === activeSession.questions.length - 1 ? "View report" : "Next question"} <ArrowRight size={16} /></button></div>}
                    {role === "instructor" && revealed && <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">Correct answer: {currentQuestion.options[currentQuestion.answer]}</p>}
                  </>
                ) : <p className="text-sm text-slate-500">No questions available for this session.</p>}
              </div>
              {role === "instructor" && activeSession.status === "live" && <button onClick={endSession} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50"><Square size={16} /> End session and view report</button>}
            </section>

            <aside className="space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between"><h3 className="font-black text-slate-900">Participants</h3><Badge>{joinedCount} joined</Badge></div>
                <div className="space-y-3">
                  {activeSession.participants.map((participant) => (
                    <div key={participant.id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-black text-indigo-700">{participant.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</div>
                      <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-800">{participant.name}</p><p className="text-xs text-slate-500">{participant.answered} answers submitted</p></div>
                      <Badge tone={participant.joined ? "green" : "slate"}>{participant.joined ? "Joined" : "Away"}</Badge>
                    </div>
                  ))}
                  {!activeSession.participants.length && <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No participants yet. Share the code to invite students.</p>}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3"><div className="rounded-xl bg-violet-50 p-3 text-violet-600"><MessageSquare size={20} /></div><div><h3 className="font-black text-slate-900">Session checklist</h3><p className="text-xs text-slate-500">Quick facilitation guide</p></div></div>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  {["Share the session code", "Explain the learning objective", "Launch a knowledge-check question", "Review responses and weak skills"].map((item) => <li key={item} className="flex items-start gap-2"><CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-500" />{item}</li>)}
                </ul>
              </div>
            </aside>
          </div>
        )}

        {view === "report" && activeSession && (
          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div><Badge tone="indigo">SESSION SUMMARY</Badge><h2 className="mt-3 text-2xl font-black text-slate-900">{activeSession.title}</h2><p className="mt-1 text-sm text-slate-500">Session code: {activeSession.code} · {activeSession.status === "ended" ? "Ended" : "Preview report"}</p></div>
                <button onClick={() => setView("overview")} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">Back to overview</button>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard icon={Users} label="Participants joined" value={joinedCount} />
                <StatCard icon={ClipboardList} label="Questions" value={activeSession.questions.length} />
                <StatCard icon={CheckCircle2} label="Responses recorded" value={activeSession.participants.reduce((n, p) => n + p.answered, 0)} />
                <StatCard icon={BarChart3} label="Average accuracy" value={`${averageScore}%`} />
              </div>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center gap-3"><div className="rounded-xl bg-indigo-50 p-3 text-indigo-600"><Users size={20} /></div><div><h3 className="text-xl font-black text-slate-900">Student performance</h3><p className="text-sm text-slate-500">Review participation and question outcomes.</p></div></div>
              <div className="overflow-x-auto"><table className="w-full min-w-[520px] text-left text-sm"><thead><tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400"><th className="px-3 py-3">Student</th><th className="px-3 py-3">Attendance</th><th className="px-3 py-3">Answered</th><th className="px-3 py-3">Correct</th><th className="px-3 py-3">Accuracy</th></tr></thead><tbody>{activeSession.participants.map((participant) => <tr key={participant.id} className="border-b border-slate-100 last:border-0"><td className="px-3 py-4 font-bold text-slate-800">{participant.name}</td><td className="px-3 py-4"><Badge tone={participant.joined ? "green" : "slate"}>{participant.joined ? "Present" : "Absent"}</Badge></td><td className="px-3 py-4 text-slate-600">{participant.answered}</td><td className="px-3 py-4 text-slate-600">{participant.score}</td><td className="px-3 py-4 font-bold text-slate-800">{participant.answered ? Math.round((participant.score / participant.answered) * 100) : "—"}{participant.answered ? "%" : ""}</td></tr>)}</tbody></table></div>
              <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-4"><div className="flex items-start gap-3"><CircleHelp size={20} className="mt-0.5 shrink-0 text-amber-600" /><div><p className="font-bold text-amber-900">Suggested follow-up</p><p className="mt-1 text-sm leading-6 text-amber-800">Review the skills linked to questions students missed, then assign targeted practice. In the backend-integrated version, recorded responses can be sent to the DKT pipeline for personalized next-exercise recommendations.</p></div></div></div>
            </section>
          </div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
          <form onSubmit={createSession} className="my-8 w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-indigo-500">New classroom</p><h2 className="mt-1 text-2xl font-black text-slate-900">Create a live session</h2><p className="mt-1 text-sm text-slate-500">Set up a session and invite students with a code.</p></div><button type="button" onClick={() => setShowCreate(false)} className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100">✕</button></div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2"><span className="mb-1.5 block text-sm font-bold text-slate-700">Session title *</span><input required value={createForm.title} onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })} placeholder="e.g. Introduction to SQL JOINs" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" /></label>
              <label><span className="mb-1.5 block text-sm font-bold text-slate-700">Subject *</span><input required value={createForm.subject} onChange={(e) => setCreateForm({ ...createForm, subject: e.target.value })} placeholder="Computer Science" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" /></label>
              <label><span className="mb-1.5 block text-sm font-bold text-slate-700">Topic / skill</span><input value={createForm.topic} onChange={(e) => setCreateForm({ ...createForm, topic: e.target.value })} placeholder="e.g. INNER JOIN" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" /></label>
              <label><span className="mb-1.5 block text-sm font-bold text-slate-700">Date</span><input type="date" value={createForm.date} onChange={(e) => setCreateForm({ ...createForm, date: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" /></label>
              <label><span className="mb-1.5 block text-sm font-bold text-slate-700">Start time</span><input type="time" value={createForm.time} onChange={(e) => setCreateForm({ ...createForm, time: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" /></label>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={() => setShowCreate(false)} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button><button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700"><Plus size={17} /> Create session</button></div>
          </form>
        </div>
      )}

      {showJoin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <form onSubmit={joinSession} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-indigo-500">Student access</p><h2 className="mt-1 text-2xl font-black text-slate-900">Join a session</h2><p className="mt-1 text-sm text-slate-500">Enter your name and the code shared by your instructor.</p></div><button type="button" onClick={() => setShowJoin(false)} className="rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100">✕</button></div>
            <label className="mt-6 block"><span className="mb-1.5 block text-sm font-bold text-slate-700">Your name</span><input value={studentName} onChange={(e) => setStudentName(e.target.value)} required placeholder="Enter your name" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" /></label>
            <label className="mt-4 block"><span className="mb-1.5 block text-sm font-bold text-slate-700">Session code</span><input value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} required placeholder="e.g. SQL729" className="w-full rounded-xl border border-slate-200 px-4 py-3 font-black uppercase tracking-widest outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" /></label>
            <p className="mt-2 text-xs text-slate-500">Demo session code: <strong>SQL729</strong></p>
            <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white hover:bg-indigo-700">Join classroom <ArrowRight size={17} /></button>
          </form>
        </div>
      )}
    </div>
  );
}
