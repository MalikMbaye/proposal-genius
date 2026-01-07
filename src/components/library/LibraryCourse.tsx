import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Video, Loader2 } from "lucide-react";

interface CourseVideo {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  duration_minutes: number | null;
  sort_order: number;
}

export function LibraryCourse() {
  const [videos, setVideos] = useState<CourseVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<CourseVideo | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const { data, error } = await supabase
      .from("library_videos")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error && data) {
      setVideos(data as CourseVideo[]);
      if (data.length > 0) {
        setSelectedVideo(data[0] as CourseVideo);
      }
    }
    setLoading(false);
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return null;
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-20">
        <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Course videos coming soon</h3>
        <p className="text-muted-foreground">
          Video content is being prepared and will be available shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Video player */}
      <div className="lg:col-span-2">
        {selectedVideo && (
          <div>
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
              <iframe
                src={selectedVideo.video_url}
                className="w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
            <h2 className="text-xl font-semibold mb-2">{selectedVideo.title}</h2>
            {selectedVideo.description && (
              <p className="text-muted-foreground">{selectedVideo.description}</p>
            )}
          </div>
        )}
      </div>

      {/* Video list */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
          Course Modules
        </h3>
        {videos.map((video, index) => (
          <Card
            key={video.id}
            className={`p-4 cursor-pointer transition-colors ${
              selectedVideo?.id === video.id
                ? "border-primary bg-primary/5"
                : "hover:border-primary/50"
            }`}
            onClick={() => setSelectedVideo(video)}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg shrink-0 ${
                selectedVideo?.id === video.id ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}>
                <Play className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs">
                    {index + 1}
                  </Badge>
                  {video.duration_minutes && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(video.duration_minutes)}
                    </span>
                  )}
                </div>
                <p className="font-medium text-sm truncate">{video.title}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
