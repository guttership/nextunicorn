'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-900 via-black to-black px-4">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full">
            <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-2">
          Paiement réussi !
        </h1>

        {/* Message */}
        <p className="text-gray-300 mb-6">
          Votre annonce est maintenant active et apparaîtra sur NextUnicorn. Merci de votre soutien !
        </p>

        {/* Session ID */}
        {sessionId && (
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 mb-6 text-left">
            <p className="text-xs text-gray-400 mb-2">Session ID:</p>
            <p className="text-sm text-gray-300 font-mono break-all">{sessionId}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-linear-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
          >
            Voir les idées
          </Link>
          <Link
            href="/advertise"
            className="block w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
          >
            Acheter une autre annonce
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-900 via-black to-black">
        <div className="text-white">Chargement...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
