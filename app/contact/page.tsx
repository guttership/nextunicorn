import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us - NextUnicorn",
  description: "Get in touch with the NextUnicorn team. We'd love to hear your feedback, answer your questions, or discuss partnership opportunities.",
  openGraph: {
    title: "Contact Us - NextUnicorn",
    description: "Get in touch with the NextUnicorn team. We'd love to hear your feedback, answer your questions, or discuss partnership opportunities.",
    url: "https://nextunicorn.app/contact",
    siteName: "NextUnicorn",
    locale: "en_US",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
            🦄 NextUnicorn
          </Link>
          <Link href="/" className="text-sm text-slate-400 hover:text-pink-600 transition-colors">
            ← Back to Battle Arena
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
              Get in Touch
            </h1>
            <p className="text-xl text-slate-400">
              We'd love to hear from you! Whether you have feedback, questions, or partnership ideas.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Email Card */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8 space-y-4">
              <div className="text-4xl">📧</div>
              <h2 className="text-2xl font-bold text-pink-600">Email Us</h2>
              <p className="text-slate-400">
                For general inquiries, feedback, or support questions:
              </p>
              <a 
                href="mailto:designmoiunmouton@gmail.com"
                className="inline-block text-lg font-mono text-purple-400 hover:text-purple-300 transition-colors break-all"
              >
                designmoiunmouton@gmail.com
              </a>
            </div>

            {/* Twitter Card */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8 space-y-4">
              <div className="text-4xl">𝕏</div>
              <h2 className="text-2xl font-bold text-pink-600">Follow Us</h2>
              <p className="text-slate-400">
                Connect with us on Twitter/X for updates and discussions:
              </p>
              <a 
                href="https://twitter.com/NextUnicornHQ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-lg font-mono text-purple-400 hover:text-purple-300 transition-colors"
              >
                @NextUnicornHQ
              </a>
            </div>
          </div>

          {/* Advertising & Partnerships */}
          <div className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 border border-pink-800/30 rounded-lg p-8 space-y-4">
            <div className="text-4xl">💼</div>
            <h2 className="text-2xl font-bold text-pink-600">Advertising & Partnerships</h2>
            <p className="text-slate-300">
              Want to reach thousands of entrepreneurs and indie hackers? We offer targeted advertising opportunities to promote your SaaS, tool, or service to our engaged community.
            </p>
            <ul className="space-y-2 text-slate-400">
              <li>• <strong className="text-slate-300">Audience:</strong> 5,000+ monthly entrepreneurs actively looking for new ideas</li>
              <li>• <strong className="text-slate-300">Format:</strong> Banner ads, featured ideas, sponsored content</li>
              <li>• <strong className="text-slate-300">Pricing:</strong> Starting at €50/month for basic placement</li>
            </ul>
            <a 
              href="/advertise"
              className="inline-block px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all"
            >
              View Advertising Options
            </a>
          </div>

          {/* FAQ */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-4">
              <details className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 group">
                <summary className="text-xl font-semibold text-pink-600 cursor-pointer list-none flex items-center justify-between">
                  How can I submit my own idea?
                  <span className="text-slate-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-slate-400">
                  Click the "Submit Your Idea" button on the homepage. Fill in your idea's title, tagline, and description. Our team will review it within 24-48 hours and publish it if it meets our quality guidelines.
                </p>
              </details>

              <details className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 group">
                <summary className="text-xl font-semibold text-pink-600 cursor-pointer list-none flex items-center justify-between">
                  How does the voting system work?
                  <span className="text-slate-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-slate-400">
                  We present two ideas head-to-head. Vote for the one you find most promising. Your vote helps determine each idea's Elo rating, creating a dynamic leaderboard of the most popular SaaS concepts.
                </p>
              </details>

              <details className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 group">
                <summary className="text-xl font-semibold text-pink-600 cursor-pointer list-none flex items-center justify-between">
                  Can I report inappropriate content?
                  <span className="text-slate-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-slate-400">
                  Yes! Email us at <a href="mailto:designmoiunmouton@gmail.com" className="text-purple-400 hover:text-purple-300">designmoiunmouton@gmail.com</a> with the idea ID or title. We take content quality seriously and will review all reports within 24 hours.
                </p>
              </details>

              <details className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 group">
                <summary className="text-xl font-semibold text-pink-600 cursor-pointer list-none flex items-center justify-between">
                  How can I partner with NextUnicorn?
                  <span className="text-slate-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-slate-400">
                  We're open to collaborations! Email us with your proposal, and we'll get back to you within 2-3 business days to discuss opportunities.
                </p>
              </details>

              <details className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 group">
                <summary className="text-xl font-semibold text-pink-600 cursor-pointer list-none flex items-center justify-between">
                  What's your response time?
                  <span className="text-slate-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-slate-400">
                  We typically respond to all emails within 24-48 hours on weekdays. For urgent matters (like inappropriate content reports), we aim to respond within 12 hours.
                </p>
              </details>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center bg-slate-900/50 border border-slate-800 rounded-lg p-8 space-y-4">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
              Ready to Dive In?
            </h2>
            <p className="text-slate-400">
              Join thousands of entrepreneurs discovering the next big thing.
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-lg rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-pink-600/50"
            >
              Start Voting Now →
            </Link>
          </div>

          {/* Legal Footer */}
          <div className="text-center text-sm text-slate-600 space-y-2">
            <p>
              By contacting us, you agree to our{" "}
              <Link href="/cgu" className="text-purple-400 hover:text-purple-300">
                Terms of Service
              </Link>
              {" "}and{" "}
              <Link href="/confidentialite" className="text-purple-400 hover:text-purple-300">
                Privacy Policy
              </Link>
              .
            </p>
            <p>
              NextUnicorn • Made with 💜 by indie hackers, for indie hackers
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
