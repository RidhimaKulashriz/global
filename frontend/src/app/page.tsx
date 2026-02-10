"use client";

import { useState } from "react";

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [location, setLocation] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const API_BASE = "http://localhost:8000";

  async function handleVerify() {
    if (!file) {
      setError("Please select an image first.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      // 1) Get signed URL
      const getUrlRes = await fetch(`${API_BASE}/get-url`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_name: file.name }),
      });

      if (!getUrlRes.ok) {
        throw new Error("Failed to get upload URL");
      }

      const { upload_url, obj } = await getUrlRes.json();

      // 2) Upload file directly to GCS
      const uploadRes = await fetch(upload_url, {
        method: "PUT",
        headers: { "Content-Type": "image/jpeg" },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload image to storage");
      }

      // 3) Call verification endpoint
      const verifyRes = await fetch(`${API_BASE}/result`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          obj,
          location,
          caption,
        }),
      });

      if (!verifyRes.ok) {
        throw new Error("Verification failed");
      }

      const data = await verifyRes.json();
      setResult(data.response);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setFile(f);

    if (f) {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #020617)",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 900,
          width: "100%",
          background: "rgba(15, 23, 42, 0.9)",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
        }}
      >
        {/* Left: Input */}
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
            🌊 CrisisLens – Flood Verification
          </h1>
          <p style={{ color: "#94a3b8", marginBottom: 16 }}>
            Upload a flood image and verify whether it is real, recent, and
            relevant using Gemini 3.
          </p>

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 14, color: "#cbd5f5" }}>
              Upload image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ marginTop: 6 }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 14, color: "#cbd5f5" }}>
              Claimed location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Chennai"
              style={{
                width: "100%",
                marginTop: 6,
                padding: 8,
                borderRadius: 8,
                border: "1px solid #334155",
                background: "#020617",
                color: "white",
              }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 14, color: "#cbd5f5" }}>
              Caption / claim
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g., Flood in Chennai today"
              rows={3}
              style={{
                width: "100%",
                marginTop: 6,
                padding: 8,
                borderRadius: 8,
                border: "1px solid #334155",
                background: "#020617",
                color: "white",
              }}
            />
          </div>

          <button
            onClick={handleVerify}
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 10,
              border: "none",
              background: loading ? "#334155" : "#2563eb",
              color: "white",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: 8,
            }}
          >
            {loading ? "Verifying..." : "Verify with CrisisLens"}
          </button>

          {error && (
            <p style={{ color: "#f87171", marginTop: 12 }}>{error}</p>
          )}
        </div>

        {/* Right: Preview + Result */}
        <div>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>Preview</h2>

          {previewUrl ? (
            <img
              src={previewUrl}
              alt="preview"
              style={{
                width: "100%",
                borderRadius: 12,
                marginBottom: 16,
                border: "1px solid #334155",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: 200,
                borderRadius: 12,
                border: "1px dashed #334155",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
                marginBottom: 16,
              }}
            >
              No image selected
            </div>
          )}

          <h2 style={{ fontSize: 18, marginBottom: 8 }}>Result</h2>

          <div
            style={{
              background: "#020617",
              border: "1px solid #334155",
              borderRadius: 12,
              padding: 12,
              minHeight: 160,
              fontSize: 14,
              color: "#e5e7eb",
              overflow: "auto",
              whiteSpace: "pre-wrap",
            }}
          >
            {result ? JSON.stringify(result, null, 2) : "No result yet."}
          </div>
        </div>
      </div>
    </main>
  );
}

