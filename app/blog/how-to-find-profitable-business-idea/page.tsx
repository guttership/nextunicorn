"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import Link from "next/link";
import { Language, detectLanguage } from "@/app/lib/i18n";
import { LanguageSelector } from "@/app/components/language-selector";
import { ArrowLeft, Calendar, Clock, CheckCircle2 } from "lucide-react";

export default function BlogPostHowToFind() {
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {
    setLang(detectLanguage());
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 text-slate-400 hover:text-pink-500 transition-colors font-mono text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>Blog</span>
          </Link>
          <LanguageSelector lang={lang} setLang={setLang} />
        </div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 py-12 pb-24">
        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-slate-500 font-mono mb-6">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            November 18, 2025
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            10 min
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 bg-clip-text text-transparent">
          How to Find a Profitable Business Idea in 2025
        </h1>

        <p className="text-lg text-slate-300 mb-8 leading-relaxed">
          Most entrepreneurs fail not from lack of execution, but because they solve the wrong problem. 
          Here&apos;s the complete method to identify, validate, and launch an idea that generates recurring revenue.
        </p>

        {/* Content */}
        <div className="prose prose-invert prose-pink max-w-none">
          <h2 className="text-2xl font-bold text-slate-200 mt-8 mb-4">❌ The 3 Fatal Mistakes</h2>
          
          <Card className="bg-red-900/20 border-red-800/50 mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4 text-slate-300">
                <p><strong className="text-red-400">1. "I have a great idea!"</strong> → You haven't validated if anyone would pay for it</p>
                <p><strong className="text-red-400">2. "I'll build first, sell later"</strong> → 6 months of dev, 0 customers</p>
                <p><strong className="text-red-400">3. "My product will sell itself"</strong> → Distribution &gt; Product, always</p>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold text-slate-200 mt-12 mb-4">✅ The 5-Step Method</h2>

          <div className="space-y-8">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-pink-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-pink-400 mb-2">Step 1: Identify YOUR problems</h3>
                    <p className="text-slate-300 mb-4">
                      The best ideas come from problems you personally have. Why?
                    </p>
                    <ul className="space-y-2 text-slate-300">
                      <li>→ You understand the problem intimately</li>
                      <li>→ You're your first customer (free validation)</li>
                      <li>→ You already know the solution that would satisfy YOU</li>
                      <li>→ You have access to similar people</li>
                    </ul>
                    <div className="mt-4 p-4 bg-slate-800/50 rounded">
                      <p className="text-sm text-slate-400 mb-2"><strong>Practical exercise:</strong></p>
                      <p className="text-sm text-slate-300">
                        List 10 things that frustrate you in your daily work. 
                        For each, ask: "How much would I pay to not have this problem anymore?"
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-pink-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-pink-400 mb-2">Step 2: Validate BEFORE coding</h3>
                    <p className="text-slate-300 mb-4">
                      Don't touch your code editor until you've validated these 3 things:
                    </p>
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-800/50 rounded">
                        <h4 className="font-bold text-slate-200 mb-2">A. The problem really exists</h4>
                        <p className="text-slate-300 text-sm mb-2">Talk to 20 people who potentially have this problem:</p>
                        <ul className="space-y-1 text-slate-300 text-sm">
                          <li>• "Tell me about the last time you had [problem]"</li>
                          <li>• "How do you currently handle this?"</li>
                          <li>• "How much time/money does it cost you?"</li>
                        </ul>
                        <p className="text-pink-400 text-sm mt-2">→ If 15/20 confirm the problem: GO</p>
                      </div>

                      <div className="p-4 bg-slate-800/50 rounded">
                        <h4 className="font-bold text-slate-200 mb-2">B. People PAY to solve it</h4>
                        <p className="text-slate-300 text-sm mb-2">
                          "It's annoying but free" ≠ Business. Check:
                        </p>
                        <ul className="space-y-1 text-slate-300 text-sm">
                          <li>• Do paid solutions already exist?</li>
                          <li>• Are people using workaround tools?</li>
                          <li>• Does the problem cost measurable money/time?</li>
                        </ul>
                        <p className="text-pink-400 text-sm mt-2">→ If yes: the market exists</p>
                      </div>

                      <div className="p-4 bg-slate-800/50 rounded">
                        <h4 className="font-bold text-slate-200 mb-2">C. You can reach these people</h4>
                        <p className="text-slate-300 text-sm mb-2">
                          Best idea without distribution = $0. Before starting:
                        </p>
                        <ul className="space-y-1 text-slate-300 text-sm">
                          <li>• Where do your potential customers hang out? (Reddit, LinkedIn, forums...)</li>
                          <li>• Can you contact them directly?</li>
                          <li>• Do you have access to an existing audience?</li>
                        </ul>
                        <p className="text-pink-400 text-sm mt-2">→ Distribution &gt; Product, always</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-pink-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-pink-400 mb-2">Step 3: Sell BEFORE building</h3>
                    <p className="text-slate-300 mb-4">
                      The ultimate test: get people to pay for a product that doesn't exist yet.
                    </p>
                    <div className="space-y-3 text-slate-300">
                      <div className="p-4 bg-gradient-to-r from-pink-900/20 to-rose-900/20 border border-pink-800/30 rounded">
                        <p className="font-bold text-pink-300 mb-2">Pre-sale protocol:</p>
                        <ol className="space-y-2 text-sm">
                          <li><strong>Day 1-2</strong>: Basic landing page (problem + solution + pricing + "Beta access")</li>
                          <li><strong>Day 3-5</strong>: Post on 5 places where your customers hang out</li>
                          <li><strong>Day 6-10</strong>: Contact 50 people directly (cold email/DM)</li>
                          <li><strong>Day 11-14</strong>: Analyze results</li>
                        </ol>
                      </div>
                      <p className="text-sm">
                        <strong className="text-pink-400">Golden rule:</strong> If you don't have at least 3 pre-sales 
                        at $50+ after 2 weeks → The idea isn't worth developing.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-pink-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-pink-400 mb-2">Step 4: MVP in 2 weeks max</h3>
                    <p className="text-slate-300 mb-4">
                      Got pre-sales? Perfect. Now build the MINIMUM to deliver value.
                    </p>
                    <div className="space-y-3 text-slate-300 text-sm">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-red-900/20 border border-red-800/50 rounded">
                          <p className="font-bold text-red-400 mb-2">❌ NOT an MVP:</p>
                          <ul className="space-y-1">
                            <li>• Auth with OAuth + email + 2FA</li>
                            <li>• Pixel-perfect design</li>
                            <li>• 15 "just in case" features</li>
                            <li>• Complete unit tests</li>
                            <li>• Multi-language from day 1</li>
                          </ul>
                        </div>
                        <div className="p-4 bg-green-900/20 border border-green-800/50 rounded">
                          <p className="font-bold text-green-400 mb-2">✅ AN MVP:</p>
                          <ul className="space-y-1">
                            <li>• ONE core feature</li>
                            <li>• Simple auth (email + password)</li>
                            <li>• Clean but basic design</li>
                            <li>• Basic Stripe Checkout</li>
                            <li>• English only</li>
                          </ul>
                        </div>
                      </div>
                      <p className="text-pink-400 mt-4">
                        <strong>Goal:</strong> Deliver to first 3 customers in 2 weeks. 
                        Not in 2 months. Not "when it's perfect". In 2 weeks.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-pink-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-pink-400 mb-2">Step 5: Iterate with REAL customers</h3>
                    <p className="text-slate-300 mb-4">
                      Your first 3-10 customers are GOLD. They tell you exactly what to build.
                    </p>
                    <div className="space-y-3 text-slate-300 text-sm">
                      <p><strong className="text-pink-400">Week 1 post-launch:</strong></p>
                      <ul className="space-y-2 ml-4">
                        <li>• Call with each customer (30 min): how they use the product</li>
                        <li>• Note the 3 most requested features</li>
                        <li>• Identify major friction points</li>
                      </ul>
                      <p className="mt-4"><strong className="text-pink-400">Weeks 2-4:</strong></p>
                      <ul className="space-y-2 ml-4">
                        <li>• Fix blocking bugs immediately</li>
                        <li>• Add ONE feature requested by 80% of users</li>
                        <li>• Ignore everything not requested by the majority</li>
                      </ul>
                      <div className="mt-4 p-4 bg-slate-800/50 rounded">
                        <p className="font-bold text-slate-200 mb-2">Fast iteration cycle:</p>
                        <p>Ship → Feedback → Fix → Ship → Repeat</p>
                        <p className="text-pink-400 mt-2">Goal: 1 release/week minimum for 3 months</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-bold text-slate-200 mt-12 mb-4">💰 Pricing: The $1M Question</h2>
          
          <Card className="bg-slate-900/50 border-slate-800 mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4 text-slate-300">
                <p className="font-bold text-pink-400">Rule #1: Charge from day 1</p>
                <p className="text-sm">
                  A free product will NEVER be taken seriously. You won't get real feedback. 
                  People only value what they pay for.
                </p>
                
                <p className="font-bold text-pink-400 mt-6">Rule #2: Start higher than you think</p>
                <div className="text-sm space-y-2">
                  <p>Multiply your "comfortable" price by 3. Seriously.</p>
                  <ul className="ml-4 space-y-1">
                    <li>• You think $10/month? → Try $30</li>
                    <li>• You think $50/month? → Try $150</li>
                    <li>• You think $200/month? → Try $600</li>
                  </ul>
                  <p className="text-pink-400 mt-2">
                    If nobody says "it's too expensive", it's too cheap.
                  </p>
                </div>

                <p className="font-bold text-pink-400 mt-6">Rule #3: Price based on VALUE, not cost</p>
                <div className="text-sm">
                  <p className="mb-2">Your SaaS saves 5h/week for a dev paid $50/h?</p>
                  <p className="text-pink-400">→ Value = $250/week = $1000/month</p>
                  <p className="mt-2">You can charge $200-400/month easily, even if your costs = $5/month.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-pink-500/30">
            <CardContent className="pt-6 text-center">
              <p className="text-slate-300 mb-4">
                Need inspiration for your next idea? Discover hundreds of validated ideas on NextUnicorn.
              </p>
              <Link 
                href="/"
                className="inline-block bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold py-3 px-6 rounded transition-all"
              >
                See today's ideas →
              </Link>
            </CardContent>
          </Card>
        </div>
      </article>
    </div>
  );
}
