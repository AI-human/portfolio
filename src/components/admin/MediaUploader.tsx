import { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { uploadPortfolioFile } from "../../lib/portfolio-data";

interface MediaUploaderProps {
  label: string;
  accept: string;
  folder: "videos" | "resumes" | "images" | "certs";
  currentUrl?: string;
  onUploaded: (url: string) => void;
  helperText?: string;
}

export function MediaUploader({
  label,
  accept,
  folder,
  currentUrl,
  onUploaded,
  helperText,
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const url = await uploadPortfolioFile(file, folder);
      setPreviewUrl(url);
      onUploaded(url);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to upload file";
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  const isVideo = accept.includes("video") || previewUrl?.endsWith(".mp4");
  const isPdf = accept.includes("pdf") || previewUrl?.endsWith(".pdf");

  return (
    <div className="space-y-2">
      <label className="block text-xs font-mono uppercase tracking-widest text-muted-foreground">
        {label}
      </label>

      <div
        onClick={() => fileInputRef.current?.click()}
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-4 transition-colors ${
          error
            ? "border-destructive/60 bg-destructive/5"
            : "border-border bg-surface/40 hover:border-brand/50 hover:bg-surface/70"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2 py-4">
            <Loader2 className="size-6 animate-spin text-brand" />
            <span className="text-xs text-muted-foreground">Uploading to Cloud Storage...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="grid size-10 place-items-center rounded-full bg-surface-2 text-foreground transition-transform group-hover:scale-105">
              <UploadCloud className="size-5 text-brand" />
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">
                Click to browse or drop file here
              </p>
              {helperText && (
                <p className="mt-0.5 text-[11px] text-muted-foreground">{helperText}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {previewUrl && (
        <div className="flex items-center justify-between rounded-xl border border-border bg-surface-2 px-3 py-2 text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
            <span className="truncate font-mono text-[11px] text-muted-foreground">
              {previewUrl}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isVideo && (
              <span className="rounded bg-brand/10 px-1.5 py-0.5 text-[10px] font-mono text-brand">
                Video
              </span>
            )}
            {isPdf && (
              <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-mono text-blue-400">
                PDF
              </span>
            )}
            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-brand hover:underline"
            >
              Preview
            </a>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-destructive">
          <AlertCircle className="size-3.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
