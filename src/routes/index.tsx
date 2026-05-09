import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import logo from "@/assets/nvision-logo.png";
import rideElectric from "@/assets/work/ride-electric.jpg";
import spa from "@/assets/work/spa.jpg";
import marriotts from "@/assets/work/marriotts.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NVision — Presentation & Branding Co." },
      {
        name: "description",
        content:
          "NVision designs visually impactful presentations, pitch decks, posters, infographics and brand creatives that make ideas stand out.",
      },
      { property: "og:title", content: "NVision — Presentation & Branding Co." },
      {
        property: "og:description",
        content:
          "Designing ideas that speak — pitch decks, social creatives and brand identity for startups, businesses and brands.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap",
      },
    ],
  }),
  component: Index,
});

type Pin = {
  name: string;
  cat: string;
  thumb: string;
  pdf?: string;
};

const pins: Pin[] = [
  { name: "Ride Smart. Ride Electric.", cat: "Pitch Deck", thumb: rideElectric, pdf: "/work/ride-electric.pdf" },
  { name: "Wellness Spa", cat: "Brand Presentation", thumb: spa, pdf: "/work/spa.pdf" },
  { name: "Marriott's Strategy", cat: "Corporate Deck", thumb: marriotts, pdf: "/work/marriotts.pdf" },
  { name: "Ride Smart. Ride Electric.", cat: "Cover", thumb: rideElectric, pdf: "/work/ride-electric.pdf" },
  { name: "Wellness Spa", cat: "Layouts", thumb: spa, pdf: "/work/spa.pdf" },
  { name: "Marriott's Strategy", cat: "Layouts", thumb: marriotts, pdf: "/work/marriotts.pdf" },
];

const services = [
  { n: "01", name: "Presentation Slide Designs", desc: "Custom decks for investor pitches, product launches and brand storytelling. Every slide crafted to hold attention." },
  { n: "02", name: "Advertisement Templates", desc: "High-converting ad creatives for digital and print campaigns that communicate offers in seconds." },
  { n: "03", name: "Social Media Creatives", desc: "Thumb-stopping visuals for Instagram, LinkedIn and beyond — consistent across every post and reel." },
  { n: "04", name: "Brand Promotion Designs", desc: "Banners, flyers, brochures — assets that make any business look enterprise-grade." },
  { n: "05", name: "Marketing Presentations", desc: "Campaign decks and review presentations tailored to move stakeholders and close deals." },
  { n: "06", name: "Custom Brand Kits", desc: "Full identity packages — typography, palette, icons — to show up with confidence anywhere." },
];

function Index() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePin, setActivePin] = useState<Pin | null>(null);
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

  // Custom trailing cursor — desktop / fine-pointer only
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
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
    { href: "#process", label: "Process" },
    { href: "#about", label: "About" },
  ];

  const close = () => setMenuOpen(false);

  return (
    <main className="bg-background text-foreground">
      {/* NAV */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-[5vw] transition-all duration-300 ${
          scrolled
            ? "py-3 bg-background/95 backdrop-blur-md border-b border-gold/10"
            : "py-4 sm:py-5"
        }`}
      >
        <a href="#home" className="flex items-center" onClick={close}>
          <img src={logo} alt="NVision" className="h-9 sm:h-11 w-auto" />
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
            <img src={logo} alt="NVision" className="h-9 w-auto" />
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
        className="relative min-h-[100svh] flex flex-col justify-end px-[5vw] pb-[14vw] pt-32 overflow-hidden"
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
        <div className="[column-count:1] sm:[column-count:2] lg:[column-count:3] xl:[column-count:4] [column-gap:12px]">
          {pins.map((p, i) => (
            <a
              key={i}
              href={p.pdf}
              target="_blank"
              rel="noreferrer"
              className="group relative block break-inside-avoid mb-3 overflow-hidden rounded-sm bg-surface-2 cursor-pointer"
            >
              <img
                src={p.thumb}
                alt={p.name}
                loading="lazy"
                className="w-full block transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-background/85 via-background/40 to-transparent flex flex-col justify-end p-4">
                <div className="text-sm text-warm">{p.name}</div>
                <div className="text-[10px] tracking-[0.14em] uppercase text-gold mt-1">{p.cat}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="py-24 px-[5vw] bg-surface-1">
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

      {/* ABOUT */}
      <section
        id="about"
        className="py-24 px-[5vw] bg-background grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center"
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

      {/* CTA */}
      <section id="contact" className="relative overflow-hidden py-28 px-[5vw] bg-surface-1 text-center">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(circle, oklch(0.76 0.09 80 / 0.06) 0%, transparent 70%)" }}
        />
        <p className="relative text-[11px] tracking-[0.3em] uppercase text-gold mb-7 reveal">Ready When You Are</p>
        <h2
          className="relative font-serif font-light leading-[0.95] text-warm mb-5 reveal"
          style={{ fontSize: "clamp(40px,8vw,100px)" }}
        >
          Let's get
          <br />
          <em className="text-gold">started.</em>
        </h2>
        <a
          href="mailto:workwithnvision@gmail.com"
          className="relative font-serif font-light text-warm/40 hover:text-gold transition-colors block mb-10 reveal break-all"
          style={{ fontSize: "clamp(18px,3vw,30px)" }}
        >
          workwithnvision@gmail.com
        </a>
        <div className="reveal relative">
          <a
            href="mailto:workwithnvision@gmail.com"
            className="inline-block bg-gold text-background text-[11px] font-medium tracking-[0.15em] uppercase px-8 py-3.5 hover:bg-gold-light transition-colors"
          >
            Email Us
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-background py-12 px-[5vw] border-t border-gold/10 flex flex-col sm:flex-row justify-between items-center gap-5 text-center sm:text-left">
        <img src={logo} alt="NVision" className="h-9 w-auto" />
        <div className="text-[11px] text-warm/20 tracking-wide">© 2025 NVision Presentation &amp; Branding Co.</div>
        <div className="text-[11px] text-warm/30 sm:text-right">
          Presentation &amp; Branding Co.
          <a href="mailto:workwithnvision@gmail.com" className="block mt-1 text-gold break-all">
            workwithnvision@gmail.com
          </a>
        </div>
      </footer>
    </main>
  );
}
