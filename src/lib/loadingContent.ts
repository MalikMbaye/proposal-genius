export interface LoadingVideo {
  id: number;
  videoUrl: string;
  headlines: string[];
}

export const loadingVideos: LoadingVideo[] = [
  {
    id: 1,
    videoUrl: "/videos/loading/robot-assembly.mp4",
    headlines: [
      "Your AI proposal team is on it. Maybe grab an espresso?",
      "Your deck is being assembled by robots who don't need sleep."
    ]
  },
  {
    id: 2,
    videoUrl: "/videos/loading/wes-anderson-factory.mp4",
    headlines: [
      "We're building you a million-dollar proposal. This takes a minute.",
      "Good things come to those who wait. Great proposals come to you."
    ]
  },
  {
    id: 3,
    videoUrl: "/videos/loading/panda-unicycle.mp4",
    headlines: [
      "Deploying proposal pandas...",
      "Your proposal army is working overtime."
    ]
  },
  {
    id: 4,
    videoUrl: "/videos/loading/coffee-brew.mp4",
    headlines: [
      "Your proposal is brewing. Take a moment.",
      "Sit back. Quality takes time."
    ]
  },
  {
    id: 5,
    videoUrl: "/videos/loading/control-room.mp4",
    headlines: [
      "Your butler bots are ironing your pitch deck.",
      "Robots are typing very fast right now."
    ]
  },
  {
    id: 6,
    videoUrl: "/videos/loading/intern-slapstick.mp4",
    headlines: [
      "Our intern is handling this. Pray for him.",
      "Minor chaos, major results. Stand by."
    ]
  },
  {
    id: 7,
    videoUrl: "/videos/loading/kitchen-chaos.mp4",
    headlines: [
      "Too many cooks? Never. Your proposal is being prepared.",
      "Cooking up something special. Almost ready."
    ]
  },
  {
    id: 8,
    videoUrl: "/videos/loading/heist.mp4",
    headlines: [
      "Executing proposal heist. Stand by.",
      "Your deck is being extracted from the vault."
    ]
  },
  {
    id: 9,
    videoUrl: "/videos/loading/yoga-chaos.mp4",
    headlines: [
      "Chaos in the background. Zen in the foreground.",
      "We're stressed so you don't have to be."
    ]
  }
];

// Track recently shown videos to avoid immediate repeats
let recentVideoIds: number[] = [];
const MAX_RECENT = 3;

export function getRandomLoadingContent(): { videoUrl: string; headline: string } {
  // Filter out recently shown videos
  const availableVideos = loadingVideos.filter(v => !recentVideoIds.includes(v.id));
  
  // If all videos have been shown recently, reset
  const videosToChooseFrom = availableVideos.length > 0 ? availableVideos : loadingVideos;
  
  const video = videosToChooseFrom[Math.floor(Math.random() * videosToChooseFrom.length)];
  const headline = video.headlines[Math.floor(Math.random() * video.headlines.length)];
  
  // Track this video
  recentVideoIds.push(video.id);
  if (recentVideoIds.length > MAX_RECENT) {
    recentVideoIds.shift();
  }
  
  return { videoUrl: video.videoUrl, headline };
}

// Context-specific headlines for different generation types
export const contextSubtitles: Record<string, string[]> = {
  proposal: [
    "~30 seconds to a proposal that closes deals",
    "AI is writing copy that would take you hours"
  ],
  slides: [
    "2-5 minutes for a deck that wins pitches",
    "Go grab a coffee. We got this."
  ],
  contract: [
    "Generating airtight terms",
    "Legal magic in progress"
  ],
  invoice: [
    "Making getting paid look professional",
    "Invoice incoming..."
  ],
  "full-package": [
    "The whole enchilada. Give us a few minutes.",
    "Building your complete pitch arsenal"
  ]
};

export function getContextSubtitle(context: string): string {
  const subtitles = contextSubtitles[context] || contextSubtitles.proposal;
  return subtitles[Math.floor(Math.random() * subtitles.length)];
}
