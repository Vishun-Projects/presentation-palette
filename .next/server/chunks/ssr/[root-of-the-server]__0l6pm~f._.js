module.exports=[85148,(a,b,c)=>{b.exports=a.x("better-sqlite3-90e2652d1716b047",()=>require("better-sqlite3-90e2652d1716b047"))},61469,a=>{"use strict";var b=a.i(85148),c=a.i(14747);let d=null,e=()=>{if(d)return d;let a=(0,c.join)(process.cwd(),"db.sqlite"),e=new b.default(a);if(e.exec(`
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
  `),0===e.prepare("SELECT COUNT(*) as count FROM pins").get().count){let a=e.prepare("INSERT INTO pins (id, name, cat, pdf_path, thumb_path) VALUES (?, ?, ?, ?, ?)");[{id:"1",name:"Ride Smart. Ride Electric.",cat:"Pitch Deck",pdf_path:"/work/ride-electric.pdf",thumb_path:"/work/ride-electric.jpg"},{id:"2",name:"Wellness Spa",cat:"Brand Presentation",pdf_path:"/work/spa.pdf",thumb_path:"/work/spa.jpg"},{id:"3",name:"Marriott's Strategy",cat:"Corporate Deck",pdf_path:"/work/marriotts.pdf",thumb_path:"/work/marriotts.jpg"}].forEach(b=>a.run(b.id,b.name,b.cat,b.pdf_path,b.thumb_path))}if(0===e.prepare("SELECT COUNT(*) as count FROM testimonials").get().count){let a=e.prepare("INSERT INTO testimonials (id, name, role, content, rating) VALUES (?, ?, ?, ?, ?)");[{id:"1",name:"Alex Rivera",role:"CEO, TechFlow",content:"NVision completely transformed our investor deck. The visuals were stunning and we closed our seed round in record time.",rating:5},{id:"2",name:"Sarah Chen",role:"Marketing Director, Aura",content:"The level of detail and understanding of our brand was impressive. Highly recommend for any high-stakes presentation.",rating:5}].forEach(b=>a.run(b.id,b.name,b.role,b.content,b.rating))}return d=e,e};a.s(["addFeedback",0,a=>{e().prepare("INSERT INTO feedback (id, name, email, phone, message) VALUES (?, ?, ?, ?, ?)").run(a.id,a.name,a.email,a.phone,a.message)},"addPin",0,a=>{e().prepare("INSERT INTO pins (id, name, cat, pdf_path, thumb_path) VALUES (?, ?, ?, ?, ?)").run(a.id,a.name,a.cat,a.pdf_path,a.thumb_path)},"addTestimonial",0,a=>{e().prepare("INSERT INTO testimonials (id, name, role, content, rating, avatar_path) VALUES (?, ?, ?, ?, ?, ?)").run(a.id,a.name,a.role,a.content,a.rating,a.avatar_path)},"deleteFeedback",0,a=>{e().prepare("DELETE FROM feedback WHERE id = ?").run(a)},"deletePin",0,a=>{e().prepare("DELETE FROM pins WHERE id = ?").run(a)},"deleteTestimonial",0,a=>{e().prepare("DELETE FROM testimonials WHERE id = ?").run(a)},"getFeedback",0,()=>e().prepare("SELECT * FROM feedback ORDER BY created_at DESC").all(),"getPins",0,()=>e().prepare("SELECT * FROM pins ORDER BY created_at DESC").all(),"getTestimonials",0,()=>e().prepare("SELECT * FROM testimonials ORDER BY created_at DESC").all(),"updatePin",0,a=>{let b=e(),c=Object.keys(a).filter(a=>"id"!==a).map(a=>`${a} = ?`).join(", "),d=Object.keys(a).filter(a=>"id"!==a).map(b=>a[b]);b.prepare(`UPDATE pins SET ${c} WHERE id = ?`).run(...d,a.id)},"updateTestimonial",0,a=>{let b=e(),c=Object.keys(a).filter(a=>"id"!==a).map(a=>`${a} = ?`).join(", "),d=Object.keys(a).filter(a=>"id"!==a).map(b=>a[b]);b.prepare(`UPDATE testimonials SET ${c} WHERE id = ?`).run(...d,a.id)}])},5869,a=>{"use strict";a.s([],2016),a.i(2016);var b=a.i(56004);a.s(["401b57c6dd744a99092ed99ba1c06511ce1231b190",()=>b.addPinFn,"4044a43454ad2fd629c8746e393faea9d53b37e9a2",()=>b.deleteTestimonialFn,"40beaf1b9d8b2910503cfb6c68c127fcb7a669d5ac",()=>b.deletePinFn,"40d1e7e121c280064a184bb4e736daedcee66df9b7",()=>b.deleteFeedbackFn,"40f82891040aa3f44bfaab89890c1b98e81d33da6c",()=>b.addTestimonialFn],5869)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0l6pm~f._.js.map