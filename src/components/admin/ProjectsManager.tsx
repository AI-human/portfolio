import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Linkedin,
  Video,
  Save,
  X,
  Sparkles,
} from "lucide-react";
import type { Project } from "../../types/portfolio";
import { saveProject, deleteProject } from "../../lib/portfolio-data";
import { MediaUploader } from "./MediaUploader";

interface ProjectsManagerProps {
  projects: Project[];
  onRefresh: () => void;
}

export function ProjectsManager({ projects, onRefresh }: ProjectsManagerProps) {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Prevent background scrolling when popup is open
  useEffect(() => {
    if (editingProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [editingProject]);

  const startCreate = () => {
    setEditingProject({
      id: `project-${Date.now()}`,
      title: "",
      tag: "Computer Vision",
      blurb: "",
      stack: ["Python", "PyTorch", "OpenCV"],
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      order: projects.length + 1,
    });
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title.trim()) return;

    setSaving(true);
    try {
      await saveProject(editingProject);
      setEditingProject(null);
      setIsCreating(false);
      onRefresh();
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProject(id);
      onRefresh();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete project");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium tracking-tight">Projects</h2>
          <p className="text-sm text-muted-foreground">
            Manage selected work, demo videos, tech stacks, and benchmarks.
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background transition-transform hover:scale-[1.02]"
        >
          <Plus className="size-4" /> Add Project
        </button>
      </div>

      {/* Projects List */}
      <div className="grid gap-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group flex flex-col justify-between gap-4 rounded-2xl border border-border bg-surface/50 p-4 transition-colors hover:border-brand/40 sm:flex-row sm:items-center"
          >
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{project.title}</span>
                <span className="rounded-full bg-surface-2 px-2 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
                  {project.tag}
                </span>
                {project.metric && (
                  <span className="rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 font-mono text-[10px] text-brand">
                    {project.metric.label}: {project.metric.value}
                  </span>
                )}
                {project.video && (
                  <span className="inline-flex items-center gap-1 rounded bg-surface-2 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    <Video className="size-3 text-brand" /> Demo
                  </span>
                )}
              </div>
              <p className="line-clamp-2 text-xs text-muted-foreground">{project.blurb}</p>
              <div className="flex flex-wrap items-center gap-1 pt-1">
                {project.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded bg-surface-2/60 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="grid size-8 place-items-center rounded-full border border-border bg-surface text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="size-3.5" />
                </a>
              )}
              {project.linkedin && (
                <a
                  href={project.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="grid size-8 place-items-center rounded-full border border-border bg-surface text-muted-foreground hover:text-foreground"
                >
                  <Linkedin className="size-3.5" />
                </a>
              )}
              <button
                type="button"
                onClick={() => {
                  setEditingProject(project);
                  setIsCreating(false);
                }}
                className="grid size-8 place-items-center rounded-full border border-border bg-surface text-muted-foreground hover:border-brand hover:text-brand"
              >
                <Edit2 className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(project.id)}
                className="grid size-8 place-items-center rounded-full border border-border bg-surface text-muted-foreground hover:border-destructive hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Project Popup Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className="relative flex flex-col w-full max-w-2xl max-h-[90vh] rounded-3xl border border-border bg-background shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-surface/50">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-brand" />
                <h3 className="text-base font-medium text-foreground">
                  {isCreating ? "Add New Project" : `Edit Project: ${editingProject.title}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingProject(null);
                  setIsCreating(false);
                }}
                className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form
              id="project-edit-form"
              onSubmit={handleSave}
              className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        title: e.target.value,
                      })
                    }
                    placeholder="e.g. ID Card Detection"
                    className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2 text-sm focus:border-brand focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Category / Tag *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.tag}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        tag: e.target.value,
                      })
                    }
                    placeholder="e.g. Object Detection, HCI"
                    className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2 text-sm focus:border-brand focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Date Completed
                  </label>
                  <input
                    type="text"
                    value={editingProject.date}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        date: e.target.value,
                      })
                    }
                    placeholder="e.g. Mar 2025"
                    className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2 text-sm focus:border-brand focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Tech Stack (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editingProject.stack.join(", ")}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        stack: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="YOLOv11, PyTorch, Roboflow"
                    className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2 text-sm focus:border-brand focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Description / Blurb *
                </label>
                <textarea
                  required
                  rows={3}
                  value={editingProject.blurb}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      blurb: e.target.value,
                    })
                  }
                  placeholder="Detailed description of problem, pipeline, and results..."
                  className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2 text-sm focus:border-brand focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Benchmark Metric Label
                  </label>
                  <input
                    type="text"
                    value={editingProject.metric?.label || ""}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        metric: {
                          label: e.target.value,
                          value: editingProject.metric?.value || "",
                        },
                      })
                    }
                    placeholder="e.g. mAP@50"
                    className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2 text-sm focus:border-brand focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Benchmark Metric Value
                  </label>
                  <input
                    type="text"
                    value={editingProject.metric?.value || ""}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        metric: {
                          label: editingProject.metric?.label || "",
                          value: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. 0.82"
                    className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2 text-sm focus:border-brand focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="span-col"
                    checked={editingProject.span === "lg:col-span-2"}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        span: e.target.checked ? "lg:col-span-2" : undefined,
                      })
                    }
                    className="size-4 rounded border-border text-brand focus:ring-brand"
                  />
                  <label htmlFor="span-col" className="text-xs text-foreground cursor-pointer">
                    Wide Card (Span 2 col)
                  </label>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Code / Kaggle / Website Link
                  </label>
                  <input
                    type="url"
                    value={editingProject.link || ""}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        link: e.target.value,
                      })
                    }
                    placeholder="https://www.kaggle.com/..."
                    className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2 text-sm focus:border-brand focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    LinkedIn Post URL
                  </label>
                  <input
                    type="url"
                    value={editingProject.linkedin || ""}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        linkedin: e.target.value,
                      })
                    }
                    placeholder="https://www.linkedin.com/..."
                    className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2 text-sm focus:border-brand focus:outline-none"
                  />
                </div>
              </div>

              <MediaUploader
                label="Project Demo Video (MP4 / WebM)"
                accept="video/mp4,video/webm"
                folder="videos"
                currentUrl={editingProject.video}
                onUploaded={(url) => setEditingProject({ ...editingProject, video: url })}
                helperText="Upload video demonstration to Supabase Cloud Storage"
              />
            </form>

            {/* Modal Sticky Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4 bg-surface/50">
              <button
                type="button"
                onClick={() => {
                  setEditingProject(null);
                  setIsCreating(false);
                }}
                className="rounded-full px-4 py-2 text-xs text-muted-foreground hover:bg-surface-2 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="project-edit-form"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2 text-xs font-medium text-brand-foreground shadow-md transition-transform hover:scale-[1.02]"
              >
                <Save className="size-4" />
                {saving ? "Saving..." : "Save Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
