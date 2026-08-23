import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X, Briefcase } from "lucide-react";
import type { ExperienceItem } from "../../types/portfolio";
import { saveExperience, deleteExperience } from "../../lib/portfolio-data";

interface ExperienceManagerProps {
  experience: ExperienceItem[];
  onRefresh: () => void;
}

export function ExperienceManager({ experience, onRefresh }: ExperienceManagerProps) {
  const [editingItem, setEditingItem] = useState<ExperienceItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [editingItem]);

  const startCreate = () => {
    setEditingItem({
      id: `exp-${Date.now()}`,
      role: "",
      org: "",
      period: `${new Date().getFullYear()} — Present`,
      body: "",
      order: experience.length + 1,
    });
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.role.trim()) return;

    setSaving(true);
    try {
      await saveExperience(editingItem);
      setEditingItem(null);
      setIsCreating(false);
      onRefresh();
    } catch (err) {
      console.error("Save experience error:", err);
      alert("Failed to save experience entry");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience entry?")) return;
    try {
      await deleteExperience(id);
      onRefresh();
    } catch (err) {
      console.error("Delete experience error:", err);
      alert("Failed to delete experience entry");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium tracking-tight">Experience & Research</h2>
          <p className="text-sm text-muted-foreground">
            Manage internships, AI trainer roles, research, and freelance work.
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background transition-transform hover:scale-[1.02]"
        >
          <Plus className="size-4" /> Add Experience
        </button>
      </div>

      {/* Experience List */}
      <div className="grid gap-3">
        {experience.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col justify-between gap-4 rounded-2xl border border-border bg-surface/50 p-5 transition-colors hover:border-brand/40 sm:flex-row sm:items-center"
          >
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground">{item.role}</span>
                <span className="text-xs text-brand font-medium">@{item.org}</span>
                <span className="rounded bg-surface-2 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {item.period}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">{item.body}</p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => {
                  setEditingItem(item);
                  setIsCreating(false);
                }}
                className="grid size-8 place-items-center rounded-full border border-border bg-surface text-muted-foreground hover:border-brand hover:text-brand"
              >
                <Edit2 className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="grid size-8 place-items-center rounded-full border border-border bg-surface text-muted-foreground hover:border-destructive hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Popup Modal for Add / Edit Experience */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className="relative flex flex-col w-full max-w-xl max-h-[90vh] rounded-3xl border border-border bg-background shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-surface/50">
              <div className="flex items-center gap-2">
                <Briefcase className="size-4 text-brand" />
                <h3 className="text-base font-medium text-foreground">
                  {isCreating ? "Add New Experience" : `Edit: ${editingItem.role}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setIsCreating(false);
                }}
                className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form
              id="experience-edit-form"
              onSubmit={handleSave}
              className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Role Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.role}
                    onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                    placeholder="e.g. Machine Learning Engineering Intern"
                    className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2 text-sm focus:border-brand focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.org}
                    onChange={(e) => setEditingItem({ ...editingItem, org: e.target.value })}
                    placeholder="e.g. FlyRank AI"
                    className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2 text-sm focus:border-brand focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Period / Timeline
                </label>
                <input
                  type="text"
                  value={editingItem.period}
                  onChange={(e) => setEditingItem({ ...editingItem, period: e.target.value })}
                  placeholder="e.g. Jul 2026 — Aug 2026"
                  className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2 text-sm focus:border-brand focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  Description / Responsibilities *
                </label>
                <textarea
                  required
                  rows={4}
                  value={editingItem.body}
                  onChange={(e) => setEditingItem({ ...editingItem, body: e.target.value })}
                  placeholder="What did you build, deploy, or achieve in this role?"
                  className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2 text-sm focus:border-brand focus:outline-none"
                />
              </div>
            </form>

            {/* Modal Sticky Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4 bg-surface/50">
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setIsCreating(false);
                }}
                className="rounded-full px-4 py-2 text-xs text-muted-foreground hover:bg-surface-2 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="experience-edit-form"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2 text-xs font-medium text-brand-foreground shadow-md transition-transform hover:scale-[1.02]"
              >
                <Save className="size-4" />
                {saving ? "Saving..." : "Save Experience"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
