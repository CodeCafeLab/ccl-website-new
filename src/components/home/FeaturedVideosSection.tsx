
"use client";

import { useState, useEffect, useRef } from "react";
import type { FeaturedVideo, YouTubeShort } from "@/types";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Film, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api";
import FirebaseVideoPlayer from "../common/FirebaseVideoPlayer"; // Import the new component
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface QuickBiteVideo {
  id: number;
  title: string;
  video_url: string;
  duration: string;
  category: string;
  tags: string[];
  author: string;
  featured: number;
}

export default function FeaturedVideosSection() {
  const [selectedVideoSrc, setSelectedVideoSrc] = useState<string | null>(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const videoModalRef = useRef<HTMLVideoElement>(null);

  const [featuredVideos, setFeaturedVideos] = useState<QuickBiteVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleVideoClick = (videoSrc: string, title: string) => {
    setSelectedVideoSrc(videoSrc);
    setSelectedVideoTitle(title);
    setIsModalOpen(true);
  };

  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setSelectedVideoSrc(null);
      setSelectedVideoTitle(null);
      if (videoModalRef.current) {
        videoModalRef.current.pause();
      }
    }
  };

  useEffect(() => {
    if (isModalOpen && videoModalRef.current && selectedVideoSrc) {
      videoModalRef.current.load();
      videoModalRef.current.play().catch((error) => {
        console.warn("Modal video autoplay prevented:", error);
      });
    }
  }, [isModalOpen, selectedVideoSrc]);

  // Fetch videos on mount
  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchVideos = async () => {
      try {
        // Call backend directly on port 9002
        const response = await apiClient.get("/quick-bites");
        const data = response.data;
        // Ensure data is an array
        setFeaturedVideos(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error("Error fetching videos:", err);
        // Don't set error if it's a network or timeout issue - just show empty list
        if (err.code === 'ERR_NETWORK' || err.code === 'ECONNABORTED' || err.message?.includes('Network') || err.message?.includes('timeout')) {
          console.warn("Network/timeout error - backend may be unavailable on port 9002");
          setFeaturedVideos([]);
        } else {
          setError(err.message || "Failed to load videos");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const getSafeImageUrl = (url?: string | null) => {
    if (url && url.trim() !== '') return url;
    return 'https://placehold.co/600x338.png'; // Fallback image with 16:9 ratio
  };
  const fallbackPoster = 'https://placehold.co/600x338/F8F4ED/392013?text=CodeCafe+Vid';

  if (loading) {
    return (
      <section className="space-y-8 py-12 text-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
        <p className="text-muted-foreground">Loading featured videos...</p>
      </section>
    );
  }

  if (error || !featuredVideos || featuredVideos.length === 0) {
    return (
      <section className="space-y-8 py-12 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
        <p className="text-destructive-foreground font-semibold">
          {error ? "Could not load videos" : "No videos available"}
        </p>
        {error && <p className="text-xs text-muted-foreground">{error}</p>}
      </section>
    );
  }

  const youtubeEmbedUrl = "https://www.youtube.com/embed/6J_DGUZ-6Lo";
  
  return (
    <>
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <Film className="h-10 w-10 text-primary" />
            Let's See Whats Brewing In Codecafe Lab
          </h2>
          <p className="text-muted-foreground">
            Quick bites & in-depth looks at what we do.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Featured Quick Bites (Horizontally Scrollable) */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-center lg:text-left">
              Featured Quick Bites
            </h3>
            {featuredVideos.length > 0 ? (
              <div className="flex space-x-4 overflow-x-auto ">
                {featuredVideos.map((video) => (
                  <div
                    key={video.id}
                    className="block flex-shrink-0 w-48 group cursor-pointer"
                    onClick={() => handleVideoClick(video.video_url, video.title)}
                  >
                    <FirebaseVideoPlayer
                        videoSrc={video.video_url}
                        posterSrc={fallbackPoster}
                        title={video.title}
                        aspectRatio="9/16"
                        autoPlay
                        loop
                        muted
                        className="transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">No featured videos available.</p>
            )}
          </div>

          {/* Right Column: Main YouTube Embed */}
          <div className="space-y-6">
            
            <div className="w-full h-auto aspect-video rounded-lg overflow-hidden shadow-lg mt-12">
              <iframe
                width="100%"
                height="100%"
                src={youtubeEmbedUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="border-0 w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={isModalOpen} onOpenChange={handleModalOpenChange}>
        <DialogContent
          className={cn(
            "bg-black sm:max-w-4xl w-full p-0 overflow-hidden aspect-video border-0 shadow-lg rounded-lg"
          )}
        >
          <VisuallyHidden>
            <DialogTitle>{selectedVideoTitle || 'Video Player'}</DialogTitle>
          </VisuallyHidden>
          {selectedVideoSrc && (
             <video
                ref={videoModalRef}
                src={selectedVideoSrc}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain bg-black"
              ></video>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
