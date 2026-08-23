import { useState } from "react";
import { Save, User, FileText, Sparkles, CheckCircle2 } from "lucide-react";
import type { ProfileData } from "../../types/portfolio";
import { saveProfile } from "../../lib/portfolio-data";
import { MediaUploader } from "./MediaUploader";

interface ResumeProfileManagerProps {
  profile: ProfileData;
  onRefresh: () => void;
}

export function ResumeProfileManager({ profile, onRefresh }: ResumeProfileManagerProps) {
  const [formData, setFormData] = useState<ProfileData>(profile);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveProfile(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      onRefresh();
    } catch (err) {
      console.error("Profile save error:", err);
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium tracking-tight">Profile & Resume</h2>
          <p className="text-sm text-muted-foreground">
            Update your CV/Resume PDF, headshot photo, bio, and social links.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2 text-xs font-medium text-brand-foreground shadow-md transition-transform hover:scale-[1.02]"
        >
          <Save className="size-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-400">
          <CheckCircle2 className="size-4" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Media Uploads */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-[image:var(--gradient-card)] p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <FileText className="size-4 text-brand" />
            <span>Resume / CV Document (PDF)</span>
          </div>
          <MediaUploader
            label="Upload PDF Resume"
            accept="application/pdf"
            folder="resumes"
            currentUrl={formData.resumeUrl}
            onUploaded={(url) => setFormData({ ...formData, resumeUrl: url })}
            helperText="Directly updates the download resume link across the site"
          />
        </div>

        <div className="rounded-2xl border border-border bg-[image:var(--gradient-card)] p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <User className="size-4 text-brand" />
            <span>Profile Headshot Photo</span>
          </div>
          <MediaUploader
            label="Upload Headshot Image (JPEG / PNG)"
            accept="image/*"
            folder="images"
            currentUrl={formData.portraitUrl}
            onUploaded={(url) => setFormData({ ...formData, portraitUrl: url })}
            helperText="Avatar image rendered in hero section"
          />
        </div>
      </div>

      {/* Bio & Details */}
      <div className="rounded-2xl border border-border bg-[image:var(--gradient-card)] p-6 space-y-5">
        <div className="flex items-center gap-2 text-sm font-medium border-b border-border pb-3">
          <Sparkles className="size-4 text-brand" />
          <span>Personal & Professional Info</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2 text-sm focus:border-brand focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Contact Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2 text-sm focus:border-brand focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2 text-sm focus:border-brand focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Availability Badge Status
            </label>
            <input
              type="text"
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2 text-sm focus:border-brand focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Tagline / Subheading
          </label>
          <input
            type="text"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Biography / Summary
          </label>
          <textarea
            rows={4}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2 text-sm focus:border-brand focus:outline-none"
          />
        </div>
      </div>
    </form>
  );
}
