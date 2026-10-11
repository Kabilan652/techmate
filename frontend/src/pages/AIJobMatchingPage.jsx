import { useState } from "react";
import {
  BriefcaseBusiness,
  FileText,
  Sparkles,
  Target,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Search,
  RotateCcw,
  GraduationCap,
  Code2,
  Award,
} from "lucide-react";

const SKILL_DATABASE = [
  "javascript",
  "typescript",
  "react",
  "node.js",
  "express",
  "mongodb",
  "mysql",
  "sql",
  "python",
  "java",
  "c++",
  "c",
  "html",
  "css",
  "tailwind css",
  "bootstrap",
  "git",
  "github",
  "rest api",
  "rest apis",
  "api development",
  "docker",
  "kubernetes",
  "aws",
  "azure",
  "devops",
  "linux",
  "jenkins",
  "ci/cd",
  "machine learning",
  "deep learning",
  "artificial intelligence",
  "data analysis",
  "power bi",
  "excel",
  "pandas",
  "numpy",
  "tensorflow",
  "pytorch",
  "scikit-learn",
  "data structures",
  "algorithms",
  "problem solving",
  "oop",
  "object oriented programming",
  "communication",
  "teamwork",
  "agile",
  "spring boot",
  "django",
  "flask",
  "next.js",
  "redux",
  "vite",
  "firebase",
  "supabase",
  "postgresql",
  "redis",
  "figma",
  "ui/ux",
  "testing",
  "jest",
  "postman",
  "graphql",
];

function containsSkill(text, skill) {
  const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const pattern = new RegExp(
    `(^|[^a-z0-9+#.])${escaped}(?=$|[^a-z0-9+#.])`,
    "i"
  );

  return pattern.test(text);
}

function extractSkills(text) {
  const normalizedText = text.toLowerCase();

  return SKILL_DATABASE.filter((skill) =>
    containsSkill(normalizedText, skill)
  );
}

function calculateMatch(resume, jobDescription) {
  const resumeSkills = extractSkills(resume);
  const jobSkills = extractSkills(jobDescription);

  const matchedSkills = jobSkills.filter((skill) =>
    resumeSkills.includes(skill)
  );

  const missingSkills = jobSkills.filter(
    (skill) => !resumeSkills.includes(skill)
  );

  const score =
    jobSkills.length > 0
      ? Math.round((matchedSkills.length / jobSkills.length) * 100)
      : 0;

  return {
    score,
    resumeSkills,
    jobSkills,
    matchedSkills,
    missingSkills,
  };
}

function getMatchLabel(score) {
  if (score >= 80) {
    return {
      label: "Excellent Match",
      description: "Your listed skills align well with this job.",
    };
  }

  if (score >= 60) {
    return {
      label: "Good Match",
      description: "You meet several of the listed skill requirements.",
    };
  }

  if (score >= 40) {
    return {
      label: "Partial Match",
      description: "Developing a few additional skills may help.",
    };
  }

  return {
    label: "Low Skill Match",
    description: "Review the requirements and identify your learning priorities.",
  };
}

export default function AIJobMatchingPage() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function analyzeJob() {
    setError("");
    setResult(null);

    if (!resume.trim() || !jobDescription.trim()) {
      setError("Please provide both your resume and the job description.");
      return;
    }

    if (resume.trim().length < 30) {
      setError("Please provide more resume details for a useful comparison.");
      return;
    }

    if (jobDescription.trim().length < 30) {
      setError("Please provide a more detailed job description.");
      return;
    }

    const analysis = calculateMatch(resume, jobDescription);

    if (analysis.jobSkills.length === 0) {
      setError(
        "We couldn't identify supported skills in this job description. Try including specific technical skills and requirements."
      );
      return;
    }

    setResult({
      ...analysis,
      jobTitle: jobTitle.trim() || "Untitled Position",
      company: company.trim() || "Company not specified",
      analyzedAt: new Date().toLocaleString(),
    });
  }

  function resetAnalysis() {
    setResume("");
    setJobDescription("");
    setJobTitle("");
    setCompany("");
    setResult(null);
    setError("");
  }

  const matchInfo = result ? getMatchLabel(result.score) : null;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1.5 text-sm font-semibold text-indigo-700">
              <Sparkles size={16} />
              Career Intelligence
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              AI Job Matching
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Compare your resume with job requirements, discover skill gaps,
              and identify your next learning priorities.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="rounded-xl bg-indigo-50 p-3">
              <Target className="text-indigo-600" size={25} />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">
                Your career goal
              </p>
              <p className="font-semibold text-slate-900">
                Find your best match
              </p>
            </div>
          </div>
        </header>

        {/* Introduction cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-3 inline-flex rounded-xl bg-blue-50 p-3">
              <FileText className="text-blue-600" size={22} />
            </div>
            <h3 className="font-semibold text-slate-900">Resume Analysis</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Identify the technical skills present in your resume.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-3 inline-flex rounded-xl bg-emerald-50 p-3">
              <Target className="text-emerald-600" size={22} />
            </div>
            <h3 className="font-semibold text-slate-900">Skill Matching</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Compare your skills with the requirements of a job.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-3 inline-flex rounded-xl bg-amber-50 p-3">
              <GraduationCap className="text-amber-600" size={22} />
            </div>
            <h3 className="font-semibold text-slate-900">Learning Priorities</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Discover missing skills you may want to develop.
            </p>
          </div>
        </section>

        {/* Input panels */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Resume */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3">
                <FileText className="text-blue-600" size={23} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Your Resume
                </h2>
                <p className="text-sm text-slate-500">
                  Paste your resume text below.
                </p>
              </div>
            </div>

            <textarea
              value={resume}
              onChange={(event) => setResume(event.target.value)}
              placeholder={`Example:

Computer Science student

Technical Skills:
Java, Python, SQL, React, Node.js, Git

Projects:
Developed a web application using React and Node.js.
Created REST APIs and integrated a MySQL database.

Experience:
Full Stack Development Intern`}
              className="min-h-72 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
            />

            <div className="mt-3 flex justify-between text-xs text-slate-400">
              <span>Include your skills, projects, and experience.</span>
              <span>{resume.length} characters</span>
            </div>
          </div>

          {/* Job description */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-purple-50 p-3">
                <BriefcaseBusiness className="text-purple-600" size={23} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Job Details
                </h2>
                <p className="text-sm text-slate-500">
                  Enter the position and its requirements.
                </p>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Job Title
                </label>

                <input
                  value={jobTitle}
                  onChange={(event) => setJobTitle(event.target.value)}
                  placeholder="e.g. Junior Java Developer"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Company
                </label>

                <input
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  placeholder="e.g. Example Technologies"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />
              </div>
            </div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Job Description
            </label>

            <textarea
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder={`Example:

We are looking for a Junior Software Developer.

Requirements:
- Strong knowledge of Java and object-oriented programming.
- Experience with SQL and databases.
- Knowledge of REST APIs.
- Familiarity with Git and GitHub.
- Understanding of data structures and algorithms.
- Good problem-solving skills.`}
              className="min-h-56 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
            />

            <p className="mt-3 text-xs text-slate-400">
              Paste the requirements from the job posting you want to analyze.
            </p>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 shrink-0" size={19} />
            <p>{error}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={analyzeJob}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 active:scale-[0.99]"
          >
            <Sparkles size={20} />
            Analyze Job Match
          </button>

          <button
            onClick={resetAnalysis}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-4 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <RotateCcw size={18} />
            Reset
          </button>
        </div>

        {/* Results */}
        {result && (
          <section className="space-y-6" aria-live="polite">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Job Match Results
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Analysis completed: {result.analyzedAt}
                </p>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
                <BriefcaseBusiness size={16} />
                {result.jobTitle}
              </span>
            </div>

            {/* Score */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white shadow-lg lg:col-span-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-100">
                    Skill Match Score
                  </p>
                  <Target size={22} />
                </div>

                <div className="mt-6 flex items-end gap-2">
                  <span className="text-6xl font-bold tracking-tight">
                    {result.score}
                  </span>
                  <span className="mb-2 text-2xl text-indigo-100">%</span>
                </div>

                <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-700"
                    style={{ width: `${result.score}%` }}
                  />
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  {matchInfo.label}
                </h3>

                <p className="mt-2 text-sm leading-6 text-indigo-100">
                  {matchInfo.description}
                </p>

                <p className="mt-5 text-xs text-indigo-200">
                  This score reflects matched listed skills only, not your
                  overall suitability or likelihood of being hired.
                </p>
              </div>

              {/* Matched */}
              <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-50 p-3">
                    <CheckCircle2 className="text-emerald-600" size={23} />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Matched Skills</p>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {result.matchedSkills.length}
                    </h3>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {result.matchedSkills.length > 0 ? (
                    result.matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium capitalize text-emerald-700"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      No matching skills found.
                    </p>
                  )}
                </div>
              </div>

              {/* Missing */}
              <div className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-amber-50 p-3">
                    <AlertCircle className="text-amber-600" size={23} />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Skills to Develop
                    </p>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {result.missingSkills.length}
                    </h3>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {result.missingSkills.length > 0 ? (
                    result.missingSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium capitalize text-amber-800"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-emerald-600">
                      All detected job skills appear in your resume.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-violet-50 p-3">
                  <TrendingUp className="text-violet-600" size={23} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Recommended Next Steps
                  </h3>
                  <p className="text-sm text-slate-500">
                    Suggested actions based on the detected skill gaps.
                  </p>
                </div>
              </div>

              {result.missingSkills.length > 0 ? (
                <div className="space-y-3">
                  {result.missingSkills.slice(0, 5).map((skill, index) => (
                    <div
                      key={skill}
                      className="flex items-start gap-3 rounded-xl bg-slate-50 p-4"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-sm font-bold text-indigo-700">
                        {index + 1}
                      </div>

                      <div>
                        <h4 className="font-semibold capitalize text-slate-900">
                          Learn {skill}
                        </h4>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          Review this skill in the job requirements. If you
                          have relevant experience, make sure your resume
                          describes it accurately.
                        </p>
                      </div>
                    </div>
                  ))}

                  {result.missingSkills.length > 5 && (
                    <p className="text-sm text-slate-500">
                      And {result.missingSkills.length - 5} more detected
                      skill gaps.
                    </p>
                  )}
                </div>
              ) : (
                <div className="rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
                  No missing skills were detected from the supported skill
                  list. Review the full job requirements to confirm that your
                  resume covers the position's other qualifications.
                </div>
              )}

              <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                <div className="flex items-start gap-3">
                  <Code2 className="mt-0.5 shrink-0 text-indigo-600" size={21} />
                  <div>
                    <h4 className="font-semibold text-indigo-900">
                      Improve your resume
                    </h4>
                    <p className="mt-1 text-sm leading-6 text-indigo-800">
                      Highlight relevant projects, technical skills, and
                      measurable achievements. Include a skill only when it
                      accurately reflects your experience.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-400">
                <Award className="mr-1 inline" size={14} />
                Skills are detected using a predefined vocabulary. Synonyms,
                proficiency, experience level, qualifications, and context
                are not fully evaluated. Use this result as a preliminary
                comparison, not a hiring prediction.
              </div>
            </div>

            {/* Analysis summary */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex items-center gap-3">
                <Search className="text-indigo-600" size={22} />
                <h3 className="text-lg font-bold text-slate-900">
                  Analysis Summary
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <SummaryItem
                  label="Job Skills Found"
                  value={result.jobSkills.length}
                />

                <SummaryItem
                  label="Resume Skills Found"
                  value={result.resumeSkills.length}
                />

                <SummaryItem
                  label="Skills Matched"
                  value={result.matchedSkills.length}
                />

                <SummaryItem
                  label="Skills Missing"
                  value={result.missingSkills.length}
                />
              </div>

              <p className="mt-5 text-sm text-slate-500">
                Company:{" "}
                <span className="font-medium text-slate-800">
                  {result.company}
                </span>
              </p>
            </div>
          </section>
        )}

        {/* Empty state */}
        {!result && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center sm:py-14">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
              <Sparkles className="text-indigo-600" size={30} />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Discover your job match
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
              Enter your resume and a job description above. Your skill
              comparison and recommendations will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs leading-5 text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
