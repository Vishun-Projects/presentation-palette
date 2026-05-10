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
      thumb_path TEXT NOT NULL,
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
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed initial data if empty
  const count = db.prepare("SELECT COUNT(*) as count FROM pins").get() as { count: number };
  if (count.count === 0) {
    const initialPins = [
      { id: "1", name: "Ride Smart. Ride Electric.", cat: "Pitch Deck", pdf_path: "/work/ride-electric.pdf", thumb_path: "/work/ride-electric.jpg" },
      { id: "2", name: "Wellness Spa", cat: "Brand Presentation", pdf_path: "/work/spa.pdf", thumb_path: "/work/spa.jpg" },
      { id: "3", name: "Marriott's Strategy", cat: "Corporate Deck", pdf_path: "/work/marriotts.pdf", thumb_path: "/work/marriotts.jpg" },
    ];

    const insert = db.prepare("INSERT INTO pins (id, name, cat, pdf_path, thumb_path) VALUES (?, ?, ?, ?, ?)");
    initialPins.forEach(p => insert.run(p.id, p.name, p.cat, p.pdf_path, p.thumb_path));
  }

  const tCount = db.prepare("SELECT COUNT(*) as count FROM testimonials").get() as { count: number };
  if (tCount.count === 0) {
    const initialTestimonials = [
      { id: "1", name: "Alex Rivera", role: "CEO, TechFlow", content: "NVision completely transformed our investor deck. The visuals were stunning and we closed our seed round in record time.", rating: 5 },
      { id: "2", name: "Sarah Chen", role: "Marketing Director, Aura", content: "The level of detail and understanding of our brand was impressive. Highly recommend for any high-stakes presentation.", rating: 5 },
    ];
    const insertT = db.prepare("INSERT INTO testimonials (id, name, role, content, rating) VALUES (?, ?, ?, ?, ?)");
    initialTestimonials.forEach(t => insertT.run(t.id, t.name, t.role, t.content, t.rating));
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
