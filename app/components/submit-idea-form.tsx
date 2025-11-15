"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Language } from "@/app/lib/i18n";

interface SubmitIdeaFormProps {
  lang: Language;
  onClose: () => void;
}

export default function SubmitIdeaForm({ lang, onClose }: SubmitIdeaFormProps) {
  const [title, setTitle] = useState("");
  const [slogan, setSlogan] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/ideas/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slogan, description }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTitle("");
        setSlogan("");
        setDescription("");
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 3000);
      } else {
        setError(result.error || "Submission failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="bg-slate-900 border-slate-800 max-w-2xl w-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-mono text-slate-100">
                {lang === "fr" ? "Soumettre une idée" : "Submit an idea"}
              </CardTitle>
              <CardDescription className="text-sm font-mono text-slate-400 mt-2">
                {lang === "fr" 
                  ? "Votre idée sera modérée par IA avant publication" 
                  : "Your idea will be AI-moderated before publication"}
              </CardDescription>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 text-2xl"
            >
              ×
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✓</div>
              <p className="text-xl text-green-400 font-mono">
                {lang === "fr" 
                  ? "Idée soumise avec succès !" 
                  : "Idea submitted successfully!"}
              </p>
              <p className="text-sm text-slate-400 mt-2">
                {lang === "fr" 
                  ? "Nous la modérons et elle apparaîtra bientôt" 
                  : "We're reviewing it and it will appear soon"}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-mono text-slate-300 mb-2">
                  {lang === "fr" ? "Nom du produit" : "Product name"}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  maxLength={50}
                  placeholder={lang === "fr" ? "Ex: TaskFlow Pro" : "e.g. TaskFlow Pro"}
                  className="w-full bg-slate-800 border-slate-700 text-slate-100 rounded px-4 py-2 font-mono text-sm focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-mono text-slate-300 mb-2">
                  {lang === "fr" ? "Slogan accrocheur" : "Catchy slogan"}
                </label>
                <input
                  type="text"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  required
                  maxLength={100}
                  placeholder={lang === "fr" ? "Ex: Gérez vos tâches 10x plus vite" : "e.g. Manage tasks 10x faster"}
                  className="w-full bg-slate-800 border-slate-700 text-slate-100 rounded px-4 py-2 font-mono text-sm focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-mono text-slate-300 mb-2">
                  {lang === "fr" ? "Description" : "Description"}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  maxLength={300}
                  rows={4}
                  placeholder={lang === "fr" 
                    ? "Décrivez le problème résolu et la valeur apportée (1-2 phrases)" 
                    : "Describe the problem solved and value provided (1-2 sentences)"}
                  className="w-full bg-slate-800 border-slate-700 text-slate-100 rounded px-4 py-2 font-mono text-sm focus:outline-none focus:border-pink-500 resize-none"
                />
                <p className="text-xs text-slate-500 mt-1 text-right">
                  {description.length}/300
                </p>
              </div>

              {error && (
                <p className="text-red-400 text-sm font-mono">{error}</p>
              )}

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-mono font-bold py-3 rounded-lg disabled:opacity-50"
                >
                  {submitting 
                    ? (lang === "fr" ? "Envoi..." : "Submitting...") 
                    : (lang === "fr" ? "Soumettre" : "Submit")}
                </Button>
                <Button
                  type="button"
                  onClick={onClose}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-mono py-3 px-6 rounded-lg"
                >
                  {lang === "fr" ? "Annuler" : "Cancel"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
