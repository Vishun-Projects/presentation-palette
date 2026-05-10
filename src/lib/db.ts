import Database from "better-sqlite3";
import { join } from "path";

let _db: Database.Database | null = null;

const initDb = () => {
  if (_db) return _db;
  
  // On Vercel (production), the root directory is read-only. 
  // We use /tmp which is writable.
  const dbPath = process.env.NODE_ENV === "production" 
    ? join("/tmp", "db.sqlite") 
    : join(process.cwd(), "db.sqlite");
    
  const db = new Database(dbPath);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS pins (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      cat TEXT NOT NULL,
      pdf_path TEXT NOT NULL,
      thumb_path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      avatar_path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS feedback (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  // Seeding logic:
  // Check if we have already seeded the database
  const isSeeded = db.prepare("SELECT value FROM settings WHERE key = 'seeded'").get() as { value: string } | undefined;
  
  if (!isSeeded) {
    console.log("Seeding database for the first time...");
    
    // 1. "Default" projects
    const defaultPins = [
      { id: "ride-electric", name: "Ride Smart. Ride Electric.", cat: "Pitch Deck", pdf_path: "/work/ride-electric.pdf", thumb_path: "/work/ride-electric.jpg" },
      { id: "spa", name: "Wellness Spa", cat: "Brand Presentation", pdf_path: "/work/spa.pdf", thumb_path: "/work/spa.jpg" },
      { id: "marriotts", name: "Marriott's Strategy", cat: "Corporate Deck", pdf_path: "/work/marriotts.pdf", thumb_path: "/work/marriotts.jpg" },
      { id: "admiral-max", name: "Brand Manual of Admiral Max", cat: "Brand Manual", pdf_path: "/work/admiral-max.pdf", thumb_path: "/work/admiral-max.jpg" },
      { id: "nvision-portfolio", name: "NVision Portfolio", cat: "Portfolio", pdf_path: "/work/nvision-portfolio.pdf", thumb_path: "/work/nvision.jpg" },
    ];

    const insertPin = db.prepare("INSERT OR IGNORE INTO pins (id, name, cat, pdf_path, thumb_path) VALUES (?, ?, ?, ?, ?)");
    defaultPins.forEach(p => insertPin.run(p.id, p.name, p.cat, p.pdf_path, p.thumb_path));

    // No auto-seeding for testimonials

    // Mark as seeded
    db.prepare("INSERT INTO settings (key, value) VALUES ('seeded', 'true')").run();
  }

  _db = db;
  return db;
};

export type Pin = {
  id: string;
  name: string;
  cat: string;
  pdf_path: string;
  thumb_path: string;
  created_at: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar_path?: string;
  created_at: string;
};

export type Feedback = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  created_at: string;
};

export const getPins = () => {
  const db = initDb();
  return db.prepare("SELECT * FROM pins ORDER BY created_at DESC").all() as Pin[];
};

export const addPin = (pin: Omit<Pin, "created_at">) => {
  const db = initDb();
  db.prepare("INSERT INTO pins (id, name, cat, pdf_path, thumb_path) VALUES (?, ?, ?, ?, ?)")
    .run(pin.id, pin.name, pin.cat, pin.pdf_path, pin.thumb_path);
};

export const deletePin = (id: string) => {
  const db = initDb();
  db.prepare("DELETE FROM pins WHERE id = ?").run(id);
};

export const updatePin = (pin: Partial<Pin> & { id: string }) => {
  const db = initDb();
  const sets = Object.keys(pin).filter(k => k !== 'id').map(k => `${k} = ?`).join(", ");
  const vals = Object.keys(pin).filter(k => k !== 'id').map(k => (pin as any)[k]);
  db.prepare(`UPDATE pins SET ${sets} WHERE id = ?`).run(...vals, pin.id);
};

export const getTestimonials = () => {
  const db = initDb();
  return db.prepare("SELECT * FROM testimonials ORDER BY created_at DESC").all() as Testimonial[];
};

export const addTestimonial = (testimonial: Omit<Testimonial, "created_at">) => {
  const db = initDb();
  db.prepare("INSERT INTO testimonials (id, name, role, content, rating, avatar_path) VALUES (?, ?, ?, ?, ?, ?)")
    .run(testimonial.id, testimonial.name, testimonial.role, testimonial.content, testimonial.rating, testimonial.avatar_path);
};

export const deleteTestimonial = (id: string) => {
  const db = initDb();
  db.prepare("DELETE FROM testimonials WHERE id = ?").run(id);
};

export const updateTestimonial = (testimonial: Partial<Testimonial> & { id: string }) => {
  const db = initDb();
  const sets = Object.keys(testimonial).filter(k => k !== 'id').map(k => `${k} = ?`).join(", ");
  const vals = Object.keys(testimonial).filter(k => k !== 'id').map(k => (testimonial as any)[k]);
  db.prepare(`UPDATE testimonials SET ${sets} WHERE id = ?`).run(...vals, testimonial.id);
};

export const getFeedback = () => {
  const db = initDb();
  return db.prepare("SELECT * FROM feedback ORDER BY created_at DESC").all() as Feedback[];
};

export const addFeedback = (feedback: Omit<Feedback, "created_at">) => {
  const db = initDb();
  db.prepare("INSERT INTO feedback (id, name, email, phone, message) VALUES (?, ?, ?, ?, ?)")
    .run(feedback.id, feedback.name, feedback.email, feedback.phone, feedback.message);
};

export const deleteFeedback = (id: string) => {
  const db = initDb();
  db.prepare("DELETE FROM feedback WHERE id = ?").run(id);
};
