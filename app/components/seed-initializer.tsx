"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";

export function SeedInitializer() {
  const [isSeeded, setIsSeeded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAndSeed();
  }, []);

  const checkAndSeed = async () => {
    try {
      const response = await fetch("/api/seed");
      if (response.ok) {
        setIsSeeded(true);
      }
    } catch (error) {
      console.error("Seed check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const manualSeed = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/seed");
      const data = await response.json();
      if (data.success) {
        setIsSeeded(true);
        alert(`Successfully initialized ${data.count} ideas`);
      }
    } catch (error) {
      console.error("Seed failed:", error);
      alert("Failed to seed ideas. Check console for errors.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
        Initializing...
      </div>
    );
  }

  if (isSeeded) {
    return null;
  }

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-center justify-between">
      <p className="text-yellow-800">
        No ideas found. Click below to generate today&apos;s ideas.
      </p>
      <Button onClick={manualSeed} disabled={isLoading} variant="outline">
        Initialize Ideas
      </Button>
    </div>
  );
}
