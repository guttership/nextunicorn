"use client";

import { useCallback, useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";

interface PendingAd {
  id: number;
  saasName: string;
  logoUrl: string;
  targetUrl: string;
  customerEmail: string;
  createdAt: string;
}

export default function ModeratePage() {
  const [pendingAds, setPendingAds] = useState<PendingAd[]>([]);
  const [password, setPassword] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadPendingAds = useCallback(async (secret: string) => {
    const response = await fetch("/api/admin/pending-ads", {
      headers: { "x-admin-secret": secret },
    });

    if (!response.ok) {
      setIsAuthenticated(false);
      setAdminSecret("");
      return false;
    }

    const data = await response.json();
    setPendingAds(data.ads || []);
    return true;
  }, []);

  const checkAuth = async () => {
    const isValid = await loadPendingAds(password);
    if (isValid) {
      setAdminSecret(password);
      setIsAuthenticated(true);
    }
  };

  useEffect(() => {
    if (isAuthenticated && adminSecret) {
      void loadPendingAds(adminSecret);
    }
  }, [adminSecret, isAuthenticated, loadPendingAds]);

  const handleApprove = async (id: number) => {
    await fetch("/api/admin/approve-ad", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": adminSecret },
      body: JSON.stringify({ id, approved: true }),
    });
    setPendingAds(pendingAds.filter((ad) => ad.id !== id));
  };

  const handleReject = async (id: number) => {
    await fetch("/api/admin/approve-ad", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": adminSecret },
      body: JSON.stringify({ id, approved: false }),
    });
    setPendingAds(pendingAds.filter((ad) => ad.id !== id));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <Card className="p-8 bg-slate-900 border-slate-700">
          <h1 className="text-2xl font-bold mb-4">Admin - Modération</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe admin"
            className="w-full p-2 bg-slate-800 border border-slate-700 rounded mb-4"
          />
          <Button onClick={checkAuth} className="w-full">
            Se connecter
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-pink-600 font-mono">
            🛡️ MODÉRATION PUBLICITÉS
          </h1>
          <div className="text-sm font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded">
            {pendingAds.length} en attente
          </div>
        </div>
        
        {pendingAds.length === 0 ? (
          <Card className="p-12 bg-slate-800/50 border-slate-700 text-center">
            <div className="text-6xl mb-4">✓</div>
            <p className="text-slate-300 font-mono">Aucune publicité en attente de modération</p>
          </Card>
        ) : (
          <div className="grid gap-6">
            {pendingAds.map((ad) => (
              <Card key={ad.id} className="p-6 bg-slate-800/30 border-slate-700 hover:border-pink-500/50 transition-all">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Logo */}
                  <div className="shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ad.logoUrl}
                      alt={ad.saasName}
                      className="w-32 h-32 object-contain bg-slate-700/50 p-4 rounded border border-slate-600"
                    />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold mb-4 text-white font-mono">
                      {ad.saasName}
                    </h2>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-pink-400 font-bold text-xs">LOGO URL</span>
                        <a
                          href={ad.logoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-300 hover:underline font-mono break-all bg-slate-700/30 p-2 rounded"
                        >
                          {ad.logoUrl}
                        </a>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-pink-400 font-bold text-xs">TARGET URL</span>
                        <a
                          href={ad.targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-300 hover:underline font-mono break-all bg-slate-700/30 p-2 rounded"
                        >
                          {ad.targetUrl}
                        </a>
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-pink-400 font-bold text-xs">EMAIL</span>
                        <span className="text-slate-200 font-mono bg-slate-700/30 p-2 rounded">{ad.customerEmail}</span>
                      </div>
                      
                      <div className="flex flex-col gap-1 pt-2">
                        <span className="font-mono text-pink-400 font-bold text-xs">DATE DE SOUMISSION</span>
                        <span className="text-slate-300 font-mono bg-slate-700/30 p-2 rounded">
                          {new Date(ad.createdAt).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex md:flex-col gap-3 w-full md:w-auto">
                    <Button
                      onClick={() => handleApprove(ad.id)}
                      className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 font-mono font-bold text-white"
                    >
                      ✓ APPROUVER
                    </Button>
                    <Button
                      onClick={() => handleReject(ad.id)}
                      variant="destructive"
                      className="flex-1 md:flex-none font-mono font-bold bg-red-600 hover:bg-red-700 text-white"
                    >
                      ✗ REJETER
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
