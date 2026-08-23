import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  MapPin,
  FileText,
  Code2,
  Trophy,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Lock,
} from "lucide-react";
import {
  getPortfolioData,
  INITIAL_PROJECTS,
  INITIAL_EXPERIENCE,
  INITIAL_CERTIFICATIONS,
  INITIAL_PROFILE,
} from "../lib/portfolio-data";
import type {
  Project,
  ExperienceItem,
  CertificationItem,
  ProfileData,
  SkillCategory,
} from "../types/portfolio";

import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [{ title: "Portfolio of Kashfi" }],
  }),
});

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Kaggle: Trophy,
  LeetCode: Code2,
};

function Index() {
  const [data, setData] = useState({
    projects: INITIAL_PROJECTS,
    experience: INITIAL_EXPERIENCE,
    certifications: INITIAL_CERTIFICATIONS,
    profile: INITIAL_PROFILE,
  });

  useEffect(() => {
    getPortfolioData().then((res) => {
      if (res) {
        setData(res);
      }
    });
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <CursorGlow />
      <Nav resumeUrl={data.profile.resumeUrl} portraitUrl={data.profile.portraitUrl} />
      <main className="relative mx-auto max-w-6xl px-4 sm:px-6 pb-24 sm:pb-32 pt-24 sm:pt-28 md:pt-40">
        <Hero profile={data.profile} />
        <Projects projects={data.projects} />
        <About skills={data.profile.skills} bio={data.profile.bio} />
        <Experience experience={data.experience} />
        <Certifications certifications={data.certifications} />
        <Contact profile={data.profile} />
      </main>
      <Footer socials={data.profile.socials} />
    </div>
  );
}

function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      setVisible(true);
    };
    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget) setVisible(false);
    };
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseout", onLeave);

    let raf = 0;
    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.18;
      pos.current.y += (target.current.y - pos.current.y) * 0.18;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseout", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none fixed left-0 top-0 z-[60] -ml-[300px] -mt-[300px] h-[600px] w-[600px] rounded-full transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        background:
          "radial-gradient(circle, oklch(0.55 0.15 210 / 0.35), oklch(0.55 0.15 210 / 0.1) 30%, transparent 60%)",
        mixBlendMode: "multiply",
        filter: "blur(8px)",
      }}
    />
  );
}

function Nav({ resumeUrl, portraitUrl }: { resumeUrl: string; portraitUrl: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4">
      <nav className="flex w-full max-w-3xl items-center justify-between rounded-full border border-border bg-background/70 px-4 py-2 backdrop-blur-xl shadow-sm">
        <a href="#top" className="flex items-center gap-2.5 text-sm font-medium group">
          <div className="relative shrink-0">
            <div className="absolute -inset-0.5 rounded-full bg-brand/30 blur-[2px] transition-opacity group-hover:opacity-100" />
            <img
              src={portraitUrl}
              alt="Kashfi"
              className="relative size-6.5 rounded-full object-cover ring-1 ring-border shadow-sm"
            />
          </div>
          <span className="tracking-tight font-medium">Kashfi</span>
        </a>
        <div className="hidden items-center gap-1 text-sm text-muted-foreground md:flex">
          {[
            ["Work", "#work"],
            ["About", "#about"],
            ["Experience", "#experience"],
            ["Contact", "#contact"],
          ].map(([l, h]) => (
            <a
              key={h}
              href={h}
              className="rounded-full px-3 py-1.5 transition-colors hover:bg-surface hover:text-foreground"
            >
              {l}
            </a>
          ))}
        </div>
        <a
          href={resumeUrl}
          target="_blank"
          rel="noreferrer"
          download="Kashfi_Resume.pdf"
          className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-medium text-background transition-transform hover:scale-[1.02]"
        >
          Resume <ArrowUpRight className="size-3.5" />
        </a>
      </nav>
    </header>
  );
}

function Hero({ profile }: { profile: ProfileData }) {
  return (
    <section id="top" className="relative pt-8 md:pt-16">
      <div className="animate-fade-up flex items-center gap-3 sm:gap-4">
        <div className="relative shrink-0">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-brand/40 via-brand/10 to-transparent blur-sm" />
          <img
            src={profile.portraitUrl}
            alt={profile.name}
            className="relative size-10 rounded-full object-cover ring-2 ring-background shadow-md sm:size-11 md:size-12"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand/60 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-brand" />
          </span>
          {profile.availability}
        </div>
      </div>
      <h1 className="animate-fade-up mt-6 text-balance text-3xl font-medium leading-[1.08] tracking-tight sm:text-5xl md:text-7xl">
        {profile.name}.
        <br />
        <span className="text-muted-foreground">{profile.tagline}</span>
      </h1>
      <p className="animate-fade-up mt-6 sm:mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        {profile.bio}
      </p>

      <div className="animate-fade-up mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <a
          href="#work"
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.02]"
        >
          View selected work
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
        <a
          href="#contact"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-surface/60 px-5 py-3 text-sm text-foreground backdrop-blur transition-colors hover:bg-surface"
        >
          <Mail className="size-4" />
          Get in touch
        </a>
      </div>

      <div className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <MapPin className="size-4" /> {profile.location}
        </span>
        <span className="hidden h-3 w-px bg-border md:block" />
        <span className="inline-flex items-center gap-2">
          <FileText className="size-4" /> {profile.studentStatus}
        </span>
        <span className="hidden h-3 w-px bg-border md:block" />
        <div className="flex items-center gap-1">
          {profile.socials.map((s) => {
            const Icon = SOCIAL_ICONS[s.label] || Github;
            return (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="grid size-8 place-items-center rounded-full border border-border bg-surface/50 text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground"
              >
                <Icon className="size-4" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="work" className="mt-32 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Selected work
          </p>
          <h2 className="mt-2 text-3xl font-medium tracking-tight md:text-4xl">Projects</h2>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          {projects.length} shipped
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {projects.map((p, i) => (
          <ProjectCard key={p.id || p.title} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}

function VideoPlayer({
  src,
  inView,
  metric,
}: {
  src: string;
  inView: boolean;
  metric?: { label: string; value: string };
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [inView]);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMuted((m) => !m);
  };

  const onSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    v.currentTime = pct * v.duration;
  };

  return (
    <div
      className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-surface-2 ring-1 ring-border"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <video
        ref={videoRef}
        src={inView ? src : undefined}
        muted={muted}
        loop
        playsInline
        autoPlay
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          if (v.duration) setProgress((v.currentTime / v.duration) * 100);
        }}
        onClick={togglePlay}
        className="h-full w-full cursor-pointer object-cover transition-transform duration-700 group-hover:scale-[1.02]"
      />

      {/* center play button when paused */}
      {!playing && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Play"
          className="absolute inset-0 grid place-items-center bg-background/30 backdrop-blur-[2px] transition"
        >
          <span className="grid size-14 place-items-center rounded-full bg-background/80 text-foreground shadow-lg ring-1 ring-border transition-transform hover:scale-105">
            <Play className="size-6 translate-x-0.5" fill="currentColor" />
          </span>
        </button>
      )}

      {metric && (
        <div className="absolute right-3 top-3 rounded-full border border-border bg-background/70 px-2.5 py-1 font-mono text-[11px] backdrop-blur-md">
          <span className="text-muted-foreground">{metric.label} </span>
          <span className="text-brand">{metric.value}</span>
        </div>
      )}

      {/* controls bar */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-1.5 bg-gradient-to-t from-background/80 via-background/40 to-transparent px-3 pb-2 pt-6 transition-opacity duration-200 ${
          hover || !playing ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          onClick={onSeek}
          className="pointer-events-auto group/bar h-1 cursor-pointer rounded-full bg-foreground/20"
        >
          <div
            className="h-full rounded-full bg-brand transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play"}
            className="grid size-7 place-items-center rounded-full text-foreground/90 hover:bg-foreground/10"
          >
            {playing ? (
              <Pause className="size-4" fill="currentColor" />
            ) : (
              <Play className="size-4" fill="currentColor" />
            )}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className="grid size-7 place-items-center rounded-full text-foreground/90 hover:bg-foreground/10"
          >
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.25,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <article
      ref={ref}
      onMouseMove={onMouseMove}
      style={{ animationDelay: `${index * 60}ms` }}
      className={`animate-fade-up group relative overflow-hidden rounded-3xl border border-border bg-[image:var(--gradient-card)] p-2 transition-colors hover:border-brand/30 ${project.span ?? ""}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(400px circle at var(--mx) var(--my), oklch(0.85 0.15 200 / 0.12), transparent 40%)",
        }}
      />

      {project.video && <VideoPlayer src={project.video} inView={inView} metric={project.metric} />}

      <div className="p-4 md:p-5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-lg font-medium tracking-tight">{project.title}</h3>
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {project.date} · {project.tag}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.blurb}</p>
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {project.stack.map((s) => (
            <span
              key={s}
              className="rounded-full border border-border bg-surface/60 px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {s}
            </span>
          ))}
          {project.linkedin && (
            <a
              href={project.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="View on LinkedIn"
              className={`inline-flex items-center gap-1 text-[12px] text-foreground/80 hover:text-brand ${project.link ? "" : "ml-auto"}`}
            >
              <Linkedin className="size-3.5" /> LinkedIn
            </a>
          )}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="ml-auto inline-flex items-center gap-1 text-[12px] text-foreground/80 hover:text-brand"
            >
              Open <ArrowUpRight className="size-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function About({ skills }: { skills: SkillCategory[]; bio: string }) {
  return (
    <section id="about" className="mt-32 scroll-mt-24">
      <SectionHeader eyebrow="About" title="Stack & focus" />
      <div className="grid gap-8 md:grid-cols-5">
        <div className="md:col-span-2">
          <p className="text-lg leading-relaxed text-muted-foreground">
            I care about vision systems that <span className="text-foreground">actually run</span> —
            small, fast, and honest about their limits. I like the loop from data through model to
            deployment, and I keep receipts (metrics, demos, notebooks).
          </p>
        </div>
        <div className="grid gap-3 md:col-span-3 md:grid-cols-2">
          {(skills || []).map((s, idx) => {
            const raw = s as unknown as Record<string, unknown>;
            const label =
              s.label ||
              (typeof raw.category === "string" ? raw.category : "") ||
              (typeof raw.name === "string" ? raw.name : "") ||
              `Skill ${idx + 1}`;
            const items = Array.isArray(s.items)
              ? s.items
              : Array.isArray(raw.skills)
                ? (raw.skills as string[])
                : [];
            return (
              <div
                key={label + idx}
                className="rounded-2xl border border-border bg-[image:var(--gradient-card)] p-5"
              >
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  {label}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-foreground">
                  {items.length ? items.join(" · ") : "—"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Experience({ experience }: { experience: ExperienceItem[] }) {
  return (
    <section id="experience" className="mt-32 scroll-mt-24">
      <SectionHeader eyebrow="Experience" title="Where I've worked" />
      <div className="space-y-3">
        {experience.map((e) => (
          <div
            key={e.id || e.role}
            className="group grid gap-2 rounded-2xl border border-border bg-[image:var(--gradient-card)] p-6 transition-colors hover:border-brand/30 md:grid-cols-[220px_1fr] md:gap-8"
          >
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                {e.period}
              </p>
              <p className="mt-2 text-sm text-foreground">{e.org}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium tracking-tight">{e.role}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Certifications({ certifications }: { certifications: CertificationItem[] }) {
  return (
    <section id="certifications" className="mt-32 scroll-mt-24">
      <SectionHeader eyebrow="Learning" title="Certifications" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((c) => (
          <a
            key={c.id || c.title}
            href={c.href}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface/40 transition-colors hover:border-brand/40 hover:bg-surface"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-surface-2 ring-1 ring-border">
              <img
                src={c.image}
                alt={`${c.title} certificate`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>
            <div className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{c.title}</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  {c.date} · {c.issuer}
                </p>
              </div>
              <span className="grid size-8 shrink-0 place-items-center rounded-full border border-border bg-background text-brand transition-transform group-hover:scale-105">
                <ArrowUpRight className="size-4" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function Contact({ profile }: { profile: ProfileData }) {
  return (
    <section id="contact" className="mt-24 sm:mt-32 scroll-mt-24">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-[image:var(--gradient-card)] p-6 sm:p-10 md:p-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[600px] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl"
        />
        <div className="relative">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Contact
          </p>
          <h2 className="mt-3 max-w-2xl text-balance text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl leading-tight">
            Have a vision problem worth solving?
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            I'm open to CV / ML engineering roles, research collaborations, and freelance work.
            Reach out — I reply within a day.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-xs sm:text-sm font-medium text-background transition-transform hover:scale-[1.02] shadow-sm"
            >
              <Mail className="size-4 shrink-0" />
              <span className="truncate">{profile.email}</span>
            </a>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              download="Kashfi_Resume.pdf"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-border bg-surface/60 px-5 py-3 text-xs sm:text-sm font-medium backdrop-blur transition-colors hover:bg-surface text-foreground"
            >
              <FileText className="size-4 shrink-0" />
              <span>Download resume</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  caption,
}: {
  eyebrow: string;
  title: string;
  caption?: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-medium tracking-tight md:text-4xl">{title}</h2>
      </div>
      {caption && (
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          {caption}
        </span>
      )}
    </div>
  );
}

function Footer({ socials }: { socials: { label: string; href: string }[] }) {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4 text-sm text-muted-foreground">
          <span>
            © {new Date().getFullYear()} Tahmidul Bin Ferdous · Built with care in Chattogram
          </span>
          <span className="hidden sm:inline text-border">·</span>
          <a
            href="/admin"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground/60 transition-colors hover:text-brand"
          >
            <Lock className="size-3" /> Admin Panel
          </a>
        </div>
        <div className="flex items-center gap-1">
          {socials.map((s) => {
            const Icon = SOCIAL_ICONS[s.label] || Github;
            return (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="grid size-9 place-items-center rounded-full border border-border bg-surface/50 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon className="size-4" />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
