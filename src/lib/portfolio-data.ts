import { getSupabase, PORTFOLIO_BUCKET } from "./supabase";
import type { Project, ExperienceItem, CertificationItem, ProfileData } from "../types/portfolio";

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "idcard-detection",
    title: "ID Card Detection",
    tag: "Object Detection",
    blurb:
      "YOLOv11 pipeline detecting university ID cards across capture angles, lighting, and occlusion. Trained on a custom-labeled dataset.",
    stack: ["YOLOv11", "PyTorch", "Roboflow"],
    date: "Mar 2025",
    metric: { label: "mAP@50", value: "0.82" },
    video: "/content/idcard_ai.mp4",
    link: "https://www.kaggle.com/code/tahmidulkashfi/iiuc-idcard-v2-0-38map95",
    linkedin: "https://www.linkedin.com/feed/update/urn:li:activity:7252285574110171137/",
    span: "lg:col-span-2",
    order: 1,
  },
  {
    id: "sketch-ai",
    title: "Sketch AI",
    tag: "Applied CV · HCI",
    blurb:
      "Real-time air canvas system using hand landmark detection to track fingertip motion and draw directly on screen via webcam gestures.",
    stack: ["MediaPipe", "OpenCV", "Python"],
    date: "Nov 2024",
    video: "/content/sketch_ai.mp4",
    linkedin: "https://www.linkedin.com/feed/update/urn:li:activity:7267928416534839296/",
    order: 2,
  },
  {
    id: "face-mouse",
    title: "Face Mouse",
    tag: "Accessibility · HCI",
    blurb:
      "Head-pose driven cursor and click for users with limited hand mobility. Real-time face mesh + gesture triggers.",
    stack: ["MediaPipe", "OpenCV", "PyAutoGUI"],
    date: "Aug 2024",
    video: "/content/face_mouse_ai.mp4",
    linkedin: "https://www.linkedin.com/feed/update/urn:li:activity:7271416959215239168/",
    order: 3,
  },
  {
    id: "facial-attendance",
    title: "Facial Attendance System",
    tag: "Face Recognition",
    blurb:
      "Live attendance from a single camera stream. Face embeddings matched against an enrolled database with logging.",
    stack: ["FaceNet", "OpenCV", "SQLite"],
    date: "May 2024",
    video: "/content/facial_attendance_system.mp4",
    linkedin: "https://www.linkedin.com/feed/update/urn:li:activity:7257462743069270016/",
    span: "lg:col-span-2",
    order: 4,
  },
  {
    id: "bangla-poem-gpt",
    title: "BanglaPoemGPT",
    tag: "LLM · Bengali NLP",
    blurb:
      "Fine-tuned language model that generates Bengali poems in classical meter, trained on a curated corpus.",
    stack: ["Transformers", "HuggingFace"],
    date: "Feb 2024",
    order: 5,
  },
  {
    id: "bengali-digits-dcgan",
    title: "Bengali Digits DCGAN",
    tag: "Generative · GAN",
    blurb:
      "Deep convolutional GAN synthesizing handwritten Bengali digits for dataset augmentation.",
    stack: ["PyTorch", "DCGAN"],
    date: "Oct 2023",
    order: 6,
  },
  {
    id: "hand-tracking-bus",
    title: "Hand Tracking & Bus Tracking",
    tag: "Applied CV",
    blurb:
      "Real-time hand landmark tracking for gesture control and a live GPS-based bus tracking prototype.",
    stack: ["MediaPipe", "React", "Node"],
    date: "Jun 2023",
    order: 7,
  },
];

export const INITIAL_EXPERIENCE: ExperienceItem[] = [
  {
    id: "flyrank-ai",
    role: "Machine Learning Engineering Intern",
    org: "FlyRank AI",
    period: "Jul 2026 — Aug 2026",
    body: "Selected for the FlyRank AI ML Engineering internship — a 6-week program focused on applied machine learning engineering. Building and shipping ML systems alongside the FlyRank team.",
    order: 1,
  },
  {
    id: "outlier-ai",
    role: "AI Trainer — Computer Vision",
    org: "Outlier AI",
    period: "2023 — Present",
    body: "Evaluating and improving vision-language model outputs across detection, grounding, and reasoning tasks. Writing rubric-driven feedback used for RLHF training loops.",
    order: 2,
  },
  {
    id: "freelance-cv",
    role: "Freelance Computer Vision Engineer",
    org: "Independent",
    period: "2022 — Present",
    body: "Delivered custom CV pipelines: document detection, face verification, and gesture-driven interfaces. Full loop — data collection, training, deployment.",
    order: 3,
  },
];

export const INITIAL_CERTIFICATIONS: CertificationItem[] = [
  {
    id: "nn-dl",
    title: "Neural Networks & Deep Learning",
    issuer: "DeepLearning.AI · Coursera",
    date: "Jan 2024",
    href: "https://www.coursera.org/account/accomplishments/certificate/Z8ERPLQ3CLFZ",
    image: "/content/brave_screenshot_www.coursera.org.png",
    order: 1,
  },
  {
    id: "improving-dnn",
    title: "Improving Deep Neural Networks",
    issuer: "DeepLearning.AI · Coursera",
    date: "Jan 2024",
    href: "https://www.coursera.org/account/accomplishments/verify/PH5R5XW9ZUC3",
    image: "/content/brave_screenshot_s3.amazonaws.com.png",
    order: 2,
  },
  {
    id: "cnn",
    title: "Convolutional Neural Networks",
    issuer: "DeepLearning.AI · Coursera",
    date: "Jul 2024",
    href: "https://www.coursera.org/account/accomplishments/verify/URKXK7BZC8JY",
    image: "/content/CERTIFICATE_LANDING_PAGE~URKXK7BZC8JY.jpeg",
    order: 3,
  },
  {
    id: "sequence-models",
    title: "Sequence Models",
    issuer: "DeepLearning.AI · Coursera",
    date: "Jul 2024",
    href: "https://www.coursera.org/account/accomplishments/certificate/VG3F3QYWC9PG",
    image: "/content/brave_screenshot_www.coursera.org_1.png",
    order: 4,
  },
  {
    id: "codecademy-ml",
    title: "Data Scientist: Machine Learning",
    issuer: "Codecademy · Professional Certification",
    date: "Feb 2024",
    href: "https://www.codecademy.com/profiles/kashfi20/certificates/8e9e59de3f924b33ad2371faf667129b",
    image: "/content/brave_screenshot_www.codecademy.com.png",
    order: 5,
  },
];

export const INITIAL_PROFILE: ProfileData = {
  name: "Tahmidul Bin Ferdous",
  tagline: "Building machines that see, understand, and act.",
  bio: "Computer Vision & Deep Learning engineer and final-year CS student in Chattogram, Bangladesh. I ship end-to-end vision systems — from annotation to real-time inference — across detection, generation, and accessibility.",
  location: "Chattogram, Bangladesh",
  studentStatus: "Final-year CS student",
  availability: "Available for CV / ML engineering roles",
  email: "tahmidul.kashfi@gmail.com",
  portraitUrl: "/content/professional.jpg",
  resumeUrl: "/content/kashfi_resumev1.pdf",
  skills: [
    {
      label: "Languages",
      items: ["Python", "C++", "JavaScript/TypeScript", "SQL"],
    },
    {
      label: "Frameworks",
      items: ["PyTorch", "TensorFlow", "Keras", "FastAPI"],
    },
    {
      label: "Libraries",
      items: ["OpenCV", "MediaPipe", "NumPy", "Pandas", "scikit-learn", "Albumentations"],
    },
    {
      label: "Tools",
      items: ["Git", "Docker", "Kaggle", "Roboflow", "Linux"],
    },
  ],
  socials: [
    { label: "GitHub", href: "https://github.com/AI-human" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "Kaggle", href: "https://www.kaggle.com/tahmidulkashfi" },
    { label: "LeetCode", href: "https://leetcode.com/" },
  ],
};

const STORAGE_KEYS = {
  PROJECTS: "portfolio_projects_data",
  EXPERIENCE: "portfolio_experience_data",
  CERTIFICATIONS: "portfolio_certs_data",
  PROFILE: "portfolio_profile_data",
};

// Local storage fallback helpers
function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Local storage error:", err);
  }
}

// Portfolio API Service
export async function getPortfolioData(): Promise<{
  projects: Project[];
  experience: ExperienceItem[];
  certifications: CertificationItem[];
  profile: ProfileData;
}> {
  const supabase = getSupabase();

  if (!supabase) {
    return {
      projects: getLocal<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS),
      experience: getLocal<ExperienceItem[]>(STORAGE_KEYS.EXPERIENCE, INITIAL_EXPERIENCE),
      certifications: getLocal<CertificationItem[]>(
        STORAGE_KEYS.CERTIFICATIONS,
        INITIAL_CERTIFICATIONS,
      ),
      profile: getLocal<ProfileData>(STORAGE_KEYS.PROFILE, INITIAL_PROFILE),
    };
  }

  try {
    const [projectsRes, expRes, certsRes, profileRes] = await Promise.all([
      supabase.from("projects").select("*").order("order", { ascending: true }),
      supabase.from("experience").select("*").order("order", { ascending: true }),
      supabase.from("certifications").select("*").order("order", { ascending: true }),
      supabase.from("profile").select("*").single(),
    ]);

    const projects: Project[] =
      projectsRes.data && projectsRes.data.length > 0
        ? projectsRes.data.map((p) => ({
            id: p.id,
            title: p.title,
            tag: p.tag,
            blurb: p.blurb,
            stack: Array.isArray(p.stack) ? p.stack : JSON.parse(p.stack || "[]"),
            date: p.date,
            metric: p.metric
              ? typeof p.metric === "object"
                ? p.metric
                : JSON.parse(p.metric)
              : undefined,
            video: p.video,
            link: p.link,
            linkedin: p.linkedin,
            span: p.span,
            order: p.order,
          }))
        : getLocal<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);

    const experience: ExperienceItem[] =
      expRes.data && expRes.data.length > 0
        ? expRes.data
        : getLocal<ExperienceItem[]>(STORAGE_KEYS.EXPERIENCE, INITIAL_EXPERIENCE);

    const certifications: CertificationItem[] =
      certsRes.data && certsRes.data.length > 0
        ? certsRes.data
        : getLocal<CertificationItem[]>(STORAGE_KEYS.CERTIFICATIONS, INITIAL_CERTIFICATIONS);

    const profile: ProfileData =
      profileRes.data && profileRes.data.name
        ? {
            name: profileRes.data.name,
            tagline: profileRes.data.tagline,
            bio: profileRes.data.bio,
            location: profileRes.data.location,
            studentStatus: profileRes.data.student_status,
            availability: profileRes.data.availability,
            email: profileRes.data.email,
            portraitUrl: profileRes.data.portrait_url,
            resumeUrl: profileRes.data.resume_url,
            skills: (() => {
              const raw =
                typeof profileRes.data.skills === "string"
                  ? JSON.parse(profileRes.data.skills)
                  : profileRes.data.skills || INITIAL_PROFILE.skills;
              return Array.isArray(raw)
                ? raw.map((s: Record<string, unknown>) => {
                    const label = (s.label || s.category || s.name || "") as string;
                    const items = (
                      Array.isArray(s.items) ? s.items : Array.isArray(s.skills) ? s.skills : []
                    ) as string[];
                    return {
                      id: (s.id as string | undefined) || undefined,
                      label,
                      items,
                    };
                  })
                : INITIAL_PROFILE.skills;
            })(),
            socials: (() => {
              const raw =
                typeof profileRes.data.socials === "string"
                  ? JSON.parse(profileRes.data.socials)
                  : profileRes.data.socials || INITIAL_PROFILE.socials;
              return Array.isArray(raw)
                ? raw.map((s: Record<string, unknown>) => ({
                    label: (s.label || s.name || "") as string,
                    href: (s.href || s.url || "#") as string,
                  }))
                : INITIAL_PROFILE.socials;
            })(),
          }
        : getLocal<ProfileData>(STORAGE_KEYS.PROFILE, INITIAL_PROFILE);

    return { projects, experience, certifications, profile };
  } catch (err) {
    console.error("Error fetching portfolio data from Supabase:", err);
    return {
      projects: getLocal<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS),
      experience: getLocal<ExperienceItem[]>(STORAGE_KEYS.EXPERIENCE, INITIAL_EXPERIENCE),
      certifications: getLocal<CertificationItem[]>(
        STORAGE_KEYS.CERTIFICATIONS,
        INITIAL_CERTIFICATIONS,
      ),
      profile: getLocal<ProfileData>(STORAGE_KEYS.PROFILE, INITIAL_PROFILE),
    };
  }
}

// Save Project
export async function saveProject(project: Project): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    await supabase.from("projects").upsert({
      id: project.id,
      title: project.title,
      tag: project.tag,
      blurb: project.blurb,
      stack: project.stack,
      date: project.date,
      metric: project.metric,
      video: project.video,
      link: project.link,
      linkedin: project.linkedin,
      span: project.span,
      order: project.order ?? 0,
      updated_at: new Date().toISOString(),
    });
  }
  // Also save to local storage cache
  const local = getLocal<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  const idx = local.findIndex((p) => p.id === project.id);
  if (idx >= 0) {
    local[idx] = project;
  } else {
    local.unshift(project);
  }
  setLocal(STORAGE_KEYS.PROJECTS, local);
}

// Delete Project
export async function deleteProject(id: string): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    await supabase.from("projects").delete().eq("id", id);
  }
  const local = getLocal<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  setLocal(
    STORAGE_KEYS.PROJECTS,
    local.filter((p) => p.id !== id),
  );
}

// Save Experience
export async function saveExperience(item: ExperienceItem): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    await supabase.from("experience").upsert({
      id: item.id,
      role: item.role,
      org: item.org,
      period: item.period,
      body: item.body,
      order: item.order ?? 0,
      updated_at: new Date().toISOString(),
    });
  }
  const local = getLocal<ExperienceItem[]>(STORAGE_KEYS.EXPERIENCE, INITIAL_EXPERIENCE);
  const idx = local.findIndex((e) => e.id === item.id);
  if (idx >= 0) {
    local[idx] = item;
  } else {
    local.unshift(item);
  }
  setLocal(STORAGE_KEYS.EXPERIENCE, local);
}

// Delete Experience
export async function deleteExperience(id: string): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    await supabase.from("experience").delete().eq("id", id);
  }
  const local = getLocal<ExperienceItem[]>(STORAGE_KEYS.EXPERIENCE, INITIAL_EXPERIENCE);
  setLocal(
    STORAGE_KEYS.EXPERIENCE,
    local.filter((e) => e.id !== id),
  );
}

// Save Certification
export async function saveCertification(item: CertificationItem): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    await supabase.from("certifications").upsert({
      id: item.id,
      title: item.title,
      issuer: item.issuer,
      date: item.date,
      href: item.href,
      image: item.image,
      order: item.order ?? 0,
      updated_at: new Date().toISOString(),
    });
  }
  const local = getLocal<CertificationItem[]>(STORAGE_KEYS.CERTIFICATIONS, INITIAL_CERTIFICATIONS);
  const idx = local.findIndex((c) => c.id === item.id);
  if (idx >= 0) {
    local[idx] = item;
  } else {
    local.unshift(item);
  }
  setLocal(STORAGE_KEYS.CERTIFICATIONS, local);
}

// Delete Certification
export async function deleteCertification(id: string): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    await supabase.from("certifications").delete().eq("id", id);
  }
  const local = getLocal<CertificationItem[]>(STORAGE_KEYS.CERTIFICATIONS, INITIAL_CERTIFICATIONS);
  setLocal(
    STORAGE_KEYS.CERTIFICATIONS,
    local.filter((c) => c.id !== id),
  );
}

// Save Profile & Resume
export async function saveProfile(profile: ProfileData): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    await supabase.from("profile").upsert({
      id: "main",
      name: profile.name,
      tagline: profile.tagline,
      bio: profile.bio,
      location: profile.location,
      student_status: profile.studentStatus,
      availability: profile.availability,
      email: profile.email,
      portrait_url: profile.portraitUrl,
      resume_url: profile.resumeUrl,
      skills: profile.skills,
      socials: profile.socials,
      updated_at: new Date().toISOString(),
    });
  }
  setLocal(STORAGE_KEYS.PROFILE, profile);
}

// Upload Media (Video, PDF, Image) to Supabase Storage
export async function uploadPortfolioFile(
  file: File,
  folder: "videos" | "resumes" | "images" | "certs" = "images",
): Promise<string> {
  const supabase = getSupabase();
  const fileExt = file.name.split(".").pop();
  const safeName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `${folder}/${safeName}`;

  if (!supabase) {
    // If Supabase is not connected yet, create a local preview ObjectURL
    console.warn("Supabase credentials not found. Using local Blob URL for preview.");
    return URL.createObjectURL(file);
  }

  const { error } = await supabase.storage.from(PORTFOLIO_BUCKET).upload(filePath, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(PORTFOLIO_BUCKET).getPublicUrl(filePath);

  return data.publicUrl;
}
