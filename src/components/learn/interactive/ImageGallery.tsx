"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  className?: string;
}

/**
 * Interactive image gallery with click-to-expand lightbox,
 * hover zoom effects, and responsive grid layout.
 */
export default function ImageGallery({ images, className = "" }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = useCallback((idx: number) => {
    setSelectedIndex(idx);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
    document.body.style.overflow = "";
  }, []);

  const goNext = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  }, [selectedIndex, images.length]);

  const goPrev = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  }, [selectedIndex, images.length]);

  // Handle keyboard navigation in lightbox
  React.useEffect(() => {
    if (selectedIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIndex, closeLightbox, goNext, goPrev]);

  if (images.length === 0) return null;

  return (
    <>
      {/* Grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className={`grid gap-4 ${
          images.length === 1
            ? "grid-cols-1 max-w-2xl mx-auto"
            : images.length === 2
            ? "grid-cols-1 sm:grid-cols-2"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        } ${className}`}
      >
        {images.map((img, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => openLightbox(idx)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openLightbox(idx);
              }
            }}
            className="group relative rounded-2xl overflow-hidden border-2 border-amber-200/60 bg-white shadow-sm hover:shadow-lg hover:border-amber-300 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 shadow-lg">
                <ZoomIn className="w-6 h-6 text-amber-700" />
              </div>
            </div>
            {img.caption && (
              <div className="p-3 bg-gray-50 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-700 text-center leading-snug">
                  {img.caption}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-4xl w-full max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full">
                <Image
                  src={images[selectedIndex].src}
                  alt={images[selectedIndex].alt}
                  width={1200}
                  height={750}
                  className="w-full h-auto max-h-[75vh] object-contain rounded-lg"
                  priority
                />
              </div>
              {images[selectedIndex].caption && (
                <p className="text-center text-sm text-white/80 mt-4 font-medium">
                  {images[selectedIndex].caption}
                </p>
              )}
              {images.length > 1 && (
                <p className="text-center text-xs text-white/50 mt-2">
                  {selectedIndex + 1} of {images.length} · Use ← → keys to navigate
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
