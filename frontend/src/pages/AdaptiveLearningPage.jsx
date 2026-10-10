import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Gauge,
  Lightbulb,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';

const skillMatrix = [
  {
    id: 'javascript',
    name: 'JavaScript Fundamentals',
    mastery: 82,
    trend: '+8%',
    nextFocus: 'Async patterns',
    gap: 'Low',
    sessions: 5,
  },
  {
    id: 'react',
    name: 'React Components',
    mastery: 71,
    trend: '+12%',
    nextFocus: 'Hooks & state flow',
    gap: 'Medium',
    sessions: 3,
  },
  {
    id: 'api',
    name: 'API Integration',
    mastery: 64,
    trend: '+6%',
    nextFocus: 'Error handling',
    gap: 'Medium',
    sessions: 4,
  },
  {
    id: 'system-design',
    name: 'System Design',
    mastery: 48,
    trend: '+4%',
    nextFocus: 'Trade-offs & scaling',
    gap: 'High',
    sessions: 2,
  },
];

const practicePlan = [
  {
    title: 'Warm-up challenge',
    description: 'Review closures and event loops through a 10-minute micro-quiz.',
    duration: '10 min',
    difficulty: 'Easy',
  },
  {
    title: 'Concept drill',
    description: 'Practice conditional rendering and hook dependencies with guided examples.',
    duration: '15 min',
    difficulty: 'Moderate',
  },
  {
    title: 'Applied task',
    description: 'Build a small API fetch flow and debug a failed state pattern.',
    duration: '25 min',
    difficulty: 'Challenge',
  },
];

const sessionInsights = [
  { label: 'Next best exercise', value: 'React state transitions' },
  { label: 'Recommended pace', value: '2 lessons / session' },
  { label: 'Confidence score', value: '78%' },
  { label: 'Streak health', value: 'Strong' },
];

const AdaptiveLearningPage = () => {
  const [selectedSkill, setSelectedSkill] = useState(skillMatrix[0].id);

  const currentSkill = useMemo(
    () => skillMatrix.find((skill) => skill.id === selectedSkill) ?? skillMatrix[0],
    [selectedSkill]
  );

  const averageMastery = Math.round(
    skillMatrix.reduce((sum, item) => sum + item.mastery, 0) / skillMatrix.length
  );

  return (
    <div className="h-full overflow-y-auto bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8 pb-12">
        <header className="rounded-[2rem] border border-indigo-100 bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 p-6 text-white shadow-lg shadow-indigo-200/50 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-indigo-100">
                <BrainCircuit size={14} />
                DKT Adaptive Learning
              </div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Your learning path is adapting.</h1>
              <p className="mt-3 max-w-2xl text-sm text-indigo-100 sm:text-base">
                TechMate is prioritising the concepts most likely to improve your next performance based on recent mastery and quiz trends.
              </p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-indigo-100">Overall mastery</p>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-3xl font-black">{averageMastery}%</span>
                <TrendingUp className="text-emerald-300" size={20} />
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <section className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Skill focus</p>
                <h2 className="mt-2 text-2xl font-black text-gray-900">Adaptive recommendations</h2>
              </div>
              <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700">
                Generate next task
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {skillMatrix.map((skill) => {
                const isSelected = skill.id === currentSkill.id;
                return (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => setSelectedSkill(skill.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition-all ${
                      isSelected
                        ? 'border-indigo-200 bg-indigo-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-indigo-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-base font-bold text-gray-900">{skill.name}</p>
                        <p className="mt-1 text-sm text-gray-500">{skill.nextFocus}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="min-w-[110px]">
                          <div className="mb-1 flex items-center justify-between text-xs font-bold text-gray-500">
                            <span>Mastery</span>
                            <span>{skill.mastery}%</span>
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                              style={{ width: `${skill.mastery}%` }}
                            />
                          </div>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                          {skill.trend}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-amber-100 p-3 text-amber-600">
                  <Gauge size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Current signal</p>
                  <h3 className="text-xl font-black text-gray-900">{currentSkill.name}</h3>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm font-bold text-gray-600">
                    <span>Mastery confidence</span>
                    <span>{currentSkill.mastery}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                      style={{ width: `${currentSkill.mastery}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Why this is next</p>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    Your recent quiz results indicate a strong pattern of improvement, but the model recommends a focused review of <span className="font-bold text-slate-900">{currentSkill.nextFocus}</span> before moving to a harder challenge.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600">
                  <Lightbulb size={22} />
                </div>
                <p className="text-lg font-black text-gray-900">Session insights</p>
              </div>

              <div className="mt-5 space-y-3">
                {sessionInsights.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                    <span className="text-sm text-gray-500">{item.label}</span>
                    <span className="text-sm font-bold text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600">
                <Target size={22} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Practice plan</p>
                <h3 className="text-xl font-black text-gray-900">Recommended sequence</h3>
              </div>
            </div>

            <div className="space-y-4">
              {practicePlan.map((item, index) => (
                <div key={item.title} className="rounded-2xl border border-gray-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-black text-indigo-700">
                        0{index + 1}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-gray-900">{item.title}</h4>
                        <p className="mt-1 text-sm leading-6 text-gray-600">{item.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                      <Clock3 size={16} />
                      {item.duration}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
                      {item.difficulty}
                    </span>
                    <button className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-bold text-indigo-700 ring-1 ring-indigo-200 transition hover:bg-indigo-50">
                      Start now
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-violet-100 p-3 text-violet-600">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Momentum</p>
                <h3 className="text-xl font-black text-gray-900">What’s working</h3>
              </div>
            </div>

            <div className="space-y-4">
              {[
                'You complete concept checks faster than this week’s baseline.',
                'Your strongest gains are happening in guided practice sessions.',
                'Reviewing one weak concept before each quiz improves retention.',
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-2xl bg-slate-50 p-3">
                  <div className="mt-0.5 rounded-full bg-emerald-100 p-1 text-emerald-600">
                    <CheckCircle2 size={14} />
                  </div>
                  <p className="text-sm leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-4 ring-1 ring-indigo-100">
              <div className="flex items-center gap-2 text-indigo-700">
                <Sparkles size={18} />
                <span className="text-sm font-bold uppercase tracking-[0.16em]">Focus note</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                Prioritise one “high-gap” skill per session. This keeps your learning curve smooth and reduces knowledge decay between practice blocks.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdaptiveLearningPage;
