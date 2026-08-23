export interface Project {
  id: string;
  title: string;
  tag: string;
  blurb: string;
  stack: string[];
  date: string;
  metric?: { label: string; value: string };
  video?: string;
  link?: string;
  linkedin?: string;
  span?: string;
  order?: number;
}

export interface ExperienceItem {
  id: string;
  role: string;
  org: string;
  period: string;
  body: string;
  order?: number;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  href: string;
  image: string;
  order?: number;
}

export interface SkillCategory {
  id?: string;
  label: string;
  items: string[];
}

export interface ProfileData {
  name: string;
  tagline: string;
  bio: string;
  location: string;
  studentStatus: string;
  availability: string;
  email: string;
  portraitUrl: string;
  resumeUrl: string;
  skills: SkillCategory[];
  socials: {
    label: string;
    href: string;
  }[];
}
