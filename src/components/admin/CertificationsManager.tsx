import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, ExternalLink, Save, X, Award } from "lucide-react";
import type { CertificationItem } from "../../types/portfolio";
import { saveCertification, deleteCertification } from "../../lib/portfolio-data";
import { MediaUploader } from "./MediaUploader";

interface CertificationsManagerProps {
  certifications: CertificationItem[];
  onRefresh: () => void;
}

export function CertificationsManager({ certifications, onRefresh }: CertificationsManagerProps) {
  const [editingCert, setEditingCert] = useState<CertificationItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingCert) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [editingCert]);

  const startCreate = () => {
    setEditingCert({
      id: `cert-${Date.now()}`,
      title: "",
      issuer: "DeepLearning.AI · Coursera",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      href: "",
      image: "/content/cert_nn_dl.webp",
      order: certifications.length + 1,
    });
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert || !editingCert.title.trim()) return;

    setSaving(true);
    try {
      await saveCertification(editingCert);
      setEditingCert(null);
      setIsCreating(false);
      onRefresh();
    } catch (err) {
      console.error("Save certification error:", err);
      alert("Failed to save certification");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;
    try {
      await deleteCertification(id);
      onRefresh();
    } catch (err) {
      console.error("Delete certification error:", err);
      alert("Failed to delete certification");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium tracking-tight">Certifications & Learning</h2>
          <p className="text-sm text-muted-foreground">
            Manage course certificates, verification URLs, and credential badges.
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background transition-transform hover:scale-[1.02]"
        >
          <Plus className="size-4" /> Add Certificate
        </button>
      </div>

      {/* Certifications Grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className="group flex flex-col justify-between gap-3 rounded-2xl border border-border bg-surface/50 p-4 transition-colors hover:border-brand/40"
          >
            <div className="flex items-start gap-3">
              <img
                src={cert.image}
                alt={cert.title}
                className="size-14 shrink-0 rounded-xl object-cover ring-1 ring-border"
              />
              <div className="min-w-0 space-y-1">
                <p className="truncate text-sm font-medium">{cert.title}</p>
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {cert.date} · {cert.issuer}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border/50 pt-2">
              <a
                href={cert.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-brand hover:underline"
              >
                Verify Link <ExternalLink className="size-3" />
              </a>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCert(cert);
                    setIsCreating(false);
                  }}
                  className="grid size-7 place-items-center rounded-full border border-border bg-surface text-muted-foreground hover:border-brand hover:text-brand"
                >
                  <Edit2 className="size-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cert.id)}
                  className="grid size-7 place-items-center rounded-full border border-border bg-surface text-muted-foreground hover:border-destructive hover:text-destructive"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Popup Modal for Add / Edit Certificate */}
      {editingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className="relative flex flex-col w-full max-w-xl max-h-[90vh] rounded-3xl border border-border bg-background shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-surface/50">
              <div className="flex items-center gap-2">
                <Award className="size-4 text-brand" />
                <h3 className="text-base font-medium text-foreground">
                  {isCreating ? "Add New Certificate" : `Edit: ${editingCert.title}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingCert(null);
                  setIsCreating(false);
                }}
                className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-surface-2 hover:text-foreground transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form
              id="cert-edit-form"
              onSubmit={handleSave}
              className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Certificate Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCert.title}
                    onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                    placeholder="e.g. Convolutional Neural Networks"
                    className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2 text-sm focus:border-brand focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Issuer / Provider *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCert.issuer}
                    onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                    placeholder="e.g. DeepLearning.AI · Coursera"
                    className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2 text-sm focus:border-brand focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Date Completed
                  </label>
                  <input
                    type="text"
                    value={editingCert.date}
                    onChange={(e) => setEditingCert({ ...editingCert, date: e.target.value })}
                    placeholder="e.g. Jul 2024"
                    className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2 text-sm focus:border-brand focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Verification URL
                  </label>
                  <input
                    type="url"
                    value={editingCert.href}
                    onChange={(e) => setEditingCert({ ...editingCert, href: e.target.value })}
                    placeholder="https://www.coursera.org/account/accomplishments/..."
                    className="w-full rounded-xl border border-border bg-surface-2 px-3.5 py-2 text-sm focus:border-brand focus:outline-none"
                  />
                </div>
              </div>

              <MediaUploader
                label="Certificate Screenshot / Badge Image"
                accept="image/*"
                folder="certs"
                currentUrl={editingCert.image}
                onUploaded={(url) => setEditingCert({ ...editingCert, image: url })}
                helperText="Upload image of the credential"
              />
            </form>

            {/* Modal Sticky Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4 bg-surface/50">
              <button
                type="button"
                onClick={() => {
                  setEditingCert(null);
                  setIsCreating(false);
                }}
                className="rounded-full px-4 py-2 text-xs text-muted-foreground hover:bg-surface-2 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="cert-edit-form"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2 text-xs font-medium text-brand-foreground shadow-md transition-transform hover:scale-[1.02]"
              >
                <Save className="size-4" />
                {saving ? "Saving..." : "Save Certificate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
