import { useRef, useState } from 'react';

interface Props {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
}

export default function ImageUpload({ files, onChange, maxFiles = 6 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const valid = Array.from(newFiles).filter((f) => f.type.startsWith('image/'));
    const combined = [...files, ...valid].slice(0, maxFiles);
    onChange(combined);
  };

  const removeFile = (idx: number) => {
    onChange(files.filter((_, i) => i !== idx));
  };

  return (
    <div>
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        style={{
          border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 14,
          padding: '32px 24px',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragging ? 'rgba(245,158,11,0.04)' : 'rgba(255,255,255,0.02)',
          transition: 'all .2s ease',
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 10 }}>📸</div>
        <p style={{ fontSize: 14, color: 'var(--txt2)', marginBottom: 4 }}>
          <strong style={{ color: 'var(--accent)' }}>Click to upload</strong> or drag & drop
        </p>
        <p style={{ fontSize: 12, color: 'var(--txt3)' }}>
          PNG, JPG, WEBP up to 10MB · Max {maxFiles} images
        </p>
        <p style={{ fontSize: 12, color: 'var(--txt3)', marginTop: 4 }}>
          {files.length}/{maxFiles} selected
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {/* Previews */}
      {files.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 14 }}>
          {files.map((file, idx) => {
            const url = URL.createObjectURL(file);
            return (
              <div
                key={idx}
                style={{
                  position: 'relative', width: 80, height: 80,
                  borderRadius: 10, overflow: 'hidden',
                  border: idx === 0 ? '2px solid var(--accent)' : '1px solid var(--border)',
                }}
              >
                <img
                  src={url}
                  alt={`Preview ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onLoad={() => URL.revokeObjectURL(url)}
                />
                {idx === 0 && (
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'rgba(245,158,11,0.85)',
                    fontSize: 9, fontWeight: 700, color: '#000',
                    textAlign: 'center', padding: '2px 0',
                  }}>COVER</div>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                  style={{
                    position: 'absolute', top: 4, right: 4,
                    width: 20, height: 20, borderRadius: '50%',
                    background: 'rgba(0,0,0,0.7)', border: 'none',
                    color: '#fff', fontSize: 12, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    lineHeight: 1,
                  }}
                >
                  ✕
                </button>
              </div>
            );
          })}

          {files.length < maxFiles && (
            <div
              onClick={() => inputRef.current?.click()}
              style={{
                width: 80, height: 80, borderRadius: 10,
                border: '1px dashed var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--txt3)', fontSize: 24,
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              +
            </div>
          )}
        </div>
      )}
    </div>
  );
}
