"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/app/components/ui/button";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      window.location.href = "/leaderboard";
    }
  }, [countdown]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-slate-900 border-2 border-green-500 rounded-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>

          <h1 className="text-4xl font-bold text-green-500 mb-4 font-mono">
            RÉSERVATION CONFIRMÉE !
          </h1>

          <p className="text-lg text-slate-300 mb-6 font-mono">
            Merci pour votre achat ! L&apos;idée vous a été réservée et a été retirée du site.
          </p>

          <div className="bg-slate-800 border border-slate-700 rounded p-4 mb-6">
            <p className="text-sm text-slate-400 font-mono mb-2">
              Vous allez recevoir un email de confirmation avec tous les détails de votre idée.
            </p>
            {sessionId && (
              <p className="text-xs text-slate-500 font-mono">
                Session ID: {sessionId}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <p className="text-slate-400 font-mono text-sm">
              Redirection automatique dans {countdown} secondes...
            </p>

            <Link href="/leaderboard">
              <Button className="bg-pink-600 hover:bg-pink-700 text-white font-mono font-bold">
                RETOUR AU CLASSEMENT
                <ArrowRight className="w-4 h-4 ml-2 inline" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-pink-500 hover:text-pink-400 font-mono text-sm">
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ReservationSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-pink-500 font-mono">Chargement...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
