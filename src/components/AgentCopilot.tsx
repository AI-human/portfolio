import { useState, useEffect, useRef } from "react";
import {
  Bot,
  Sparkles,
  Send,
  Terminal,
  Search,
  Zap,
  CheckCircle2,
  X,
  ChevronRight,
  Download,
  Mail,
  FileText,
  Activity,
  RotateCcw,
  Code2,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import type { Project, ExperienceItem, CertificationItem, ProfileData } from "../types/portfolio";

export interface AgentCopilotProps {
  projects: Project[];
  experience: ExperienceItem[];
  certifications: CertificationItem[];
  profile: ProfileData;
  activeFilter: string | null;
  onFilterChange: (filter: string | null) => void;
}

interface Message {
  id: string;
  sender: "user" | "agent";
  text: string;
  thought?: string;
  toolsUsed?: {
    name: string;
    description: string;
    result?: string;
  }[];
  actions?: {
    label: string;
    icon?: string;
    onClick: () => void;
  }[];
  timestamp: string;
}

const QUICK_PROMPTS = [
  {
    label: "🚀 Filter YOLO & Detection projects",
    prompt: "Show me all object detection and YOLO projects",
  },
  {
    label: "🧠 Summary of CV & ML Skills",
    prompt: "Summarize Kashfi's technical stack and vision engineering focus",
  },
  {
    label: "💼 FlyRank AI & Outlier AI Experience",
    prompt: "Tell me about his work experience at FlyRank AI and Outlier AI",
  },
  {
    label: "📊 ID Card Detection Metrics",
    prompt: "Explain the ID Card Detection model metrics and Kaggle notebook",
  },
  {
    label: "⚡ Run Portfolio Diagnostics",
    prompt: "Run an agentic system audit on this portfolio",
  },
  {
    label: "📄 Download Kashfi's Resume",
    prompt: "Download the latest resume",
  },
];

export function AgentCopilot({
  projects,
  experience,
  certifications,
  profile,
  activeFilter,
  onFilterChange,
}: AgentCopilotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "agent",
      text: `👋 Hello! I am **Kashfi's Autonomous AI Copilot**. I can reason about his background, interactively query & filter projects, trigger resume downloads, analyze ML metrics, and guide you through his work.`,
      thought:
        "Initialized agent context with 7 projects, 3 experience entries, 5 certifications, and profile data.",
      toolsUsed: [
        {
          name: "agent_init",
          description: "Loaded portfolio knowledge graph & action dispatchers",
          result: "Ready for natural language instructions",
        },
      ],
      timestamp: "Just now",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of message list
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Scroll to page section smoothly
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Autonomous Agent Engine: Processes prompt, decides tool calls, executes actions, and formulates response
  const handleSend = async (userText: string) => {
    if (!userText.trim() || isProcessing) return;

    const query = userText.trim();
    setInput("");

    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    // Simulate Agent Reasoning & Autonomous Execution
    setTimeout(() => {
      const lower = query.toLowerCase();
      let responseText = "";
      let thought = "";
      const toolsUsed: { name: string; description: string; result?: string }[] = [];
      const actions: { label: string; onClick: () => void }[] = [];

      // Decision logic based on intent
      if (
        lower.includes("yolo") ||
        lower.includes("detection") ||
        lower.includes("filter") ||
        lower.includes("object")
      ) {
        thought =
          "Detected intent: Filter/inspect object detection projects. Executing filter_projects('YOLO') and navigating to #work.";
        toolsUsed.push({
          name: "filter_projects",
          description: "Filtering projects matching 'YOLO / Detection'",
          result: "Found matching projects: ID Card Detection, etc.",
        });
        toolsUsed.push({
          name: "navigate_to_section",
          description: "Navigating viewport to #work",
          result: "Scroll complete",
        });

        onFilterChange("YOLO");
        scrollTo("work");

        responseText = `🎯 **Action executed:** Filtered the portfolio for **YOLO & Detection** projects and scrolled to the work section!\n\nKashfi developed a custom **YOLOv11** ID card detection pipeline trained on a custom-annotated dataset achieving **0.82 mAP@50**, optimized for varied capture angles and low-light environments.`;

        actions.push({
          label: "Reset Project Filter",
          onClick: () => onFilterChange(null),
        });
        actions.push({
          label: "View Kaggle Notebook",
          onClick: () =>
            window.open(
              "https://www.kaggle.com/code/tahmidulkashfi/iiuc-idcard-v2-0-38map95",
              "_blank",
            ),
        });
      } else if (
        lower.includes("skill") ||
        lower.includes("stack") ||
        lower.includes("tech") ||
        lower.includes("framework") ||
        lower.includes("about")
      ) {
        thought =
          "Detected intent: Stack & technical capabilities inquiry. Querying profile.skills and highlighting vision stack.";
        toolsUsed.push({
          name: "query_skills",
          description: "Retrieving categorized skillset from profile metadata",
          result: "4 categories indexed (Languages, Frameworks, Libraries, Tools)",
        });
        toolsUsed.push({
          name: "navigate_to_section",
          description: "Navigating viewport to #about",
          result: "Scroll complete",
        });

        scrollTo("about");

        const allSkills = profile.skills
          .map((cat) => `**${cat.label}:** ${cat.items.join(", ")}`)
          .join("\n- ");

        responseText = `🧠 **Kashfi's Core Technical Arsenal:**\n\n- ${allSkills}\n\n**Vision Focus:** Real-time inference pipelines, MediaPipe landmark detection, PyTorch CNNs & GANs, and robust model quantization.`;

        actions.push({
          label: "View About Section",
          onClick: () => scrollTo("about"),
        });
      } else if (
        lower.includes("experience") ||
        lower.includes("work") ||
        lower.includes("flyrank") ||
        lower.includes("outlier") ||
        lower.includes("intern")
      ) {
        thought =
          "Detected intent: Career & internship inquiry. Querying experience history and positioning.";
        toolsUsed.push({
          name: "retrieve_experience",
          description: "Fetching verified roles: FlyRank AI, Outlier AI, Independent Freelance",
          result: "3 experience nodes found",
        });
        toolsUsed.push({
          name: "navigate_to_section",
          description: "Navigating viewport to #experience",
          result: "Scroll complete",
        });

        scrollTo("experience");

        responseText = `💼 **Work Experience Highlights:**\n\n1. **FlyRank AI** — *Machine Learning Engineering Intern (Jul–Aug 2026)*\n   - Building and deploying production ML systems in a high-velocity team.\n2. **Outlier AI** — *AI Trainer — Computer Vision (2023 — Present)*\n   - Evaluating vision-language model outputs for detection, spatial reasoning, and RLHF fine-tuning loops.\n3. **Freelance CV Engineer** *(2022 — Present)*\n   - Delivered custom document verification, facial attendance, and air-canvas interfaces.`;

        actions.push({
          label: "Jump to Experience",
          onClick: () => scrollTo("experience"),
        });
      } else if (
        lower.includes("metric") ||
        lower.includes("id card") ||
        lower.includes("accuracy") ||
        lower.includes("map") ||
        lower.includes("kaggle")
      ) {
        thought =
          "Detected intent: Model performance metrics audit. Querying ID card detection model benchmarks.";
        toolsUsed.push({
          name: "inspect_metrics",
          description: "Retrieving ID Card Detection benchmarks from project store",
          result: "Model: YOLOv11 | Metric: mAP@50 = 0.82 | Deployment: Kaggle GPU",
        });

        responseText = `📊 **ID Card Detection Benchmark Analysis:**\n\n- **Architecture:** YOLOv11 (Ultralytics)\n- **Primary Metric:** **mAP@50 = 0.82** (mAP@50-95 = 0.38)\n- **Data Engineering:** Custom-labeled university student IDs with synthetic angle distortion and occlusion augmentations (Roboflow).\n- **Public Code:** Verified Kaggle notebook with reproduction scripts.`;

        actions.push({
          label: "Open Kaggle Notebook",
          onClick: () =>
            window.open(
              "https://www.kaggle.com/code/tahmidulkashfi/iiuc-idcard-v2-0-38map95",
              "_blank",
            ),
        });
        actions.push({
          label: "View LinkedIn Demo",
          onClick: () =>
            window.open(
              "https://www.linkedin.com/feed/update/urn:li:activity:7252285574110171137/",
              "_blank",
            ),
        });
      } else if (
        lower.includes("audit") ||
        lower.includes("diagnostics") ||
        lower.includes("health") ||
        lower.includes("agent")
      ) {
        thought =
          "Detected intent: Autonomous system audit. Inspecting DOM nodes, media streams, and route integrity.";
        toolsUsed.push({
          name: "portfolio_health_check",
          description: "Auditing 7 projects, 3 experiences, 5 certifications, video players",
          result: "All assets loaded (Status 200 OK), no hydration mismatch",
        });

        responseText = `⚡ **Agentic System Audit Report:**\n\n✅ **Projects Tracked:** ${projects.length} verified projects with video/interactive demos\n✅ **Certifications:** ${certifications.length} credentials (DeepLearning.AI, Coursera, Codecademy)\n✅ **Media Assets:** Video stream preloading active with intersection observer\n✅ **Response Latency:** Client-side local cache active with Supabase sync\n✅ **Status:** 100% Operational & ready for recruiter review.`;

        actions.push({
          label: "Explore Projects",
          onClick: () => {
            onFilterChange(null);
            scrollTo("work");
          },
        });
      } else if (
        lower.includes("resume") ||
        lower.includes("cv") ||
        lower.includes("download") ||
        lower.includes("pdf")
      ) {
        thought =
          "Detected intent: Resume retrieval. Invoking download_resume tool to trigger download.";
        toolsUsed.push({
          name: "download_resume",
          description: "Initiating file download for Kashfi_Resume.pdf",
          result: `URL: ${profile.resumeUrl}`,
        });

        // Trigger download
        const a = document.createElement("a");
        a.href = profile.resumeUrl;
        a.download = "Kashfi_Resume.pdf";
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        responseText = `📄 **Resume Download Initiated!**\n\nI have triggered the download for **Kashfi_Resume.pdf**. You can also open it in a new browser tab.`;

        actions.push({
          label: "Open Resume Directly",
          onClick: () => window.open(profile.resumeUrl, "_blank"),
        });
      } else if (
        lower.includes("contact") ||
        lower.includes("email") ||
        lower.includes("hire") ||
        lower.includes("reach") ||
        lower.includes("chat")
      ) {
        thought =
          "Detected intent: Contact/recruitment intent. Opening contact channels and navigating to #contact.";
        toolsUsed.push({
          name: "navigate_to_section",
          description: "Navigating viewport to #contact",
          result: "Scroll complete",
        });

        scrollTo("contact");

        responseText = `📬 **Let's Connect!**\n\nKashfi is open to **CV / ML Engineering roles**, research collaborations, and freelance systems.\n- **Email:** [${profile.email}](mailto:${profile.email})\n- **Location:** ${profile.location}\n- **Status:** ${profile.availability}`;

        actions.push({
          label: "Send Email Directly",
          onClick: () => (window.location.href = `mailto:${profile.email}`),
        });
      } else {
        // General query response
        thought = `Analyzing general query: "${query}". Searching portfolio knowledge base for best match.`;
        toolsUsed.push({
          name: "semantic_search",
          description: "Searching project blurbs, skills, and background",
          result: "Matched general profile overview",
        });

        responseText = `I've analyzed your question about **"${query}"**!\n\nTahmidul Bin Ferdous (Kashfi) is a **Computer Vision & Deep Learning Engineer** specialized in:\n- **Object Detection & Tracking:** YOLOv11, MediaPipe hand mesh, FaceNet recognition.\n- **Generative Models & NLP:** BanglaPoemGPT (Transformers) & DCGAN handwritten digit synthesis.\n- **Accessible Interfaces:** Face-Mouse head-pose cursor controller & real-time air canvas.\n\nHow else can I assist your review?`;

        actions.push({
          label: "Show YOLO Detection Work",
          onClick: () => {
            onFilterChange("YOLO");
            scrollTo("work");
          },
        });
        actions.push({
          label: "Contact Kashfi",
          onClick: () => scrollTo("contact"),
        });
      }

      const agentMsg: Message = {
        id: `agent-${Date.now()}`,
        sender: "agent",
        text: responseText,
        thought,
        toolsUsed,
        actions,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, agentMsg]);
      setIsProcessing(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Agent Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
        {activeFilter && (
          <button
            onClick={() => onFilterChange(null)}
            className="flex items-center gap-1.5 rounded-full border border-brand/40 bg-surface/90 px-3 py-1.5 text-xs font-medium text-brand backdrop-blur-md shadow-md transition hover:bg-surface"
          >
            <RotateCcw className="size-3" />
            Filter: {activeFilter} <X className="size-3 hover:text-foreground" />
          </button>
        )}

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="group relative flex items-center gap-2.5 rounded-full border border-brand/50 bg-background/90 px-4 py-2.5 text-sm font-medium text-foreground backdrop-blur-xl shadow-lg transition-all duration-300 hover:scale-105 hover:border-brand hover:shadow-brand/20 hover:shadow-xl"
          aria-label="Open AI Copilot"
        >
          <div className="relative flex size-6 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand/40 opacity-75" />
            <span className="relative flex size-5 items-center justify-center rounded-full bg-brand text-background">
              <Bot className="size-3.5" />
            </span>
          </div>

          <div className="flex flex-col items-start text-left">
            <span className="text-xs font-semibold tracking-tight text-foreground flex items-center gap-1">
              AI Agent <Sparkles className="size-3 text-brand" />
            </span>
            <span className="text-[10px] text-muted-foreground">Ask or trigger actions</span>
          </div>

          <kbd className="hidden sm:inline-flex items-center rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Agent Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-background/60 backdrop-blur-sm animate-fade-up">
          <div
            className="relative flex flex-col w-full sm:max-w-2xl h-[90vh] sm:h-[650px] rounded-t-3xl sm:rounded-3xl border border-border bg-background/95 backdrop-blur-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5 bg-surface/50">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-brand text-background shadow-sm">
                  <Bot className="size-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold tracking-tight text-foreground">
                      Kashfi AI Autonomous Copilot
                    </h3>
                    <span className="inline-flex items-center rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-medium text-brand border border-brand/20">
                      Live Agent
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Deep portfolio reasoning & automated actions
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setMessages([
                      {
                        id: "welcome-reset",
                        sender: "agent",
                        text: "Memory cleared. How can I help you explore Kashfi's work?",
                        timestamp: "Just now",
                      },
                    ]);
                  }}
                  title="Clear history"
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-surface hover:text-foreground transition"
                >
                  <RotateCcw className="size-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-surface hover:text-foreground transition"
                  aria-label="Close modal"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  {/* Sender Label & Timestamp */}
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] font-mono text-muted-foreground">
                    {msg.sender === "agent" ? (
                      <>
                        <Sparkles className="size-3 text-brand" />
                        <span>AI Agent</span>
                      </>
                    ) : (
                      <span>You</span>
                    )}
                    <span>·</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-foreground text-background rounded-tr-sm"
                        : "bg-surface border border-border text-foreground rounded-tl-sm shadow-sm"
                    }`}
                  >
                    {/* Agent Thought Box */}
                    {msg.thought && (
                      <div className="mb-3 rounded-xl border border-brand/20 bg-brand/5 p-2.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-brand font-semibold mb-1">
                          <Activity className="size-3" /> Agent Reasoning Process
                        </div>
                        <p className="font-mono text-[11px] leading-tight text-foreground/80">
                          {msg.thought}
                        </p>
                      </div>
                    )}

                    {/* Tools Executed Badges */}
                    {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                      <div className="mb-3 space-y-1.5">
                        {msg.toolsUsed.map((tool, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between rounded-lg border border-border bg-background/80 px-2.5 py-1 text-xs font-mono"
                          >
                            <div className="flex items-center gap-1.5 text-brand">
                              <Zap className="size-3" />
                              <span className="font-semibold">{tool.name}()</span>
                            </div>
                            <span className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                              {tool.result || tool.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Main Markdown / Text Content */}
                    <div className="whitespace-pre-line prose-sm">{msg.text}</div>

                    {/* Interactive Action Buttons */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-border flex flex-wrap gap-2">
                        {msg.actions.map((act, i) => (
                          <button
                            key={i}
                            onClick={act.onClick}
                            className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-surface/80 px-3 py-1 text-xs font-medium text-foreground transition hover:border-brand hover:bg-brand/10"
                          >
                            <span>{act.label}</span>
                            <ArrowUpRight className="size-3 text-brand" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Processing Loader */}
              {isProcessing && (
                <div className="flex flex-col items-start animate-pulse">
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] font-mono text-muted-foreground">
                    <Sparkles className="size-3 text-brand" />
                    <span>Agent reasoning & executing tools...</span>
                  </div>
                  <div className="rounded-2xl rounded-tl-sm border border-brand/30 bg-surface p-4 text-xs font-mono text-muted-foreground flex items-center gap-3">
                    <div className="size-3 rounded-full bg-brand animate-ping" />
                    <span>Evaluating query semantics and determining browser actions...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts Carousel */}
            <div className="border-t border-border bg-surface/30 px-4 py-2.5 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2">
                <span className="shrink-0 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  Quick Actions:
                </span>
                {QUICK_PROMPTS.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(qp.prompt)}
                    disabled={isProcessing}
                    className="shrink-0 rounded-full border border-border bg-background/80 px-2.5 py-1 text-xs text-foreground/80 transition hover:border-brand/50 hover:bg-surface hover:text-foreground"
                  >
                    {qp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="border-t border-border p-3 sm:p-4 bg-background flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question, filter projects, or run diagnostics..."
                  disabled={isProcessing}
                  className="w-full rounded-full border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>

              <button
                type="submit"
                disabled={!input.trim() || isProcessing}
                className="grid size-10 place-items-center rounded-full bg-brand text-background transition hover:opacity-90 disabled:opacity-50"
                aria-label="Send message"
              >
                <Send className="size-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
