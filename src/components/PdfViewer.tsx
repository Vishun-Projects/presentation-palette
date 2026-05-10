"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { 
  X,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Edit,
  Trash2
} from "lucide-react";
import { Button } from "./ui/button";

// Dynamic import for react-pdf
let Document: any = null;
let Page: any = null;
let pdfjs: any = null;

interface PdfViewerProps {
  url: string;
  thumbnail?: string;
  title: string;
  category: string;
  onClose: () => void;
  isAdmin?: boolean;
}

export function PdfViewer(props: PdfViewerProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadPdf = async () => {
      const rp = await import("react-pdf");
      Document = rp.Document;
      Page = rp.Page;
      pdfjs = rp.pdfjs;
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
      setIsReady(true);
    };
    loadPdf();
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, []);

  if (!isReady || !Document || !Page) return null;

  return <PdfViewerInner {...props} />;
}

function PdfViewerInner({ url, title, category, onClose, isAdmin }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastPageChangeTime = useRef<number>(0);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  useEffect(() => {
    const updateDimensions = () => {
      if (scrollContainerRef.current) {
        setContainerWidth(scrollContainerRef.current.clientWidth);
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const changePage = useCallback((offset: number) => {
    const now = Date.now();
    if (now - lastPageChangeTime.current < 400) return;
    lastPageChangeTime.current = now;

    setPageNumber((prev) => {
      const next = prev + offset;
      if (next < 1) return 1;
      if (numPages && next > numPages) return 1;
      return next;
    });
    setProgress(0);
  }, [numPages]);

  // Auto-flip timer logic
  useEffect(() => {
    if (isPaused || isHolding || !numPages) return;
    const intervalMs = 30; 
    const totalDurationMs = 5000;
    const step = (intervalMs / totalDurationMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          changePage(1);
          return 0;
        }
        return prev + step;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPaused, isHolding, numPages, changePage]);

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "d") changePage(1);
      if (e.key === "ArrowLeft" || e.key === "a") changePage(-1);
      if (e.key === " " || e.key === "k") {
        e.preventDefault();
        setIsPaused(p => !p);
      }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [changePage, onClose]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      scrollContainerRef.current?.parentElement?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    let clientX: number;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
    } else if ('changedTouches' in e && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
    } else if ('clientX' in e) {
      clientX = e.clientX;
    } else {
      return;
    }

    const width = window.innerWidth;
    const xPercent = (clientX / width) * 100;

    if (xPercent < 30) {
      changePage(-1);
    } else if (xPercent > 70) {
      changePage(1);
    } else {
      setIsPaused(!isPaused);
    }
  };

  const startHold = (e: React.MouseEvent | React.TouchEvent) => {
    isLongPress.current = false;
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    
    holdTimerRef.current = setTimeout(() => {
      setIsHolding(true);
      isLongPress.current = true;
    }, 200);
  };

  const endHold = (e: React.MouseEvent | React.TouchEvent) => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    
    if (isLongPress.current) {
      setIsHolding(false);
      isLongPress.current = false;
      return;
    }

    setIsHolding(false);
    handleInteraction(e);
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-12">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fadeIn" 
        onClick={onClose}
      />
      
      <div 
        className="relative w-full h-full sm:rounded-2xl bg-black flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5 animate-scaleIn overflow-hidden select-none touch-none"
        onMouseDown={startHold}
        onMouseUp={endHold}
        onTouchStart={startHold}
        onTouchEnd={(e) => { e.preventDefault(); endHold(e); }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bars */}
        <div className="absolute top-4 left-4 right-4 z-50 flex gap-1.5 px-2 pointer-events-none">
          {Array.from({ length: numPages || 0 }).map((_, i) => {
            const index = i + 1;
            let barProgress = 0;
            if (index < pageNumber) barProgress = 100;
            else if (index === pageNumber) barProgress = progress;
            else barProgress = 0;

            return (
              <div key={i} className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                <div 
                  className={`h-full bg-gold/80 transition-all duration-75 ease-linear ${(isPaused || isHolding) && index === pageNumber ? 'opacity-40' : 'opacity-100'}`}
                  style={{ width: `${barProgress}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-10 pb-4 border-b border-white/5 bg-black/40 backdrop-blur-md z-30" onClick={e => e.stopPropagation()}>
          <div className="flex flex-col">
            <span className="text-[8px] tracking-[0.5em] uppercase text-gold/40 font-bold mb-1">{category}</span>
            <h2 className="font-serif text-lg text-warm/80 tracking-widest">{title}</h2>
          </div>

          <div className="flex items-center gap-4">
            {isAdmin && (
              <>
                <Button variant="ghost" size="icon" className="text-white/40 hover:text-blue-400"><Edit className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="text-white/40 hover:text-red-400"><Trash2 className="w-4 h-4" /></Button>
              </>
            )}
            <Button variant="ghost" size="sm" className="text-white/20 hidden sm:flex hover:text-gold" onClick={toggleFullscreen}>
              <Maximize2 className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-white/10 mx-1" />
            <Button variant="ghost" size="icon" className="text-white/40 hover:text-white hover:bg-red-500/10 h-10 w-10" onClick={onClose}><X className="w-6 h-6" /></Button>
          </div>
        </div>

        {/* PDF Content Area */}
        <div 
          ref={scrollContainerRef} 
          className="flex-1 bg-black overflow-hidden flex justify-center items-center relative py-6 px-4"
        >
          <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">
            <Document 
              file={url} 
              onLoadSuccess={onDocumentLoadSuccess} 
              loading={<div className="flex flex-col items-center gap-4"><div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin"></div></div>}
              className="max-w-full max-h-full flex items-center justify-center"
            >
              <div className="relative shadow-2xl transition-opacity duration-300 flex items-center justify-center max-w-full max-h-full">
                <Page 
                  pageNumber={pageNumber} 
                  width={1400} // High quality base
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  loading={<div className="h-[600px] w-full flex items-center justify-center text-gold/20 animate-pulse font-serif italic text-lg">NVISION...</div>}
                  className="max-w-full max-h-full [&>canvas]:max-w-full [&>canvas]:max-h-full [&>canvas]:h-auto [&>canvas]:w-auto [&>canvas]:object-contain shadow-2xl"
                />
              </div>
            </Document>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between px-8 py-6 border-t border-white/5 bg-black/80 z-30" onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
              {(isPaused || isHolding) ? <Play className="w-4 h-4 fill-current text-gold/60" /> : <Pause className="w-4 h-4 fill-current text-gold/60" />}
            </div>
            <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-white/30">
              {(isPaused || isHolding) ? 'Paused' : 'Playing'}
            </span>
          </div>
          <div className="text-[10px] tracking-[0.3em] uppercase font-bold text-white/20">
            {pageNumber} / {numPages || '--'}
          </div>
        </div>
      </div>
    </div>
  );
}
