import { WordRotate } from "@/components/magicui/word-rotate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Github,
  Mic,
  Share2,
  Edit3,
  Play,
  Zap,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function DevFmLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white relative overflow-hidden">
      <nav className="border-b border-white/5 fixed w-full top-0 bg-transparent/75 z-50 backdrop-blur-sm">
        <div className="max-w-7xl w-full mx-auto flex gap-10 justify-start sm:justify-between items-center p-4">
          <Link href={"#dev.fm"}>
            <h1 className="fade-pullup text-xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-mono">
              dev.fm
            </h1>
          </Link>
          <div className="flex gap-10 items-center">
            <Link
              className="hover:text-pink-300 text-xs sm:text-sm"
              href={"#features"}
            >
              Features
            </Link>
            <Link
              className="hover:text-pink-300 text-xs sm:text-sm"
              href={"#how-it-works"}
            >
              How it works
            </Link>
          </div>
          <Button className="hidden sm:flex bg-white font-medium cursor-pointer text-black hover:bg-white/90 px-4 py-5 text-sm shadow-lg shadow-pink-600 transition-all duration-300 hover:scale-105">
            <Github className="h-6 w-6" />
            Login
          </Button>
        </div>
      </nav>
      {/* Hero Section */}
      <section
        id="dev.fm"
        className="relative min-h-screen flex pt-32 sm:pt-40 md:pt-40 justify-center px-4 "
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black via-neutral-900 to-black" />
          {/* Gradient Orbs */}
          <div className="animate-orb-1 absolute top-1/3 left-1/5 w-96 h-96 bg-gradient-to-r from-cyan-500/40 to-blue-500/40 rounded-full blur-3xl" />
          <div className="animate-orb-2 absolute bottom-1/2 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/40 to-pink-500/40 rounded-full blur-3xl" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-block">
            <p className="font-bold text-balance fade-pullup-2 text-4xl sm:text-5xl md:text-7xl text-white leading-tight">
              Turn your ideas and insights into engaging{" "}
              <span className="text-white relative text-glow">
                audio podcasts.
                <svg
                  className="absolute -bottom-1 left-0 w-full h-[3px]"
                  viewBox="0 0 100 3"
                  preserveAspectRatio="none"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      id="underlineGradient"
                      x1="0"
                      y1="0"
                      x2="100"
                      y2="0"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#fff" />
                      <stop offset="50%" stopColor="#f0cdeb" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                  <line
                    x1="0"
                    y1="1.5"
                    x2="100"
                    y2="1.5"
                    stroke="url(#underlineGradient)"
                    strokeWidth="3"
                    className="animate-draw-line"
                  />
                </svg>
              </span>
            </p>
            {/* Hand-drawn underline */}
          </div>

          <div className="mt-10 sm:mt-12 md:mt-16">
            <p className="fade-pullup-1 text-balance text-2xl sm:text-3xl md:text-4xl text-green-300 mx-2 mt-6 font-bold">
              For devs who
            </p>
            <WordRotate
              className="text-lg sm:text-xl md:text-2xl text-neutral-200 font-bold"
              words={[
                "want to commit ideas",
                "debug out loud",
                "have more opinions than tabs open",
              ]}
              duration={4000}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center mt-10">
            <p className="border border-white/10 p-2 rounded-md shadow-lg cursor-pointer text-center font-medium items-center fade-pullup-3 text-sm md:text-base text-white">
              <ChevronRight className="inline mr-1 text-pink-400" />
              Continue with GitHub
            </p>
            <p className="text-center font-medium items-center fade-pullup-3 text-sm md:text-base text-white">
              Learn More
              <ChevronDown className="animate-bounce mt-1 inline ml-2" />
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-12 md:py-20 px-4 relative border-t border-white/5"
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

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <Card className="bg-transparent border border-white/10 shadow-lg shadow-neutral-900 transition-all duration-300 group">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="size-12 md:size-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Mic className="size-6 md:size-8 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-4 text-cyan-400">
                  AI-Powered Generation
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                  Generate podcasts from text, project summaries, or technical
                  documentation using advanced AI
                </p>
              </CardContent>
            </Card>

            <Card className="bg-transparent border border-white/10 shadow-lg shadow-neutral-900 transition-all duration-300 group">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="size-12 md:size-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Share2 className="size-6 md:size-8 text-white" />
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
              <CardContent className="p-6 md:p-8 text-center">
                <div className="size-12 md:size-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Edit3 className="size-6 md:size-8 text-white" />
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
      <section
        id="how-it-works"
        className="py-12 md:py-20 px-4 border-y border-white/5"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
              From idea to podcast in just a few simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Github,
                title: "Connect GitHub",
                desc: "Link your GitHub account to get started",
                color: "from-neutral-700 to-neutral-800",
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
                  className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">
                  {step.title}
                </h3>
                <p className="text-neutral-300 leading-relaxed">{step.desc}</p>
                {index < 3 ? (
                  <ArrowRight className="h-6 w-6 text-neutral-300 mx-auto mt-6 hidden md:block" />
                ) : (
                  <CheckCircle className="h-6 w-6 text-green-400 mx-auto mt-6 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Examples Section */}
      <section className="py-12 md:py-20 px-4">
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
      <section className="py-12 md:py-20 px-4 relative border-y border-white/5 ">
        <div className="absolute inset-0" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Start Creating Your Devcast Now
          </h2>
          <p className="text-lg md:text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
            Join thousands of developers sharing their knowledge through
            podcasts. Your next great idea deserves to be heard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="bg-white font-medium cursor-pointer text-black hover:bg-white/90 px-4 py-3 md:px-8 md:py-6 text-xs md:text-sm shadow-lg shadow-pink-600 transition-all duration-300 hover:scale-105">
              <Github className="h-6 w-6" />
              Login with GitHub
            </Button>
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
            </div>
            <div className="flex space-x-6 text-slate-400">
              <Link href="#" className="hover:text-pink-400 transition-colors">
                X
              </Link>
              <Link href="#" className="hover:text-pink-400 transition-colors">
                Instagram
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-neutral-300 text-sm">
            © {new Date().getFullYear()} dev.fm. Built by a developer, for
            developers.
          </div>
        </div>
      </footer>
    </div>
  );
}
