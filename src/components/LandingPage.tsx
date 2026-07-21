import { motion } from "motion/react";
import { Heart, Shield, MessageCircle, ArrowRight, Compass, Sparkles, BookOpen, Quote, HelpCircle, Check } from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: <Compass className="w-6 h-6 text-[#D4A373]" />,
      title: "Attachment Style Assessment",
      description: "Complete an educational self-reflection questionnaire inspired by modern attachment theory to map your relationship behaviors."
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-[#D4A373]" />,
      title: "Personalized AI Coaching",
      description: "Chat with Eunoia, an empathetic relationship coach that tailors every suggestion to your unique attachment tendencies and love language."
    },
    {
      icon: <Shield className="w-6 h-6 text-[#D4A373]" />,
      title: "Secure Emotional Journal",
      description: "Log your daily relationship experiences and receive instant AI analysis of emotional trends, intimacy fears, and self-care cues."
    },
    {
      icon: <Heart className="w-6 h-6 text-[#D4A373]" />,
      title: "Active Growth Goals",
      description: "Formulate healthy boundaries, work on reassuring communication, and visually map your relationship milestones."
    }
  ];

  const steps = [
    {
      num: "01",
      title: "Reflect",
      description: "Take our structured 35-question self-reflection assessment measuring emotional trust, independence, and intimacy."
    },
    {
      num: "02",
      title: "Understand",
      description: "Unlock an in-depth breakdown of your relationship blueprint, including strengths, blind spots, and communication habits."
    },
    {
      num: "03",
      title: "Grow",
      description: "Work daily with Eunoia on interactive challenges, emotional logging, and therapeutic goals designed for your unique attachment profile."
    }
  ];

  const testimonials = [
    {
      text: "Eunoia completely transformed how my partner and I handle misunderstandings. Understanding my anxious attachment style was a massive breakthrough.",
      author: "Juliana K.",
      role: "User since 2025"
    },
    {
      text: "The combination of the daily journal insights and Eunoia's gentle AI feedback feels like a high-end emotional sanctuary. It's incredibly grounding.",
      author: "Marcus V.",
      role: "Subscribed member"
    },
    {
      text: "As someone who tends to avoid conflicts, Eunoia taught me to express my boundaries clearly without feeling overwhelmed or wanting to withdraw.",
      author: "David L.",
      role: "Tech Professional"
    }
  ];

  const faqs = [
    {
      question: "Is Eunoia a replacement for couples or individual therapy?",
      answer: "No. Eunoia is an educational self-reflection platform inspired by attachment theory. It acts as an empathetic guide and coach. It does not diagnose mental health conditions, prescribe clinical care, or replace licensed professional therapy."
    },
    {
      question: "How accurate is the attachment assessment?",
      answer: "The assessment is inspired by scientific attachment research but is structured as an educational tool for self-awareness. It provides customized guidance based on how you score in trust, intimacy fear, communication, and independence, helping you reflect constructively on your relationship dynamics."
    },
    {
      question: "Is my personal data and journal history secure?",
      answer: "Absolutely. All your journal entries, assessment scores, and conversations are safely managed with client-side isolation and standard server-side processing. We do not sell or expose your personal entries to advertising networks."
    },
    {
      question: "Can I use Eunoia if I'm currently single?",
      answer: "Yes! Eunoia is perfect for personal self-discovery. Map your past relationship patterns, learn how to build secure connections, and work on self-soothing strategies before entering your next chapter."
    }
  ];

  return (
    <div id="landing-container" className="min-h-screen bg-[#111111] text-gray-100 overflow-x-hidden font-sans relative">
      {/* Background radial glowing gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#6B0F1A]/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-[#8E2430]/10 rounded-full blur-[130px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[450px] h-[450px] bg-[#D4A373]/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Luxury Navbar */}
      <nav id="landing-nav" className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-[#1B1B1B]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6B0F1A] to-[#D4A373] p-[2px] shadow-lg shadow-[#6B0F1A]/20">
            <div className="w-full h-full bg-[#111111] rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-[#D4A373] fill-[#D4A373]/20" />
            </div>
          </div>
          <div>
            <span className="text-xl font-semibold tracking-wider text-white">EUNOIA</span>
            <p className="text-[9px] text-[#D4A373] tracking-widest uppercase font-mono">Wellness Coach</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            id="nav-login-btn"
            onClick={onGetStarted}
            className="text-sm font-medium text-gray-300 hover:text-white transition duration-200"
          >
            Sign In
          </button>
          <button 
            id="nav-signup-btn"
            onClick={onGetStarted}
            className="px-5 py-2.5 rounded-full text-sm font-medium bg-gradient-to-r from-[#6B0F1A] to-[#8E2430] hover:from-[#8E2430] hover:to-[#6B0F1A] text-white shadow-md shadow-[#6B0F1A]/30 border border-[#D4A373]/20 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Begin Journey
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero-section" className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          {/* Subtle elegant pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B1B1B] border border-white/5 text-xs text-[#D4A373] font-mono tracking-wide mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Relationship Self-Awareness
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white max-w-4xl leading-tight">
            Understand Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4A373] via-[#8E2430] to-[#D4A373] font-medium">Attachment Style</span>. <br />
            Build Healthier Connections.
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
            Discover how you connect with others through structured, AI-powered relationship coaching inspired by attachment theory and emotional wellness.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <button
              id="hero-get-started-btn"
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-full font-medium bg-gradient-to-r from-[#6B0F1A] via-[#8E2430] to-[#6B0F1A] hover:bg-gradient-to-l text-white shadow-xl shadow-[#6B0F1A]/40 border border-[#D4A373]/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 group text-base"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              id="hero-learn-more-link"
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-4 rounded-full font-medium bg-[#1B1B1B] hover:bg-white/5 text-gray-300 hover:text-white transition-all duration-300 border border-white/5 flex items-center justify-center gap-2"
            >
              Learn More
            </a>
          </div>

          {/* Premium mockup visual placeholder */}
          <div className="mt-16 w-full max-w-5xl rounded-2xl bg-gradient-to-b from-[#1B1B1B] to-[#111111] border border-white/5 p-4 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4A373]/30 to-transparent" />
            <div className="aspect-[16/9] rounded-xl bg-[#111111] overflow-hidden flex flex-col items-center justify-center border border-white/5 relative p-6 sm:p-12">
              <div className="absolute inset-0 bg-radial-gradient from-[#6B0F1A]/20 to-transparent pointer-events-none" />
              <div className="relative z-10 text-left w-full h-full flex flex-col justify-between">
                {/* Visual header mock */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#8E2430]" />
                    <span className="text-xs font-mono text-gray-500">EUNOIA COACH SESSION</span>
                  </div>
                  <span className="text-xs font-mono text-[#D4A373]">STATUS: PREVIEW ACTIVE</span>
                </div>
                {/* Visual mockup text */}
                <div className="flex-1 flex flex-col gap-4 justify-center max-w-xl">
                  <span className="text-[#D4A373] text-sm font-mono tracking-wider">REFLECTIVE LOG</span>
                  <p className="text-xl sm:text-2xl text-gray-300 font-light italic">
                    "Why do I withdraw when my partner asks for closer discussion? Eunoia helps me realize it stems from a protective avoidance mechanism..."
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    <div className="w-8 h-8 rounded-full bg-[#8E2430] flex items-center justify-center text-[10px] font-bold text-white font-mono">E</div>
                    <div>
                      <p className="text-xs font-semibold text-white">Eunoia AI Relationship Coach</p>
                      <p className="text-[10px] text-gray-500">"Your response represents a natural urge for space. Let's practice how to express this need safely."</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 border-t border-[#1B1B1B] relative">
        <div className="text-center mb-16">
          <h2 className="text-xs font-mono text-[#D4A373] tracking-widest uppercase mb-3">Our Core Modules</h2>
          <p className="text-3xl sm:text-4xl font-light text-white">A Complete Emotional Support Suite</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-[#1B1B1B] border border-white/5 hover:border-[#6B0F1A]/50 rounded-2xl p-6 transition-all duration-300 group hover:shadow-xl hover:shadow-[#6B0F1A]/5"
            >
              <div className="w-12 h-12 rounded-xl bg-[#6B0F1A]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feat.icon}
              </div>
              <h3 className="text-lg font-medium text-white mb-3">{feat.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-light">{feat.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-24 border-t border-[#1B1B1B] relative">
        <div className="text-center mb-20">
          <h2 className="text-xs font-mono text-[#D4A373] tracking-widest uppercase mb-3">Your Journey</h2>
          <p className="text-3xl sm:text-4xl font-light text-white">Three Simple Steps to Connection</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="absolute top-1/2 left-[10%] right-[10%] h-[1px] bg-[#1B1B1B] -z-10 hidden md:block" />
          {steps.map((step, i) => (
            <div key={i} className="text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#111111] border-2 border-[#8E2430] flex items-center justify-center text-xl font-bold font-mono text-[#D4A373] mb-6 shadow-lg shadow-[#6B0F1A]/10">
                {step.num}
              </div>
              <h3 className="text-xl font-medium text-white mb-3">{step.title}</h3>
              <p className="text-sm text-gray-400 max-w-xs leading-relaxed font-light">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="max-w-6xl mx-auto px-6 py-24 border-t border-[#1B1B1B]">
        <div className="text-center mb-16">
          <h2 className="text-xs font-mono text-[#D4A373] tracking-widest uppercase mb-3">Real Experiences</h2>
          <p className="text-3xl sm:text-4xl font-light text-white">Loved by Couples and Individuals Alike</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, i) => (
            <div key={i} className="bg-[#1B1B1B] border border-white/5 rounded-2xl p-8 relative flex flex-col justify-between">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-[#D4A373]/10" />
              <p className="text-sm text-gray-300 italic font-light leading-relaxed mb-6">
                "{test.text}"
              </p>
              <div>
                <p className="text-sm font-semibold text-white">{test.author}</p>
                <p className="text-[11px] text-[#D4A373] font-mono">{test.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-24 border-t border-[#1B1B1B]">
        <div className="text-center mb-16">
          <HelpCircle className="w-10 h-10 text-[#D4A373] mx-auto mb-4" />
          <p className="text-3xl font-light text-white">Frequently Asked Questions</p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-[#1B1B1B] border border-white/5 rounded-xl p-6">
              <h4 className="text-base font-medium text-white mb-2 flex items-start gap-2">
                <span className="text-[#D4A373] font-mono">Q:</span> {faq.question}
              </h4>
              <p className="text-sm text-gray-400 font-light leading-relaxed pl-5">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section id="cta" className="max-w-6xl mx-auto px-6 py-16 mb-24 rounded-3xl bg-gradient-to-r from-[#6B0F1A]/40 to-[#1B1B1B] border border-[#6B0F1A]/30 relative overflow-hidden flex flex-col md:flex-row items-center justify-between p-12 gap-8">
        <div className="absolute inset-0 bg-radial-gradient from-[#8E2430]/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-xl text-center md:text-left">
          <h3 className="text-2xl sm:text-3xl font-light text-white">Ready to discover your connection blueprint?</h3>
          <p className="text-sm text-gray-400 mt-2 font-light">
            Take the self-reflection assessment and get an educational breakdown of your relationship tendencies with our warm AI coach today.
          </p>
        </div>
        <button
          id="cta-btn"
          onClick={onGetStarted}
          className="relative z-10 px-8 py-4 rounded-full font-medium bg-gradient-to-r from-[#6B0F1A] to-[#8E2430] hover:scale-105 active:scale-95 text-white shadow-xl shadow-[#6B0F1A]/20 border border-[#D4A373]/20 transition-all duration-300 whitespace-nowrap flex items-center gap-2 group"
        >
          Begin Journey
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </section>

      {/* Elegant Footer */}
      <footer id="landing-footer" className="bg-[#111111] border-t border-[#1B1B1B] py-12 text-center text-xs text-gray-500 font-light">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#D4A373] fill-[#D4A373]/20" />
            <span className="text-white font-medium tracking-widest font-mono text-[10px]">EUNOIA</span>
          </div>
          <p className="max-w-md text-center sm:text-right">
            Eunoia is an educational self-reflection utility and relationship coach. It does not provide clinical guidance or diagnostics. Created with love and scientific inspiration. © 2026 Eunoia Wellness.
          </p>
        </div>
      </footer>
    </div>
  );
}
