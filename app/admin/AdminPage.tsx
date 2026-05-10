"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Plus, 
  Trash2, 
  Loader2,
  Check,
  LayoutDashboard,
  MessageSquare,
  Mail,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  addPinFn, 
  deletePinFn, 
  addTestimonialFn, 
  deleteTestimonialFn,
  deleteFeedbackFn,
  updatePinFn,
  updateTestimonialFn
} from "@/app/actions";
import { toast } from "sonner";
import type { Pin, Testimonial, Feedback } from "@/src/lib/db";
import { Camera, FileText, Edit, LogOut } from "lucide-react";

const pinSchema = z.object({
  name: z.string().min(1, "Name is required"),
  cat: z.string().min(1, "Category is required"),
  pdf: z.any().optional(),
  thumb: z.any().optional(),
});

const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  content: z.string().min(1, "Content is required"),
  rating: z.string(),
  avatar: z.any().optional(),
});

export default function AdminPage({ initialPins, initialTestimonials, initialFeedbacks }: { 
  initialPins: Pin[], 
  initialTestimonials: Testimonial[], 
  initialFeedbacks: Feedback[] 
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isAddTestimonialOpen, setIsAddTestimonialOpen] = useState(false);
  
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail === "nvision@admin.com" && loginPassword === "NehaVishal@123") {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Invalid credentials.");
    }
  };

  const pinForm = useForm<z.infer<typeof pinSchema>>({
    resolver: zodResolver(pinSchema),
    defaultValues: { name: "", cat: "", pdf: undefined, thumb: undefined },
  });

  const testimonialForm = useForm<z.infer<typeof testimonialSchema>>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: { name: "", role: "", content: "", rating: "5", avatar: undefined },
  });

  const onPinSubmit = async (values: z.infer<typeof pinSchema>) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("cat", values.cat);
      if (editingItem) formData.append("id", editingItem.id);
      
      const pdfFile = values.pdf;
      const thumbFile = values.thumb;

      if (!pdfFile && !editingItem) {
        toast.error("PDF file required");
        setIsSubmitting(false);
        return;
      }

      if (pdfFile instanceof File) formData.append("pdf", pdfFile);
      if (thumbFile instanceof File) formData.append("thumb", thumbFile);

      if (editingItem) {
        await updatePinFn(formData);
        toast.success("Project updated");
      } else {
        await addPinFn(formData);
        toast.success("Project created");
      }
      

      pinForm.reset();
      setEditingItem(null);
      setIsAddProjectOpen(false);
    } catch (error) {
      toast.error("Save failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onTestimonialSubmit = async (values: z.infer<typeof testimonialSchema>) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("role", values.role);
      formData.append("content", values.content);
      formData.append("rating", values.rating);
      if (editingItem) formData.append("id", editingItem.id);
      
      const avatarFile = values.avatar;
      if (avatarFile) formData.append("avatar", avatarFile);

      if (editingItem) {
        await updateTestimonialFn(formData);
        toast.success("Review updated");
      } else {
        await addTestimonialFn(formData);
        toast.success("Review created");
      }
      
      testimonialForm.reset();
      setEditingItem(null);
      setIsAddTestimonialOpen(false);
    } catch (error) {
      toast.error("Save failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const regenerateThumbnail = async (pin: Pin) => {
    toast.loading("Generating thumbnail...", { id: "thumb-gen" });
    try {
      const pdfUrl = pin.pdf_path;
      // Load PDF and render first page to canvas
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = "/scripts/pdf.worker.min.mjs";
      
      const loadingTask = pdfjs.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({ canvasContext: context!, viewport, canvas }).promise;
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
      
      const formData = new FormData();
      formData.append("id", pin.id);
      formData.append("name", pin.name);
      formData.append("cat", pin.cat);
      formData.append("autoThumb", dataUrl);
      
      await updatePinFn(formData);
      toast.success("Thumbnail regenerated", { id: "thumb-gen" });
    } catch (error) {
      console.error(error);
      toast.error("Generation failed", { id: "thumb-gen" });
    }
  };

  const executeDelete = async (id: string, type: 'pin' | 'testimonial' | 'feedback') => {
    try {
      if (type === 'pin') await deletePinFn(id);
      else if (type === 'testimonial') await deleteTestimonialFn(id);
      else if (type === 'feedback') await deleteFeedbackFn(id);
      
      toast.success("Deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-sm space-y-10 animate-scaleIn">
          <div className="text-center space-y-4">
            <img src="/nvision-logo.png" alt="NVision" className="h-10 w-auto mx-auto brightness-125" />
            <div className="space-y-1">
              <h1 className="text-xl font-bold tracking-tight text-white uppercase tracking-[0.2em]">Private Console</h1>
              <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Identity verification required</p>
            </div>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">Email</label>
                <Input 
                  type="email" 
                  value={loginEmail} 
                  onChange={(e) => setLoginEmail(e.target.value)} 
                  className="bg-zinc-900/50 border-zinc-800 h-12 focus:border-white transition-all rounded-none text-xs"
                  placeholder="admin@nvision.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">Password</label>
                <Input 
                  type="password" 
                  value={loginPassword} 
                  onChange={(e) => setLoginPassword(e.target.value)} 
                  className="bg-zinc-900/50 border-zinc-800 h-12 focus:border-white transition-all rounded-none text-xs"
                  placeholder="••••••••"
                  required
                />
              </div>
              {loginError && (
                <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-widest animate-pulse">{loginError}</p>
              )}
            </div>
            <Button type="submit" className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-bold uppercase tracking-[0.2em] text-[10px] rounded-none shadow-2xl">
              Access Dashboard
            </Button>
          </form>
          
          <div className="text-center">
            <button className="text-zinc-600 text-[9px] uppercase tracking-widest hover:text-white transition-colors" onClick={() => window.location.href = "/"}>
              Return to Gallery
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] font-sans text-zinc-100">
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur-md px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/nvision-logo.png" alt="NVision" className="h-8 w-auto brightness-110" />
          <div className="h-4 w-px bg-zinc-800" />
          <span className="font-semibold text-xs tracking-widest text-zinc-500 uppercase">Admin Console</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild className="border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-none h-9">
            <a href="/" target="_blank" className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              Live Site
            </a>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsAuthenticated(false)} className="text-zinc-500 hover:text-red-400 rounded-none h-9 px-4">
            <LogOut className="w-3.5 h-3.5 mr-2" />
            Exit
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-10">
        <Tabs defaultValue="projects" className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-800 pb-4">
            <TabsList className="bg-transparent h-auto p-0 gap-8 justify-start">
              <TabsTrigger value="projects" className="rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent px-0 py-2 shadow-none font-bold uppercase text-[10px] tracking-widest text-zinc-500 data-[state=active]:text-white transition-all">Projects</TabsTrigger>
              <TabsTrigger value="testimonials" className="rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent px-0 py-2 shadow-none font-bold uppercase text-[10px] tracking-widest text-zinc-500 data-[state=active]:text-white transition-all">Reviews</TabsTrigger>
              <TabsTrigger value="feedback" className="rounded-none border-b-2 border-transparent data-[state=active]:border-white data-[state=active]:bg-transparent px-0 py-2 shadow-none font-bold uppercase text-[10px] tracking-widest text-zinc-500 data-[state=active]:text-white transition-all">Inquiries</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center">
              <TabsContent value="projects" className="m-0">
                <Dialog open={isAddProjectOpen} onOpenChange={(open) => {
                  if (open && !editingItem) {
                    pinForm.reset({ name: "", cat: "", pdf: undefined, thumb: undefined });
                  }
                  if (!open) setEditingItem(null);
                  setIsAddProjectOpen(open);
                }}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-white text-black hover:bg-zinc-200 rounded-none px-6 font-bold uppercase text-[10px] tracking-widest">
                      <Plus className="w-3.5 h-3.5 mr-2" />
                      Add Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-zinc-950 border-zinc-800 text-white animate-none duration-0">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-bold tracking-tight">Project Details</DialogTitle>
                      <DialogDescription className="text-zinc-500 text-xs">Enter details and upload files for your portfolio item.</DialogDescription>
                    </DialogHeader>
                    <Form {...pinForm}>
                      <form onSubmit={pinForm.handleSubmit(onPinSubmit)} className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={pinForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs uppercase tracking-widest text-zinc-500">Project Name</FormLabel>
                                <FormControl><Input placeholder="e.g. Ride Smart" {...field} className="bg-zinc-900 border-zinc-800" /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={pinForm.control}
                            name="cat"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs uppercase tracking-widest text-zinc-500">Category</FormLabel>
                                <FormControl><Input placeholder="e.g. Pitch Deck" {...field} className="bg-zinc-900 border-zinc-800" /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={pinForm.control}
                            name="pdf"
                            render={({ field: { value, onChange, ...field } }) => (
                              <FormItem>
                                <FormLabel className="text-xs uppercase tracking-widest text-zinc-500">PDF File</FormLabel>
                                <FormControl>
                                  <div className="relative group cursor-pointer border-2 border-dashed border-zinc-800 rounded-lg p-4 hover:border-white/50 transition-colors bg-zinc-900/50">
                                    <Input 
                                      type="file" 
                                      accept=".pdf" 
                                      className="absolute inset-0 opacity-0 cursor-pointer" 
                                      onBlur={field.onBlur}
                                      name={field.name}
                                      ref={field.ref}
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) onChange(file);
                                      }}
                                    />
                                    <div className="flex flex-col items-center gap-2 pointer-events-none">
                                      <FileText className="w-6 h-6 text-zinc-600 group-hover:text-white transition-colors" />
                                      <span className="text-[10px] text-zinc-500 truncate max-w-full">
                                        {value instanceof File ? value.name : value ? "Current PDF" : "Select PDF"}
                                      </span>
                                    </div>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={pinForm.control}
                            name="thumb"
                            render={({ field: { value, onChange, ...field } }) => (
                              <FormItem>
                                <FormLabel className="text-xs uppercase tracking-widest text-zinc-500">Thumbnail (Optional)</FormLabel>
                                <FormControl>
                                  <div className="relative group cursor-pointer border-2 border-dashed border-zinc-800 rounded-lg p-4 hover:border-white/50 transition-colors bg-zinc-900/50">
                                    <Input 
                                      type="file" 
                                      accept="image/*" 
                                      className="absolute inset-0 opacity-0 cursor-pointer" 
                                      onBlur={field.onBlur}
                                      name={field.name}
                                      ref={field.ref}
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) onChange(file);
                                      }}
                                    />
                                    <div className="flex flex-col items-center gap-2 pointer-events-none">
                                      <Camera className="w-6 h-6 text-zinc-600 group-hover:text-white transition-colors" />
                                      <span className="text-[10px] text-zinc-500 truncate max-w-full">
                                        {value instanceof File ? value.name : value ? "Current Thumb" : "Select Image"}
                                      </span>
                                    </div>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <Button type="submit" disabled={isSubmitting} className="w-full bg-white hover:bg-zinc-200 text-black font-bold uppercase tracking-widest py-6">
                          {isSubmitting ? "Processing..." : "Save Project"}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </TabsContent>
              <TabsContent value="testimonials" className="m-0">
                <Dialog open={isAddTestimonialOpen} onOpenChange={(open) => {
                  if (open && !editingItem) {
                    testimonialForm.reset({ name: "", role: "", content: "", rating: "5", avatar: undefined });
                  }
                  if (!open) setEditingItem(null);
                  setIsAddTestimonialOpen(open);
                }}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-white text-black hover:bg-zinc-200 rounded-none px-6 font-bold uppercase text-[10px] tracking-widest">
                      <Plus className="w-3.5 h-3.5 mr-2" />
                      Add Review
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-zinc-950 border-zinc-800 text-white animate-none duration-0">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-bold tracking-tight">New Review</DialogTitle>
                      <DialogDescription className="text-zinc-500 text-xs">Add a new client testimonial to your showcase.</DialogDescription>
                    </DialogHeader>
                    <Form {...testimonialForm}>
                      <form onSubmit={testimonialForm.handleSubmit(onTestimonialSubmit)} className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField control={testimonialForm.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">Client</FormLabel><FormControl><Input {...field} className="bg-zinc-900 border-zinc-800 focus:ring-white" /></FormControl></FormItem>
                          )} />
                          <FormField control={testimonialForm.control} name="role" render={({ field }) => (
                            <FormItem><FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">Role</FormLabel><FormControl><Input {...field} className="bg-zinc-900 border-zinc-800 focus:ring-white" /></FormControl></FormItem>
                          )} />
                        </div>
                        <FormField control={testimonialForm.control} name="rating" render={({ field }) => (
                          <FormItem><FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">Rating</FormLabel><select {...field} className="w-full h-10 bg-zinc-900 border border-zinc-800 rounded-md px-3 text-sm focus:ring-white focus:outline-none"><option value="5">5 Stars</option><option value="4">4 Stars</option><option value="3">3 Stars</option></select></FormItem>
                        )} />
                        <FormField control={testimonialForm.control} name="content" render={({ field }) => (
                          <FormItem><FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">Content</FormLabel><FormControl><Textarea {...field} className="bg-zinc-900 border-zinc-800 min-h-[100px] focus:ring-white" /></FormControl></FormItem>
                        )} />
                        <FormField
                          control={testimonialForm.control}
                          name="avatar"
                          render={({ field: { value, onChange, ...field } }) => (
                            <FormItem>
                              <FormLabel className="text-zinc-400 text-xs uppercase tracking-wider">Avatar</FormLabel>
                              <FormControl>
                                <div className="relative group cursor-pointer border border-dashed border-zinc-800 rounded-lg p-3 hover:border-white/50 transition-colors bg-zinc-900/50">
                                  <Input 
                                    type="file" 
                                    accept="image/*" 
                                    className="absolute inset-0 opacity-0 cursor-pointer" 
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) onChange(file);
                                    }}
                                    {...field}
                                  />
                                  <div className="flex flex-col items-center gap-1 pointer-events-none">
                                    <Camera className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                                    <span className="text-[10px] text-zinc-500 truncate max-w-full">
                                      {value instanceof File ? value.name : value ? "Current Avatar" : "Select Image"}
                                    </span>
                                  </div>
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <DialogFooter><Button type="submit" disabled={isSubmitting} className="w-full bg-white text-black hover:bg-zinc-200">Save Review</Button></DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </TabsContent>
            </div>
          </div>

          {/* PROJECTS */}
          <TabsContent value="projects" className="mt-0">
            <div className="border border-zinc-800 rounded-none overflow-hidden bg-zinc-950/50">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900/50 border-b border-zinc-800">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold uppercase text-[9px] tracking-[0.2em] text-zinc-500">Project</th>
                    <th className="px-6 py-4 text-left font-bold uppercase text-[9px] tracking-[0.2em] text-zinc-500">Category</th>
                    <th className="px-6 py-4 text-right font-bold uppercase text-[9px] tracking-[0.2em] text-zinc-500 w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {initialPins.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-900/30 transition-colors group">
                      <td className="px-6 py-4 font-medium text-zinc-200">{p.name}</td>
                      <td className="px-6 py-4 text-zinc-500">{p.cat}</td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-zinc-500 hover:text-amber-500 hover:bg-amber-500/10"
                          title="Regenerate Thumbnail"
                          onClick={() => regenerateThumbnail(p)}
                        >
                          <Camera className="w-3.5 h-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-zinc-500 hover:text-white hover:bg-zinc-800"
                          onClick={() => {
                            setEditingItem(p);
                            pinForm.reset({ 
                              name: p.name, 
                              cat: p.cat,
                              pdf: p.pdf_path,
                              thumb: p.thumb_path
                            });
                            setIsAddProjectOpen(true);
                          }}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-zinc-600 hover:text-red-500 hover:bg-red-500/10">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-zinc-950 border-zinc-800 animate-none duration-0">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">Delete this project?</AlertDialogTitle>
                              <AlertDialogDescription className="text-zinc-400">This action cannot be undone. This project will be removed from your portfolio.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white">Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => executeDelete(p.id, 'pin')} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))}
                  {initialPins.length === 0 && (
                    <tr><td colSpan={3} className="px-6 py-12 text-center text-slate-400 italic">Empty.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* REVIEWS */}
          <TabsContent value="testimonials" className="mt-0">
            <div className="border border-zinc-800 rounded-none overflow-hidden bg-zinc-950/50">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900/50 border-b border-zinc-800">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold uppercase text-[9px] tracking-[0.2em] text-zinc-500">Client</th>
                    <th className="px-6 py-4 text-left font-bold uppercase text-[9px] tracking-[0.2em] text-zinc-500">Rating</th>
                    <th className="px-6 py-4 text-right font-bold uppercase text-[9px] tracking-[0.2em] text-zinc-500 w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {initialTestimonials.map((t) => (
                    <tr key={t.id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-zinc-200">{t.name}</div>
                        <div className="text-[9px] text-zinc-500 uppercase tracking-[0.15em] mt-1">{t.role}</div>
                      </td>
                      <td className="px-6 py-4 text-amber-500 font-bold">{t.rating} ★</td>
                      <td className="px-6 py-4 text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-zinc-600 hover:text-red-500 hover:bg-red-500/10">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-zinc-950 border-zinc-800 animate-none duration-0">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">Delete review?</AlertDialogTitle>
                              <AlertDialogDescription className="text-zinc-400">Are you sure you want to remove this client testimonial?</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white">Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => executeDelete(t.id, 'testimonial')} className="bg-red-600 text-white">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* INQUIRIES */}
          <TabsContent value="feedback" className="mt-0">
            <div className="border border-zinc-800 rounded-none overflow-hidden bg-zinc-950/50">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900/50 border-b border-zinc-800">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold uppercase text-[9px] tracking-[0.2em] text-zinc-500">Sender</th>
                    <th className="px-6 py-4 text-left font-bold uppercase text-[9px] tracking-[0.2em] text-zinc-500">Message</th>
                    <th className="px-6 py-4 text-right font-bold uppercase text-[9px] tracking-[0.2em] text-zinc-500 w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {initialFeedbacks.map((f) => (
                    <tr key={f.id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-zinc-200">{f.name}</div>
                        <div className="text-[11px] text-zinc-500">{f.email}</div>
                      </td>
                      <td className="px-6 py-4 text-zinc-400 max-w-md truncate">{f.message}</td>
                      <td className="px-6 py-4 text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-zinc-600 hover:text-red-500 hover:bg-red-500/10">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-zinc-950 border-zinc-800 animate-none duration-0">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">Delete inquiry?</AlertDialogTitle>
                              <AlertDialogDescription className="text-zinc-400">Are you sure you want to remove this client inquiry?</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white">Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => executeDelete(f.id, 'feedback')} className="bg-red-600 text-white">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
