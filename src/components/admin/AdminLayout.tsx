import { useState, useEffect } from "react";
import {
  FolderGit2,
  User,
  Briefcase,
  Award,
  Database,
  ArrowLeft,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { isSupabaseConfigured, getSupabase } from "../../lib/supabase";
import {
  getPortfolioData,
  INITIAL_PROJECTS,
  INITIAL_EXPERIENCE,
  INITIAL_CERTIFICATIONS,
  INITIAL_PROFILE,
} from "../../lib/portfolio-data";
import type {
  Project,
  ExperienceItem,
  CertificationItem,
  ProfileData,
} from "../../types/portfolio";

import { ProjectsManager } from "./ProjectsManager";
import { ResumeProfileManager } from "./ResumeProfileManager";
import { ExperienceManager } from "./ExperienceManager";
import { CertificationsManager } from "./CertificationsManager";

type Tab = "projects" | "profile" | "experience" | "certs" | "setup";

export function AdminLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const [loading, setLoading] = useState(true);

  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [experience, setExperience] = useState<ExperienceItem[]>(INITIAL_EXPERIENCE);
  const [certifications, setCertifications] = useState<CertificationItem[]>(INITIAL_CERTIFICATIONS);
  const [profile, setProfile] = useState<ProfileData>(INITIAL_PROFILE);

  const supabaseConnected = isSupabaseConfigured();

  // Check auth session
  useEffect(() => {
    const savedPin = sessionStorage.getItem("admin_session_auth");
    if (savedPin === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getPortfolioData();
      setProjects(data.projects);
      setExperience(data.experience);
      setCertifications(data.certifications);
      setProfile(data.profile);
    } catch (err) {
      console.error("Failed to load portfolio data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const envPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    const validPins = envPassword
      ? [envPassword.trim()]
      : ["admin123", "kashfi2026", "admin"];

    if (validPins.includes(passwordInput.trim())) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_session_auth", "true");
      setAuthError("");
    } else {
      setAuthError("Incorrect passcode. Access denied.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_session_auth");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-3xl border border-border bg-[image:var(--gradient-card)] p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/30">
              <Lock className="size-6" />
            </div>
            <h1 className="text-2xl font-medium tracking-tight text-foreground">
              Portfolio Admin Panel
            </h1>
            <p className="text-xs text-muted-foreground">
              Enter your passcode to manage projects, videos, resume, and credentials.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Admin Passcode
              </label>
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter passcode..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
              />
            </div>

            {authError && <p className="text-xs text-destructive">{authError}</p>}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-2.5 text-sm font-medium text-background transition-transform hover:scale-[1.02]"
            >
              <Unlock className="size-4" /> Unlock Admin Panel
            </button>
          </form>

          <div className="border-t border-border/50 pt-4 text-center">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" /> Back to public portfolio
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" /> View Portfolio
            </a>
            <span className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="grid size-2 place-items-center rounded-full bg-brand" />
              <span>Admin Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-[11px] sm:flex">
              {supabaseConnected ? (
                <>
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <span className="text-emerald-400">Supabase Cloud Connected</span>
                </>
              ) : (
                <>
                  <span className="size-2 rounded-full bg-amber-500" />
                  <span className="text-muted-foreground">Local / Staging Mode</span>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground hover:border-destructive hover:text-destructive"
            >
              Lock Panel
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-border pb-4">
          <button
            type="button"
            onClick={() => setActiveTab("projects")}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === "projects"
                ? "bg-foreground text-background"
                : "border border-border bg-surface/40 text-muted-foreground hover:bg-surface hover:text-foreground"
            }`}
          >
            <FolderGit2 className="size-4" />
            Projects ({projects.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === "profile"
                ? "bg-foreground text-background"
                : "border border-border bg-surface/40 text-muted-foreground hover:bg-surface hover:text-foreground"
            }`}
          >
            <User className="size-4" />
            Resume & Profile
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("experience")}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === "experience"
                ? "bg-foreground text-background"
                : "border border-border bg-surface/40 text-muted-foreground hover:bg-surface hover:text-foreground"
            }`}
          >
            <Briefcase className="size-4" />
            Experience ({experience.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("certs")}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === "certs"
                ? "bg-foreground text-background"
                : "border border-border bg-surface/40 text-muted-foreground hover:bg-surface hover:text-foreground"
            }`}
          >
            <Award className="size-4" />
            Certifications ({certifications.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("setup")}
            className={`ml-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === "setup"
                ? "bg-brand text-brand-foreground"
                : "border border-border bg-surface/40 text-muted-foreground hover:bg-surface hover:text-foreground"
            }`}
          >
            <Database className="size-4" />
            Vercel & Supabase Setup
          </button>
        </div>

        {/* Tab Views */}
        {loading ? (
          <div className="py-20 text-center text-sm text-muted-foreground">
            Loading portfolio data...
          </div>
        ) : (
          <>
            {activeTab === "projects" && (
              <ProjectsManager projects={projects} onRefresh={loadData} />
            )}
            {activeTab === "profile" && (
              <ResumeProfileManager profile={profile} onRefresh={loadData} />
            )}
            {activeTab === "experience" && (
              <ExperienceManager experience={experience} onRefresh={loadData} />
            )}
            {activeTab === "certs" && (
              <CertificationsManager certifications={certifications} onRefresh={loadData} />
            )}
            {activeTab === "setup" && <CloudSetupGuide />}
          </>
        )}
      </main>
    </div>
  );
}

function CloudSetupGuide() {
  const [copied, setCopied] = useState(false);

  const copyEnvSnippet = () => {
    const snippet = `VITE_SUPABASE_URL=https://your-project.supabase.co\nVITE_SUPABASE_ANON_KEY=your-anon-key-here`;
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-medium tracking-tight">
          Vercel & Supabase Cloud Storage Setup
        </h2>
        <p className="text-sm text-muted-foreground">
          Follow these 3 quick steps to enable persistent video, resume, and database sync on
          Vercel.
        </p>
      </div>

      <div className="space-y-4">
        {/* Step 1 */}
        <div className="rounded-2xl border border-border bg-[image:var(--gradient-card)] p-6 space-y-3">
          <div className="flex items-center gap-2 font-medium text-sm">
            <span className="grid size-6 place-items-center rounded-full bg-brand/20 text-brand text-xs">
              1
            </span>
            <span>Create a free Supabase Project</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Go to{" "}
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noreferrer"
              className="text-brand hover:underline inline-flex items-center gap-1"
            >
              supabase.com <ExternalLink className="size-3" />
            </a>{" "}
            and create a new free project (e.g. `portfolio`).
          </p>
        </div>

        {/* Step 2 */}
        <div className="rounded-2xl border border-border bg-[image:var(--gradient-card)] p-6 space-y-3">
          <div className="flex items-center gap-2 font-medium text-sm">
            <span className="grid size-6 place-items-center rounded-full bg-brand/20 text-brand text-xs">
              2
            </span>
            <span>Run SQL Schema (Creates Tables & Storage Bucket)</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Open the <strong>SQL Editor</strong> tab in Supabase dashboard, copy and paste the
            contents of{" "}
            <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] text-brand">
              supabase-schema.sql
            </code>{" "}
            included in your repo, and click <strong>Run</strong>.
          </p>
        </div>

        {/* Step 3 */}
        <div className="rounded-2xl border border-border bg-[image:var(--gradient-card)] p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium text-sm">
              <span className="grid size-6 place-items-center rounded-full bg-brand/20 text-brand text-xs">
                3
              </span>
              <span>Add Environment Variables in Vercel</span>
            </div>
            <button
              type="button"
              onClick={copyEnvSnippet}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <Copy className="size-3" />
              {copied ? "Copied!" : "Copy Variables"}
            </button>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            In Vercel → <strong>Project Settings → Environment Variables</strong>, add:
          </p>
          <pre className="rounded-xl border border-border bg-surface-2 p-3 font-mono text-xs text-foreground">
            VITE_SUPABASE_URL=https://your-project.supabase.co{"\n"}
            VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
          </pre>
        </div>
      </div>
    </div>
  );
}
