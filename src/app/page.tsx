import { WordRotate } from "@/components/magicui/word-rotate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Github,
  Mic,
  Share2,
  Edit3,
  Play,
  Users,
  Zap,
  ArrowRight,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

export default function DevFmLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white relative overflow-hidden">
      <nav className="border-b border-white/5 hidden sm:flex w-full gap-10 items-center justify-center p-4 fixed top-0 bg-transparent/75 z-50 backdrop-blur-sm">
        <Link
          className="hover:text-pink-300 border-b border-b-pink-300"
          href={"#dev.fm"}
        >
          dev.fm
        </Link>
        <Link className="hover:text-pink-300" href={"#features"}>
          Features
        </Link>
        <Link className="hover:text-pink-300" href={"#how-it-works"}>
          How it works
        </Link>
      </nav>

      {/* Hero Section */}
      <section
        id="dev.fm"
        className="relative min-h-screen flex items-center justify-center px-4 "
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black via-neutral-900 to-black" />
          {/* Gradient Orbs */}
          <div className="animate-orb-1 absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl" />
          <div className="animate-orb-2 absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="relative inline-block">
              <h1 className="fade-pullup text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 font-mono">
                dev.fm
              </h1>
              {/* Hand-drawn underline */}
              <svg
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-full h-4"
                viewBox="0 0 300 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 15C50 12 100 8 150 10C200 12 250 16 290 14"
                  stroke="url(#underlineGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  className="animate-draw-underline"
                />
                <defs>
                  <linearGradient
                    id="underlineGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <p className="fade-pullup-1 text-balance text-lg md:text-3xl text-green-300 mx-2 mt-6 font-bold">
              For devs who
            </p>
            <WordRotate
              className="text-lg md:text-3xl text-neutral-200 font-bold"
              words={[
                "want to commit ideas",
                "debug out loud",
                "have more opinions than tabs open",
              ]}
              duration={4000}
            />
          </div>

          <div className="relative outline outline-white/10 shadow-[0_0_6px_#f472b6] rounded-2xl p-6 mb-8 bg-black/20 backdrop-blur-xl max-w-xl mx-auto">
            <p className="text-balance fade-pullup-2 text-sm sm:text-base md:text-xl text-white leading-relaxed">
              Turn your ideas and insights into engaging{" "}
              <span className="text-yellow-400">audio podcasts</span>. Share
              your voice with the dev community.
            </p>
          </div>

          <Button className="bg-white font-medium cursor-pointer text-pink-600 hover:bg-white/90 px-4 py-3 md:px-8 md:py-6 text-xs md:text-sm shadow-lg shadow-pink-600 transition-all duration-300 hover:scale-105">
            <Github className="h-6 w-6" />
            Login with GitHub
          </Button>
          <p className="text-center font-medium items-center fade-pullup-3 text-sm md:text-base text-pink-400 mt-10">
            Learn More
            <ChevronDown className="animate-bounce mt-1 inline ml-2" />
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-4 relative border-t border-white/5"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-cyan-500">
              Features Built for Developers
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Everything you need to create, edit, and share your developer
              podcasts
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-transparent border border-white/10 shadow-lg shadow-neutral-900 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Mic className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-cyan-400">
                  AI-Powered Generation
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Generate podcasts from text, project summaries, or technical
                  documentation using advanced AI
                </p>
              </CardContent>
            </Card>

            <Card className="bg-transparent border border-white/10 shadow-lg shadow-neutral-900 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Share2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-purple-400">
                  Dev Community Sharing
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Share your podcasts directly with the developer community and
                  discover content from fellow devs
                </p>
              </CardContent>
            </Card>

            <Card className="bg-transparent border border-white/10 shadow-lg shadow-neutral-900 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Edit3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-green-400">
                  Built-in Audio Editor
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Fine-tune your podcasts with our integrated audio editor
                  designed for developers
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              From idea to podcast in just a few simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Github,
                title: "Connect GitHub",
                desc: "Link your GitHub account to get started",
                color: "from-cyan-500 to-blue-500",
              },
              {
                icon: Edit3,
                title: "Input Content",
                desc: "Paste your project README, blog post, or technical notes",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Zap,
                title: "AI Generation",
                desc: "Our AI transforms your content into engaging podcast script",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: Play,
                title: "Publish & Share",
                desc: "Review, edit, and share your podcast with the community",
                color: "from-pink-500 to-purple-500",
              },
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div
                  className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <step.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  {step.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                {index < 3 && (
                  <ArrowRight className="h-6 w-6 text-slate-600 mx-auto mt-6 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Examples Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Join the Developer Community
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              See what fellow developers are creating and sharing
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "React Hooks Deep Dive",
                author: "@sarah_dev",
                topic: "Frontend",
                plays: "2.3k",
              },
              {
                title: "Building Scalable APIs",
                author: "@mike_backend",
                topic: "Backend",
                plays: "1.8k",
              },
              {
                title: "ML Model Deployment",
                author: "@ai_researcher",
                topic: "Machine Learning",
                plays: "3.1k",
              },
            ].map((example, index) => (
              <Card
                key={index}
                className=" transition-all duration-300 group bg-transparent border border-white/10 shadow-lg shadow-neutral-900"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1 rounded-full">
                      {example.topic}
                    </span>
                    <div className="flex items-center text-slate-400 text-sm">
                      <Play className="h-4 w-4 mr-1" />
                      {example.plays}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white group-hover:text-cyan-400 transition-colors">
                    {example.title}
                  </h3>
                  <p className="text-slate-400 text-sm">by {example.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative border-y border-white/5 ">
        <div className="absolute inset-0" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Start Creating Your Devcast Now
          </h2>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Join thousands of developers sharing their knowledge through
            podcasts. Your next great idea deserves to be heard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:shadow-cyan-500/40 hover:scale-105">
              <Github className="mr-3 h-6 w-6" />
              Get Started with GitHub
            </Button>
            <Button
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 px-8 py-6 text-lg rounded-xl"
            >
              <Users className="mr-3 h-5 w-5" />
              Explore Community
            </Button>
          </div>

          <div className="flex items-center justify-center mt-8 text-slate-400 text-sm">
            <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
            Free to start • No credit card required
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-mono">
                dev.fm
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                for devs who have something to say
              </p>
            </div>
            <div className="flex space-x-6 text-slate-400">
              <Link href="#" className="hover:text-cyan-400 transition-colors">
                About
              </Link>
              <Link href="#" className="hover:text-cyan-400 transition-colors">
                Community
              </Link>
              <Link href="#" className="hover:text-cyan-400 transition-colors">
                API
              </Link>
              <Link href="#" className="hover:text-cyan-400 transition-colors">
                Support
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
            © 2024 dev.fm. Built by developers, for developers.
          </div>
        </div>
      </footer>
    </div>
  );
}
