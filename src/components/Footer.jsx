import React from "react";
import Section from "./Section";
import { socials } from "../constants";
import { MannMitra } from "../assets";
import { Link } from "react-router-dom";
import { Sparkles, Shield, HeartHandshake } from "lucide-react";

const Footer = () => {
  return (
    <Section crosses className="!px-0 !pt-16 !pb-10">
      <div className="container">
        {/* Main Footer Multi-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-14 border-b border-n-6/60">
          {/* Brand & Purpose (Col 1: Spans 5 columns on desktop) */}
          <div className="lg:col-span-5 flex flex-col items-start gap-5">
            <a href="#hero" className="block -mt-3 lg:-mt-4 -ml-2 lg:-ml-3.5">
              <img
                src={MannMitra}
                width={285}
                height={57}
                alt="MannMitra"
                className="w-[17.5rem] lg:w-[18.5rem] h-auto object-contain"
              />
            </a>
            <p className="body-2 text-n-3 max-w-xl leading-relaxed">
              Empowering mental wellness with empathetic AI companion conversations, 
              confidential emotional sanctuary, and guided self-care reflections.
            </p>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-n-7 border border-n-6 text-xs text-n-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>100% Confidential & Safe Space</span>
            </div>
          </div>

          {/* Right Section: Platform to Connect With Us (Shifted to the right) */}
          <div className="lg:col-span-7 lg:ml-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-8 lg:gap-6 xl:gap-8 lg:pl-6 xl:pl-10">
            {/* Platform Links (2 cols out of 7) */}
            <div className="lg:col-span-2">
              <h6 className="font-semibold text-n-1 text-sm tracking-wider uppercase mb-5">
                Platform
              </h6>
              <ul className="flex flex-col gap-3 text-sm text-n-3">
                <li>
                  <a href="#hero" className="transition-colors hover:text-color-1">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#features" className="transition-colors hover:text-color-1">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-to-use" className="transition-colors hover:text-color-1">
                    How to Use
                  </a>
                </li>
                <li>
                  <a href="#roadmap" className="transition-colors hover:text-color-1">
                    Roadmap
                  </a>
                </li>
                <li>
                  <Link to="/app" className="inline-flex items-center gap-1.5 text-color-1 font-medium hover:underline">
                    <Sparkles className="w-3.5 h-3.5" /> Launch AI Companion
                  </Link>
                </li>
              </ul>
            </div>

            {/* Wellness Care & Safety (3 cols out of 7) */}
            <div className="lg:col-span-3">
              <h6 className="font-semibold text-n-1 text-sm tracking-wider uppercase mb-5">
                Wellness & Safety
              </h6>
              <ul className="flex flex-col gap-3 text-sm text-n-3">
                <li>
                  <span className="text-n-4 flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" /> End-to-End Privacy First
                  </span>
                </li>
                <li>
                  <span className="text-n-4 flex items-center gap-2">
                    <HeartHandshake className="w-3.5 h-3.5 text-indigo-400" /> Crisis Support & Helplines
                  </span>
                </li>
                <li>
                  <Link to="/app" className="transition-colors hover:text-color-1">
                    Mindfulness Breath Tools
                  </Link>
                </li>
                <li>
                  <Link to="/app" className="transition-colors hover:text-color-1">
                    Mood Tracking Journal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Socials & Connect (2 cols out of 7) */}
            <div className="lg:col-span-2">
              <h6 className="font-semibold text-n-1 text-sm tracking-wider uppercase mb-5">
                Connect With Us
              </h6>
              <p className="text-xs text-n-4 mb-4">
                Join our mental wellness community across platforms:
              </p>
              <div className="flex gap-2.5 flex-wrap">
                {socials.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    title={item.title}
                    className="flex items-center justify-center w-10 h-10 bg-n-7 border border-n-6/60 rounded-full transition-all duration-200 hover:bg-n-6 hover:border-n-5 hover:scale-110 shadow-sm"
                  >
                    <img src={item.iconUrl} width={18} height={18} alt={item.title} className="opacity-75 hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-n-4">
          <p>© {new Date().getFullYear()} MannMitra AI. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <a href="#hero" className="transition-colors hover:text-n-2">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#hero" className="transition-colors hover:text-n-2">
              Terms of Service
            </a>
            <span>•</span>
            <a href="#hero" className="transition-colors hover:text-n-2">
              Ethical AI Principles
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Footer;