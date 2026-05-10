"use client";

import { useEffect, useRef, useState } from "react";
import { PdfViewer } from "@/src/components/PdfViewer";
import { sendFeedbackFn } from "@/app/actions";
import { Star, MessageSquare, Phone, Mail, Send } from "lucide-react";
import type { Pin, Testimonial } from "@/src/lib/db";
import { toast } from "sonner";

const services = [
  { n: "01", name: "Presentation Slide Designs", desc: "Custom decks for investor pitches, product launches and brand storytelling. Every slide crafted to hold attention." },
  { n: "02", name: "Advertisement Templates", desc: "High-converting ad creatives for digital and print campaigns that communicate offers in seconds." },
  { n: "03", name: "Social Media Creatives", desc: "Thumb-stopping visuals for Instagram, LinkedIn and beyond — consistent across every post and reel." },
  { n: "04", name: "Brand Promotion Designs", desc: "Banners, flyers, brochures — assets that make any business look enterprise-grade." },
  { n: "05", name: "Marketing Presentations", desc: "Campaign decks and review presentations tailored to move stakeholders and close deals." },
  { n: "06", name: "Custom Brand Kits", desc: "Full identity packages — typography, palette, icons — to show up with confidence anywhere." },
];

export default function LandingPage({ pins, testimonials }: { pins: Pin[], testimonials: Testimonial[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePin, setActivePin] = useState<Pin | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorFRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Custom trailing cursor
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.documentElement.classList.add("has-cursor");
    let x = 0, y = 0, fx = 0, fy = 0;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      }
    };
    const tick = () => {
      fx += (x - fx) * 0.18;
      fy += (y - fy) * 0.18;
      if (cursorFRef.current) {
        cursorFRef.current.style.transform = `translate(${fx}px, ${fy}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const hov = t.closest("a,button,[data-cursor='hover']");
      cursorRef.current?.classList.toggle("is-hover", !!hov);
      cursorFRef.current?.classList.toggle("is-hover", !!hov);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const navLinks = [
    { href: "#services", label: "Services" },
    { href: "#work", label: "Work" },
    { href: "#testimonials", label: "Reviews" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ];

  const close = () => setMenuOpen(false);

  return (
    <main className="bg-background text-foreground">
      <div ref={cursorRef} className="cursor-dot" aria-hidden />
      <div ref={cursorFRef} className="cursor-ring" aria-hidden />

      {/* NAV */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-[5vw] transition-all duration-300 ${scrolled
          ? "py-3 bg-background/95 backdrop-blur-md border-b border-gold/10"
          : "py-4 sm:py-5"
          }`}
      >
        <a href="#home" className="flex items-center" onClick={close}>
          <img src="/nvision-logo.png" alt="NVision" className="h-9 sm:h-11 w-auto" />
        </a>
        <ul className="hidden md:flex items-center gap-6 lg:gap-8 list-none">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-[11px] tracking-[0.18em] uppercase text-warm/50 hover:text-gold transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          className="hidden md:inline-block text-[11px] tracking-[0.14em] uppercase text-gold border border-gold px-5 py-2 hover:bg-gold hover:text-background transition-colors"
        >
          Work With Us
        </a>
        <button
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className="md:hidden flex flex-col gap-[5px] p-2"
        >
          <span className="block w-6 h-px bg-warm" />
          <span className="block w-6 h-px bg-warm" />
          <span className="block w-6 h-px bg-warm" />
        </button>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-background/98 backdrop-blur-md flex flex-col md:hidden">
          <div className="flex items-center justify-between px-[5vw] py-4">
            <img src="/nvision-logo.png" alt="NVision" className="h-9 w-auto" />
            <button
              aria-label="Close menu"
              onClick={close}
              className="text-warm/70 text-2xl leading-none px-2"
            >
              ✕
            </button>
          </div>
          <ul className="flex flex-col gap-1 px-[5vw] mt-6 list-none">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={close}
                  className="block py-3 font-serif text-2xl text-warm hover:text-gold transition-colors border-b border-gold/10"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                onClick={close}
                className="block py-3 font-serif text-2xl text-gold"
              >
                Work With Us
              </a>
            </li>
          </ul>
          <div className="mt-auto px-[5vw] py-6 text-[11px] tracking-[0.14em] uppercase text-warm/40">
            workwithnvision@gmail.com
          </div>
        </div>
      )}

      {/* HERO */}
      <section
        id="home"
        className="relative min-h-[100svh] flex flex-col justify-center sm:justify-end px-[5vw] pb-[10vh] sm:pb-[14vw] pt-20 sm:pt-32 overflow-hidden"
      >
        <div className="absolute inset-0 bg-background">
          <div className="absolute top-0 right-0 w-1/2 h-[70%] bg-[radial-gradient(ellipse_at_top_right,oklch(0.76_0.09_80/0.07)_0%,transparent_70%)]" />
        </div>
        <div className="absolute top-[48%] inset-x-0 h-px bg-[linear-gradient(90deg,transparent,oklch(0.76_0.09_80/0.25)_40%,oklch(0.76_0.09_80/0.08)_70%,transparent)]" />
        <div className="relative z-10 max-w-[1100px]">
          <p
            className="text-[11px] tracking-[0.3em] uppercase text-gold mb-6 animate-fadeUp"
            style={{ animationDelay: "0.2s" }}
          >
            Presentation &amp; Branding Co.
          </p>
          <h1
            className="font-serif font-light leading-[0.9] tracking-tight text-warm animate-fadeUp"
            style={{ fontSize: "clamp(48px,11vw,148px)", animationDelay: "0.4s" }}
          >
            Designing
            <br />
            <em className="not-italic italic text-gold">visuals</em>
            <br />
            that <span className="text-outline">speak.</span>
          </h1>
          <div
            className="mt-10 flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-end animate-fadeUp"
            style={{ animationDelay: "0.65s" }}
          >
            <p className="max-w-sm text-sm leading-[1.85] text-warm/50">
              Professional slide designs, social media creatives and brand
              communication that capture attention and drive real results.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <a
                href="#work"
                className="bg-gold text-background text-[11px] font-medium tracking-[0.15em] uppercase px-8 py-3.5 hover:bg-gold-light transition-all hover:-translate-y-0.5"
              >
                View Portfolio
              </a>
              <a
                href="#contact"
                className="text-[11px] tracking-[0.15em] uppercase text-warm/50 border-b border-warm/20 pb-1 hover:text-gold hover:border-gold transition-colors"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden border-y border-gold/20 py-4 bg-surface-1">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 2 }).flatMap((_, i) =>
            ["Presentation Design", "Social Media Creatives", "Brand Identity", "Pitch Decks", "Marketing Slides", "Brand Promotion"].map((t, j) => (
              <span key={`${i}-${j}`} className="flex-shrink-0 flex items-center">
                <span className="font-serif italic text-lg text-gold/45 px-9">{t}</span>
                <span className="text-gold px-1">✦</span>
              </span>
            )),
          )}
        </div>
      </div>

      {/* SERVICES */}
      <section id="services" className="py-24 px-[5vw] bg-surface-1">
        <div className="flex flex-wrap justify-between items-end gap-5 mb-16 reveal">
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-3">What We Create</p>
            <h2 className="font-serif font-light leading-[1.05] text-warm" style={{ fontSize: "clamp(32px,5vw,62px)" }}>
              Creative <em className="text-gold">Services</em>
            </h2>
          </div>
          <a href="#contact" className="text-[11px] tracking-[0.14em] uppercase text-warm/40 border-b border-warm/15 pb-1 hover:text-gold hover:border-gold transition-colors">
            Start a project →
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gold/15">
          {services.map((s, i) => (
            <div
              key={s.n}
              className="group relative overflow-hidden bg-surface-1 hover:bg-surface-2 transition-colors p-10 reveal"
              style={{ transitionDelay: `${(i % 3) * 0.1}s` }}
            >
              <span className="absolute top-0 inset-x-0 h-0.5 bg-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
              <div className="font-serif text-[44px] font-light text-gold/15 group-hover:text-gold/30 transition-colors leading-none mb-6">
                {s.n}
              </div>
              <div className="font-serif text-xl text-warm mb-3">{s.name}</div>
              <p className="text-[13px] leading-[1.85] text-warm/45">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WORK — MASONRY */}
      <section id="work" className="py-24 px-[5vw] bg-background">
        <div className="flex flex-wrap justify-between items-end gap-5 mb-16 reveal">
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-3">Selected Projects</p>
            <h2 className="font-serif font-light leading-[1.05] text-warm" style={{ fontSize: "clamp(32px,5vw,62px)" }}>
              Recent <em className="text-gold">Work</em>
            </h2>
          </div>
          <a href="#contact" className="text-[11px] tracking-[0.14em] uppercase text-warm/40 border-b border-warm/15 pb-1 hover:text-gold hover:border-gold transition-colors">
            All projects →
          </a>
        </div>
        <div className="[column-count:2] lg:[column-count:3] xl:[column-count:4] [column-gap:12px]">
          {pins.map((p: Pin, i: number) => (
            <button
              key={i}
              type="button"
              onClick={() => setActivePin(p)}
              className="group relative block w-full text-left break-inside-avoid mb-3 overflow-hidden rounded-sm bg-surface-2"
            >
              <img
                src={p.thumb_path}
                alt={p.name}
                loading="lazy"
                decoding="async"
                className="w-full block transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-background/85 via-background/40 to-transparent flex flex-col justify-end p-4">
                <div className="text-sm text-warm">{p.name}</div>
                <div className="text-[10px] tracking-[0.14em] uppercase text-gold mt-1">View PDF →</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS (Conditional) */}
      {testimonials.length > 0 && (
        <section className="py-24 px-[5vw] bg-surface-1 overflow-hidden">
          <div className="flex flex-wrap justify-between items-end gap-5 mb-16 reveal">
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-3">Client Stories</p>
              <h2 className="font-serif font-light leading-[1.05] text-warm" style={{ fontSize: "clamp(32px,5vw,62px)" }}>
                What They <em className="text-gold">Say</em>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t: Testimonial, i: number) => (
              <div
                key={t.id}
                className="bg-surface-2 p-8 border border-gold/10 relative reveal"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <span className="text-gold/20 text-6xl font-serif absolute top-4 right-6 italic">"</span>
                <p className="text-sm leading-[1.8] text-warm/60 mb-8 relative z-10 italic">
                  {t.content}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold/10 overflow-hidden border border-gold/20">
                    {t.avatar_path ? (
                      <img src={t.avatar_path} className="w-full h-full object-cover" alt={t.name} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gold font-serif text-lg">
                        {t.name[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-warm font-serif text-lg leading-none mb-1">{t.name}</div>
                    <div className="text-[10px] tracking-widest uppercase text-gold/60">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PROCESS */}
      <section id="process" className="py-24 px-[5vw] bg-background">
        <div className="reveal">
          <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-3">How We Work</p>
          <h2 className="font-serif font-light leading-[1.05] text-warm mb-16" style={{ fontSize: "clamp(32px,5vw,62px)" }}>
            The <em className="text-gold">Process</em>
          </h2>
        </div>
        <div>
          {[
            ["01", "Discover & Brief", "We start with a detailed brief — your brand, audience, goals and what success looks like.", "Day 1"],
            ["02", "Concept & Direction", "Initial visual directions — moodboards, palette, typography — so we align before execution.", "Day 2–3"],
            ["03", "Design & Craft", "Full production of your deliverables with obsessive attention to layout and detail.", "Day 3–6"],
            ["04", "Review & Refine", "Two rounds of revisions included. You get exactly what you envisioned.", "Day 6–7"],
            ["05", "Deliver & Support", "Final files in all formats. Editable source files included. Smooth handoff.", "Final Day"],
          ].map(([n, name, desc, tag]) => (
            <div
              key={n}
              className="grid grid-cols-[44px_1fr] sm:grid-cols-[64px_1fr_auto] items-start gap-6 sm:gap-8 py-10 border-b border-gold/10 reveal"
            >
              <div className="font-serif font-light text-warm/15 leading-none text-4xl sm:text-[56px]">{n}</div>
              <div>
                <div className="font-serif font-light text-warm text-2xl sm:text-[26px] mb-2.5">{name}</div>
                <p className="text-[13px] leading-[1.85] text-warm/40 max-w-lg">{desc}</p>
              </div>
              <div className="hidden sm:block self-center text-[10px] tracking-[0.14em] uppercase text-gold border border-gold/30 px-3.5 py-1.5 whitespace-nowrap">
                {tag}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 px-[5vw] bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 blur-[100px] -translate-y-1/2 translate-x-1/2 rounded-full" />
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 reveal">
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-3">Testimonials</p>
            <h2 className="font-serif font-light text-warm leading-tight" style={{ fontSize: "clamp(32px, 5vw, 52px)" }}>
              Client Stories.
            </h2>
          </div>
          <p className="text-[13px] text-warm/40 mt-5 md:mt-0 max-w-sm">
            Hear from the founders and brand managers we've helped standout with strategic design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t: Testimonial) => (
            <div key={t.id} className="bg-surface-2 p-8 sm:p-10 border border-gold/10 hover:border-gold/30 transition-all reveal group">
              <div className="flex gap-1 mb-6 text-gold/40 group-hover:text-gold transition-colors">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < (t.rating || 5) ? 'fill-current' : 'opacity-20'}`} />
                ))}
              </div>
              <p className="text-warm/60 text-sm leading-[1.8] mb-8 font-light italic">"{t.content}"</p>
              <div className="flex items-center gap-4">
                {t.avatar_path ? (
                  <img src={t.avatar_path} alt={t.name} className="w-12 h-12 rounded-full border border-gold/20 object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gold/5 border border-gold/20 flex items-center justify-center text-gold font-serif text-lg">
                    {t.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="text-warm font-serif text-lg leading-none mb-1.5">{t.name}</div>
                  <div className="text-[10px] tracking-[0.15em] uppercase text-warm/30">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="py-24 px-[5vw] bg-surface-1 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center"
      >
        <div className="bg-surface-2 border border-gold/15 p-10 sm:p-11 relative reveal">
          <span className="absolute -top-px left-9 right-9 h-0.5 bg-[linear-gradient(90deg,transparent,var(--gold),transparent)]" />
          <blockquote className="font-serif italic text-warm/55 text-xl leading-[1.65] mb-9 pl-5 border-l-2 border-gold">
            "Design isn't decoration — it's the first conversation your brand has with the world."
          </blockquote>
          <p className="text-[13px] leading-[2] text-warm/45 mb-5">
            Welcome to NVision — where creativity meets professional presentation
            design. We specialize in visually impactful presentations, pitch decks,
            posters, infographics and business creatives that help ideas stand out.
          </p>
          <p className="text-[13px] leading-[2] text-warm/45 mb-7">
            Every presentation should not only look professional but tell a strong
            visual story — clean layouts, creative concepts and audience-focused
            designs that make communication more effective.
          </p>
          <a
            href="#contact"
            className="inline-block bg-gold text-background text-[11px] font-medium tracking-[0.15em] uppercase px-8 py-3.5 hover:bg-gold-light transition-colors"
          >
            Start a Project
          </a>
          <div className="grid grid-cols-2 gap-7 mt-10">
            {[
              ["50+", "Projects Delivered"],
              ["15+", "Industries Served"],
              ["7", "Day Avg Turnaround"],
              ["100%", "Client Satisfaction"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-serif font-light text-gold text-[44px] leading-none">{n}</div>
                <div className="text-[10px] tracking-[0.1em] uppercase text-warm/30 mt-1.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="reveal">
          <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-3">About NVision</p>
          <h2 className="font-serif font-light leading-[1.05] text-warm mb-7" style={{ fontSize: "clamp(32px,5vw,62px)" }}>
            We make
            <br />
            brands <em className="text-gold">look</em>
            <br />
            their best.
          </h2>
          <p className="text-sm leading-[2] text-warm/45 mb-7">
            From investor pitch decks and corporate presentations to social media
            posters and marketing creatives, we deliver designs that are modern,
            strategic and visually appealing.
          </p>
          <p className="font-serif italic text-gold/80 text-lg">
            NVision — Designing Ideas That Speak.
          </p>
          <p className="text-[11px] tracking-[0.3em] uppercase text-gold mt-9 mb-2">Contact</p>
          <a
            href="mailto:workwithnvision@gmail.com"
            className="font-serif font-light text-warm/40 text-2xl hover:text-gold transition-colors block break-all"
          >
            workwithnvision@gmail.com
          </a>
        </div>
      </section>

      {/* CONTACT & FEEDBACK */}
      <section id="contact" className="py-24 px-[5vw] bg-surface-1 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-20 items-start">
          <div className="reveal">
            <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-3">Connect With Us</p>
            <h2 className="font-serif font-light text-warm leading-[1.1] mb-8" style={{ fontSize: "clamp(32px, 6vw, 72px)" }}>
              Have a project
              <br />
              in <em className="text-gold">mind?</em>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mt-14">
              <div className="group">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-4 h-4 text-gold" />
                  <span className="text-[10px] tracking-[0.2em] uppercase text-warm/40">Email Us</span>
                </div>
                <a href="mailto:workwithnvision@gmail.com" className="font-serif text-2xl text-warm/70 hover:text-gold transition-colors break-all">
                  workwithnvision@gmail.com
                </a>
              </div>
              <div className="group">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="w-4 h-4 text-gold" />
                  <span className="text-[10px] tracking-[0.2em] uppercase text-warm/40">Call / WhatsApp</span>
                </div>
                <a href="tel:+919324575004" className="font-serif text-2xl text-warm/70 hover:text-gold transition-colors">
                  +91 93245 75004
                </a>
              </div>
            </div>

            <div className="mt-16 pt-10 border-t border-gold/10">
              <p className="text-[13px] text-warm/30 max-w-md leading-[2]">
                We typically respond within 24 hours. Whether it's a pitch deck audit or a complete brand overhaul, we're here to design ideas that speak.
              </p>
            </div>
          </div>

          <div className="bg-surface-2 p-8 sm:p-10 border border-gold/15 relative reveal">
            <span className="absolute -top-px left-8 right-8 h-px bg-gold/40" />
            <h3 className="font-serif text-2xl text-warm mb-8">Send Feedback or Query</h3>

            <form
              className="space-y-6"
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                const form = e.target as HTMLFormElement;
                const fd = new FormData(form);
                const data = {
                  name: fd.get("name") as string,
                  email: fd.get("email") as string,
                  phone: fd.get("phone") as string,
                  message: fd.get("message") as string
                };
                try {
                  await sendFeedbackFn(data);
                  toast.success("Query Received", {
                    description: "Thank you! We've received your inquiry and will get back to you shortly.",
                    className: "bg-surface-2 border-gold/20 text-warm rounded-none font-serif",
                  });
                  form.reset();
                } catch (err) {
                  toast.error("Message Failed", {
                    description: "There was an error sending your message. Please try again or email us directly.",
                  });
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-warm/40 mb-2">Full Name</label>
                <input required name="name" type="text" className="w-full bg-background border border-gold/10 px-4 py-3 text-sm text-warm focus:border-gold outline-none transition-colors" placeholder="John Doe" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-warm/40 mb-2">Email Address</label>
                  <input required name="email" type="email" className="w-full bg-background border border-gold/10 px-4 py-3 text-sm text-warm focus:border-gold outline-none transition-colors" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-warm/40 mb-2">Phone (Optional)</label>
                  <input name="phone" type="tel" className="w-full bg-background border border-gold/10 px-4 py-3 text-sm text-warm focus:border-gold outline-none transition-colors" placeholder="+91 XXX..." />
                </div>
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-warm/40 mb-2">Message / Query</label>
                <textarea required name="message" rows={4} className="w-full bg-background border border-gold/10 px-4 py-3 text-sm text-warm focus:border-gold outline-none transition-colors resize-none" placeholder="Tell us about your project..."></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gold text-background py-4 flex items-center justify-center gap-3 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-gold-light transition-all group disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-background py-12 px-[5vw] border-t border-gold/10 flex flex-col sm:flex-row justify-between items-center gap-5 text-center sm:text-left">
        <img src="/nvision-logo.png" alt="NVision" className="h-9 w-auto" />
        <div className="text-[11px] text-warm/20 tracking-wide">© 2025 NVision Presentation &amp; Branding Co.</div>
        <div className="text-[11px] text-warm/30 sm:text-right">
          Presentation &amp; Branding Co.
          <a href="mailto:workwithnvision@gmail.com" className="block mt-1 text-gold break-all">
            workwithnvision@gmail.com
          </a>
        </div>
      </footer>

      {/* PDF PREVIEW DIALOG */}
      {activePin && (
        <PdfViewer
          url={activePin.pdf_path}
          thumbnail={activePin.thumb_path}
          title={activePin.name}
          category={activePin.cat}
          onClose={() => setActivePin(null)}
        />
      )}
    </main>
  );
}
