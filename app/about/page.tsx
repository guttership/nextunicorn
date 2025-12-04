import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About NextUnicorn - The Story Behind the Battle Arena for SaaS Ideas",
  description: "Learn how NextUnicorn was created to help entrepreneurs validate startup ideas through community voting. Discover the mission, vision, and the team behind this innovative platform.",
  openGraph: {
    title: "About NextUnicorn - The Story Behind the Battle Arena",
    description: "The mission to democratize startup idea validation through AI and community wisdom.",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400 mb-4 font-mono">
            About NextUnicorn
          </h1>
          <p className="text-xl text-slate-300 font-mono">
            The battle arena where startup ideas compete for validation
          </p>
        </div>

        {/* Mission */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-100 mb-6 font-mono">Our Mission</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300 leading-relaxed mb-4">
              Every day, thousands of entrepreneurs around the world have brilliant ideas for SaaS products. 
              Yet, most of these ideas never see the light of day. Why? Because founders spend months building 
              products that nobody wants, only to discover too late that their assumption was wrong.
            </p>
            <p className="text-slate-300 leading-relaxed mb-4">
              NextUnicorn was born from a simple observation: <strong className="text-pink-400">validation should come before building</strong>. 
              We created a platform where AI-generated SaaS ideas battle against each other in a Tinder-style 
              voting arena, powered by real entrepreneurs who vote on what they'd actually use.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Our mission is to democratize startup idea validation. No more building in the dark. 
              No more guessing what the market wants. Just pure, community-driven validation from 
              people who understand the struggle of entrepreneurship.
            </p>
          </div>
        </section>

        {/* How It Started */}
        <section className="mb-16 bg-slate-800/50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-slate-100 mb-6 font-mono">How It Started</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300 leading-relaxed mb-4">
              The founder of NextUnicorn spent years building SaaS products that failed to gain traction. 
              Three different projects. Six months each. Thousands of hours wasted. The pattern was clear: 
              beautiful code, elegant UI, zero customers.
            </p>
            <p className="text-slate-300 leading-relaxed mb-4">
              The breakthrough came when realizing that <strong className="text-pink-400">the problem wasn't execution—it was idea selection</strong>. 
              Most founders don't lack the skills to build; they lack the data to know what to build.
            </p>
            <p className="text-slate-300 leading-relaxed">
              In November 2024, NextUnicorn was born. The concept was simple but powerful: combine AI's 
              ability to generate endless creative ideas with the wisdom of the crowd to separate winners 
              from losers. A battle arena where ideas fight for survival, and only the strongest rise to the top.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-100 mb-6 font-mono">How NextUnicorn Works</h2>
          <div className="space-y-6">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-pink-400 mb-3 font-mono">1. AI Generation</h3>
              <p className="text-slate-300 leading-relaxed">
                Every day at 2 AM UTC, our AI system generates 10 fresh SaaS ideas using advanced language models. 
                These aren't random concepts—they're carefully crafted ideas based on current market trends, 
                technological capabilities, and real-world pain points. Each idea includes a catchy title, 
                compelling slogan, detailed description, and the original AI prompt used to generate it.
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-pink-400 mb-3 font-mono">2. Community Voting</h3>
              <p className="text-slate-300 leading-relaxed">
                Ideas enter the battle arena where they face off against each other in head-to-head duels. 
                Visitors vote Tinder-style: swipe right to upvote, swipe left to skip. On desktop, it's a 
                side-by-side comparison. On mobile, it's a smooth card-swiping experience. Each vote matters, 
                and the winning ideas accumulate score points that determine their rank.
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-pink-400 mb-3 font-mono">3. Hall of Fame</h3>
              <p className="text-slate-300 leading-relaxed">
                The best ideas rise to the top in our Hall of Fame leaderboard. This isn't just a popularity 
                contest—it's a real-time snapshot of what entrepreneurs find genuinely valuable. Ideas with 
                the most votes prove they have market validation. Founders can browse the leaderboard, see 
                what's trending, and get inspired by concepts that real people want to see built.
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-pink-400 mb-3 font-mono">4. Daily Champion</h3>
              <p className="text-slate-300 leading-relaxed">
                Each day, the previous day's top-voted idea becomes the "Champion" and gets featured prominently 
                in the next day's battles. This creates a dynamic where yesterday's winners must defend their 
                position against fresh challengers. It's survival of the fittest in the startup idea ecosystem.
              </p>
            </div>
          </div>
        </section>

        {/* For Whom */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-100 mb-6 font-mono">Who Is NextUnicorn For?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-pink-400 mb-3 font-mono">🚀 Aspiring Founders</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                You're ready to build your first SaaS but don't know where to start. NextUnicorn gives you 
                validated ideas that real entrepreneurs have already voted on. Skip the guesswork and build 
                something people actually want.
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-pink-400 mb-3 font-mono">💼 Indie Hackers</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                You've shipped products before but struggle with idea validation. Use NextUnicorn as your 
                market research tool. See what's trending, test your own ideas, and tap into the collective 
                wisdom of fellow builders.
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-pink-400 mb-3 font-mono">🎯 Serial Entrepreneurs</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                You're constantly exploring new opportunities. NextUnicorn serves as your daily inspiration 
                feed. Browse hundreds of AI-generated concepts, vote on the best ones, and discover patterns 
                in what the market values.
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-pink-400 mb-3 font-mono">🧑‍💻 Developers</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                You have the technical skills but need direction. Instead of building random side projects, 
                pick ideas that already have community validation. Increase your odds of success by 10x.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-100 mb-8 font-mono">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-slate-100 mb-2 font-mono">Is NextUnicorn really free?</h3>
              <p className="text-slate-300 leading-relaxed">
                Yes! Voting on ideas, browsing the Hall of Fame, and discovering new concepts is 100% free. 
                We monetize through sponsored ideas where early-stage SaaS companies can promote their products 
                to our community of entrepreneurs. You'll see these clearly marked as "sponsored" in the battle arena.
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-slate-100 mb-2 font-mono">Can I submit my own idea?</h3>
              <p className="text-slate-300 leading-relaxed">
                Currently, all ideas are AI-generated to maintain quality and consistency. However, we're exploring 
                a feature where users can submit their ideas for community validation. If you're interested, 
                sign up for our newsletter to be notified when this feature launches.
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-slate-100 mb-2 font-mono">How do you ensure idea quality?</h3>
              <p className="text-slate-300 leading-relaxed">
                We use carefully engineered prompts with advanced AI models (GPT-4, Claude, Gemini) to generate 
                ideas that are both creative and practical. Each idea goes through validation checks for 
                feasibility, market potential, and clarity before entering the arena. Plus, the community voting 
                acts as a natural quality filter—weak ideas get voted down quickly.
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-slate-100 mb-2 font-mono">What if someone steals an idea?</h3>
              <p className="text-slate-300 leading-relaxed">
                Ideas are cheap; execution is everything. The same idea can be built by 100 different people 
                and produce 100 different outcomes. We believe in open idea sharing because validation and 
                community feedback are more valuable than secrecy. If you find an idea you love, the real work 
                begins with building, marketing, and selling it—that's where the value is created.
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-slate-100 mb-2 font-mono">How often are new ideas added?</h3>
              <p className="text-slate-300 leading-relaxed">
                We generate 10 fresh ideas every day at 2 AM UTC. This means you get 300+ new concepts every month. 
                The daily cadence keeps the platform fresh and gives you a constant stream of inspiration without 
                overwhelming you with choices.
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-slate-100 mb-2 font-mono">Can I reserve an idea to build it?</h3>
              <p className="text-slate-300 leading-relaxed">
                Yes! High-scoring ideas in the Hall of Fame can be reserved by serious builders. This prevents 
                multiple people from building the exact same thing and gives you exclusive rights to pursue that 
                concept. Reservation requires verification that you're actively building (GitHub repo, landing page, etc.).
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-slate-100 mb-2 font-mono">What happens to losing ideas?</h3>
              <p className="text-slate-300 leading-relaxed">
                Nothing! They remain in the database and can still be discovered through the Hall of Fame. 
                An idea that loses one battle might win the next. The voting system is designed to surface the 
                best ideas over time, not eliminate possibilities. Every idea gets multiple chances to prove its value.
              </p>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-slate-100 mb-2 font-mono">How can I advertise my SaaS?</h3>
              <p className="text-slate-300 leading-relaxed">
                If you're building a SaaS product and want to get it in front of thousands of entrepreneurs, 
                check out our <Link href="/advertise" className="text-pink-400 hover:underline">advertising page</Link>. 
                For just €50/month, your product gets featured in the battle arena as a sponsored card, driving 
                targeted traffic from our community of builders and founders.
              </p>
            </div>
          </div>
        </section>

        {/* The Vision */}
        <section className="mb-16 bg-gradient-to-r from-pink-900/20 to-rose-900/20 border border-pink-500/30 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-slate-100 mb-6 font-mono">The Vision</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            We envision a future where no entrepreneur wastes months building the wrong thing. Where validation 
            comes first, execution comes second. Where the collective wisdom of thousands of founders helps 
            individual builders make better decisions.
          </p>
          <p className="text-slate-300 leading-relaxed mb-4">
            NextUnicorn is just the beginning. We're building features for idea tracking, builder communities, 
            success story showcases, and more. Our goal is to become the go-to platform where startup ideas 
            are born, validated, and transformed into successful businesses.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Join us on this journey. Vote on ideas. Share your opinions. Build something amazing. 
            Together, we'll discover the next unicorn. 🦄
          </p>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-mono font-bold py-4 px-8 rounded-lg transition-all shadow-lg hover:shadow-pink-500/50"
          >
            Start Voting on Ideas
          </Link>
          <p className="text-slate-400 text-sm mt-4 font-mono">
            Join thousands of entrepreneurs discovering their next project
          </p>
        </div>
      </div>
    </div>
  );
}
