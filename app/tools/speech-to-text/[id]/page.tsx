"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowLeft,
  ChevronUp,
  Download,
  Loader2,
  MoreHorizontal,
  Pause,
  Play,
  Redo2,
  Search,
  Undo2,
  UploadCloud,
  VolumeX,
  Volume2,
  Maximize,
  AudioLines,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Segment {
  start: number;
  end: number;
  speaker: string;
  text: string;
  emotion?: string;
  polished_text?: string;
}

interface Message {
  id: number;
  message: string;
  is_system: number;
  created_at: string;
  audio_url?: string;
  segments: Segment[];
  formatted_text: string;
  speakers: string[];
  overall_emotion?: string;
  polished_text?: string;
}

interface Session {
  chat_id: number;
  title: string;
  messages: Message[];
  created_at?: string;
  updated_at?: string;
}

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const segmentVariants = {
  initial: { opacity: 0, x: -20, scale: 0.95 },
  animate: { opacity: 1, x: 0, scale: 1 },
  hover: { scale: 1.01, x: 4 },
  tap: { scale: 0.98 },
};

const timelineVariants = {
  initial: { scaleX: 0, opacity: 0 },
  animate: { scaleX: 1, opacity: 1 },
  hover: { scaleY: 1.1 },
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { type: "spring", stiffness: 400 } },
  tap: { scale: 0.95 },
};

const playButtonVariants = {
  playing: {
    scale: [1, 1.1, 1],
    boxShadow: [
      "0 0 0 0 rgba(59, 130, 246, 0.7)",
      "0 0 0 10px rgba(59, 130, 246, 0)",
      "0 0 0 0 rgba(59, 130, 246, 0)",
    ],
  },
  hover: { scale: 1.1, rotate: 5 },
  tap: { scale: 0.9 },
};

// Define speaker colors with theme variables
const SPEAKER_COLORS: Record<string, string> = {
  SPEAKER_00: "bg-chart-1",
  SPEAKER_01: "bg-chart-2",
  SPEAKER_02: "bg-chart-3",
  SPEAKER_03: "bg-chart-4",
  SPEAKER_04: "bg-chart-5",
};

// Define emotion colors and icons
const EMOTION_COLORS: Record<string, string> = {
  hap: "bg-green-500/20 text-green-700 border-green-500/30",
  sad: "bg-blue-500/20 text-blue-700 border-blue-500/30",
  ang: "bg-red-500/20 text-red-700 border-red-500/30",
  neu: "bg-gray-500/20 text-gray-700 border-gray-500/30",
  sur: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
  fea: "bg-purple-500/20 text-purple-700 border-purple-500/30",
};

const EMOTION_LABELS: Record<string, string> = {
  hap: "Happy",
  sad: "Sad",
  ang: "Angry",
  neu: "Neutral",
  sur: "Surprised",
  fea: "Fear",
};

// Format time in MM:SS.ms format (for more precise timestamps)
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${mins}:${secs.toString().padStart(2, "0")}.${ms
    .toString()
    .padStart(2, "0")}`;
};

// Enhanced Speaker Avatar component with emotions
const SpeakerAvatar = ({
  speaker,
  isActive = false,
  emotion,
}: {
  speaker: string;
  isActive?: boolean;
  emotion?: string;
}) => {
  const colorClass = SPEAKER_COLORS[speaker] || "bg-muted";
  const initial = speaker.replace("SPEAKER_", "");
  const emotionColorClass =
    emotion && EMOTION_COLORS[emotion] ? EMOTION_COLORS[emotion] : "";

  return (
    <motion.div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-primary-foreground text-xs font-medium ${colorClass} cursor-pointer relative overflow-hidden`}
      whileHover={{
        scale: 1.2,
        rotate: 10,
        transition: { type: "spring", stiffness: 300 },
      }}
      whileTap={{ scale: 0.9 }}
      animate={
        isActive
          ? {
              scale: [1, 1.1, 1],
              transition: { duration: 2, repeat: Infinity },
            }
          : {}
      }
    >
      {initial}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      {emotion && EMOTION_COLORS[emotion] && (
        <motion.div
          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-background ${
            emotionColorClass.split(" ")[0]
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
          title={EMOTION_LABELS[emotion] || emotion}
        />
      )}
    </motion.div>
  );
};

// Emotion Badge component
const EmotionBadge = ({ emotion }: { emotion?: string }) => {
  if (!emotion || !EMOTION_COLORS[emotion]) return null;

  const colorClass = EMOTION_COLORS[emotion];
  const label = EMOTION_LABELS[emotion] || emotion;

  return (
    <motion.div
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, delay: 0.1 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {label}
    </motion.div>
  );
};

// Animated Waveform Component
const AnimatedWaveform = ({
  isPlaying,
  segments,
}: {
  isPlaying: boolean;
  segments: any[];
}) => {
  return (
    <div className="flex items-center space-x-1 h-8">
      {Array.from({ length: 20 }, (_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-primary rounded-full"
          animate={{
            height: isPlaying ? [4, 16, 8, 24, 12, 6] : [4],
            opacity: isPlaying ? [0.3, 1, 0.7, 1, 0.5, 0.3] : [0.3],
          }}
          transition={{
            duration: 1,
            repeat: isPlaying ? Infinity : 0,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default function SessionPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeSegment, setActiveSegment] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Animation springs
  const progress = useSpring(0);
  const scale = useTransform(progress, [0, 1], [0.8, 1]);

  // Calculate total audio duration
  const maxDuration = currentMessage?.segments?.length
    ? Math.max(...currentMessage.segments.map((s) => s.end))
    : 0;

  // Generate time markers with more precise intervals
  const generateTimeMarkers = (duration: number) => {
    const markers = [];
    const markerCount = 5;
    const interval = duration / markerCount;

    for (let i = 0; i <= markerCount; i++) {
      markers.push(formatTime(i * interval));
    }
    return markers;
  };

  const timeMarkers = generateTimeMarkers(maxDuration);

  useEffect(() => {
    async function fetchSessionData() {
      if (!sessionId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/stt/sessions/${sessionId}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to fetch session data");
        }

        const data = await response.json();
        setSession(data);

        // Set first message as current if available
        if (data.messages && data.messages.length > 0) {
          setCurrentMessage(data.messages[0]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Error fetching session:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSessionData();
  }, [sessionId]);

  // Handle audio playback
  const togglePlayback = () => {
    if (!audio && currentMessage?.audio_url) {
      const newAudio = new Audio(currentMessage.audio_url);
      newAudio.addEventListener("ended", () => setIsPlaying(false));
      newAudio.addEventListener("timeupdate", () => {
        setCurrentTime(newAudio.currentTime);
        progress.set(newAudio.currentTime / newAudio.duration);

        // Find active segment
        const segment = currentMessage.segments.find(
          (s) =>
            newAudio.currentTime >= s.start && newAudio.currentTime <= s.end
        );
        setActiveSegment(
          segment ? currentMessage.segments.indexOf(segment) : null
        );
      });
      newAudio.playbackRate = playbackRate;
      audioRef.current = newAudio;
      setAudio(newAudio);
      newAudio.play();
      setIsPlaying(true);
    } else if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle playback rate change
  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (audio) {
      audio.playbackRate = rate;
    }
  };

  // Handle message change
  const handleMessageChange = (message: Message) => {
    setCurrentMessage(message);
    if (audio) {
      audio.pause();
      setIsPlaying(false);
      setAudio(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-muted-foreground">Loading session data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-destructive/10 p-6 rounded-lg max-w-md text-center">
          <h2 className="text-lg font-medium mb-2">Error Loading Session</h2>
          <p className="text-destructive">{error}</p>
          <button
            onClick={() => (window.location.href = "/tools/speech-to-text")}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Back to Sessions
          </button>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-muted p-6 rounded-lg max-w-md text-center">
          <h2 className="text-lg font-medium mb-2">Session Not Found</h2>
          <p className="text-muted-foreground">
            The requested session could not be found.
          </p>
          <button
            onClick={() => (window.location.href = "/tools/speech-to-text")}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Back to Sessions
          </button>
        </div>
      </div>
    );
  }

  // Get unique speakers from current message
  const uniqueSpeakers = currentMessage?.segments
    ? [...new Set(currentMessage.segments.map((s) => s.speaker))]
    : [];

  return (
    <motion.div
      className="flex h-screen bg-background text-foreground"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Tabs
          defaultValue="transcript"
          className="flex-1 flex flex-col overflow-hidden"
        >
          {/* Enhanced Top Bar with animations */}
          <motion.header
            className="h-16 flex items-center justify-between px-6 border-b border-border backdrop-blur-sm bg-background/80"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center space-x-4">
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => (window.location.href = "/tools")}
                  className="mr-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              </motion.div>

              <TabsList className="bg-transparent p-0 h-16 border-b-0">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <TabsTrigger
                    value="transcript"
                    className="px-4 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground text-muted-foreground rounded-none h-full transition-all duration-200"
                  >
                    Transcript
                  </TabsTrigger>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <TabsTrigger
                    value="polished"
                    className="px-4 text-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground text-muted-foreground rounded-none h-full transition-all duration-200"
                  >
                    Polished Text
                  </TabsTrigger>
                </motion.div>
              </TabsList>
            </div>

            <div className="flex items-center space-x-3">
              <motion.span
                className="text-sm text-muted-foreground font-medium"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {session?.title}
              </motion.span>
              {currentMessage?.audio_url && (
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    size="sm"
                    onClick={() =>
                      window.open(currentMessage.audio_url, "_blank")
                    }
                    className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-8"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.header>

          {/* Enhanced Transcript Tab Content */}
          <TabsContent
            value="transcript"
            className="flex-1 overflow-y-auto p-8 space-y-4"
          >
            <AnimatePresence mode="wait">
              {!currentMessage ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <AudioLines className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No transcript available
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.05 }}
                >
                  {currentMessage.segments.map((segment, index) => (
                    <motion.div
                      key={index}
                      className="relative group"
                      variants={segmentVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                      whileTap="tap"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      {/* Segment Content */}
                      <div
                        className={`flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/30 transition-all duration-200 ${
                          activeSegment === index
                            ? "bg-primary/10 border-l-4 border-primary"
                            : ""
                        }`}
                      >
                        <motion.div
                          animate={
                            activeSegment === index
                              ? { scale: [1, 1.2, 1] }
                              : {}
                          }
                          transition={{ duration: 0.5 }}
                        >
                          <SpeakerAvatar
                            speaker={segment.speaker}
                            isActive={activeSegment === index}
                            emotion={segment.emotion}
                          />
                        </motion.div>

                        <div className="flex-1">
                          <motion.div
                            className="flex items-center space-x-3 mb-2"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.02 }}
                          >
                            <span className="font-semibold text-sm">
                              {segment.speaker}
                            </span>
                            <motion.span
                              className="text-xs text-muted-foreground/70 font-mono"
                              whileHover={{ scale: 1.05 }}
                            >
                              {formatTime(segment.start)}
                            </motion.span>
                            <EmotionBadge emotion={segment.emotion} />
                          </motion.div>

                          <motion.p
                            className="text-sm leading-relaxed mb-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.03 }}
                          >
                            {segment.text}
                          </motion.p>

                          {segment.polished_text && (
                            <motion.div
                              className="mt-2 p-2 bg-muted/30 rounded-md border-l-2 border-primary/20"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <div className="flex items-center space-x-2 mb-1">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                <span className="text-xs text-muted-foreground font-medium">
                                  Polished
                                </span>
                              </div>
                              <p className="text-xs text-foreground/80 leading-relaxed">
                                {segment.polished_text}
                              </p>
                            </motion.div>
                          )}

                          <motion.span
                            className="block text-xs text-muted-foreground/70 font-mono mt-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.04 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            {formatTime(segment.end)}
                          </motion.span>
                        </div>
                      </div>

                      {/* Enhanced Connector Line */}
                      {index < currentMessage.segments.length - 1 && (
                        <motion.div
                          className="absolute w-px bg-gradient-to-b from-border to-transparent ml-8"
                          style={{ height: "20px", top: "70px" }}
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ delay: index * 0.02, duration: 0.3 }}
                        />
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* Enhanced Polished Text Tab */}
          <TabsContent value="polished" className="flex-1 overflow-y-auto p-8">
            <AnimatePresence mode="wait">
              {!currentMessage?.polished_text ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                    <MoreHorizontal className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    No polished text available
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  className="whitespace-pre-wrap text-sm leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {currentMessage.polished_text}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>

        {/* Enhanced Bottom Player Bar */}
        <AnimatePresence>
          {currentMessage && (
            <motion.footer
              className="h-[240px] border-t border-border flex flex-col backdrop-blur-sm bg-background/95"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-1">
                {/* Enhanced Speaker List */}
                <motion.div
                  className="w-64 border-r border-border p-4 flex flex-col"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold">Speakers</h3>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Badge variant="secondary" className="text-xs px-2 py-1">
                        {uniqueSpeakers.length}
                      </Badge>
                    </motion.div>
                  </div>

                  <div className="space-y-2 flex-1 overflow-y-auto">
                    {uniqueSpeakers.map((speaker, index) => {
                      // Get speaker's emotions
                      const speakerSegments = currentMessage.segments.filter(
                        (s) => s.speaker === speaker
                      );
                      const emotions = [
                        ...new Set(
                          speakerSegments.map((s) => s.emotion).filter(Boolean)
                        ),
                      ];

                      return (
                        <motion.div
                          key={speaker}
                          className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center space-x-3">
                            <SpeakerAvatar
                              speaker={speaker}
                              emotion={emotions[0]} // Show first emotion as indicator
                            />
                            <div className="flex flex-col">
                              <span className="text-sm">{speaker}</span>
                              {emotions.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {emotions.slice(0, 2).map((emotion, i) => (
                                    <div
                                      key={i}
                                      className={`w-2 h-2 rounded-full ${
                                        emotion && EMOTION_COLORS[emotion]
                                          ? EMOTION_COLORS[emotion].split(
                                              " "
                                            )[0]
                                          : "bg-muted"
                                      }`}
                                      title={
                                        emotion && EMOTION_LABELS[emotion]
                                          ? EMOTION_LABELS[emotion]
                                          : emotion
                                      }
                                    />
                                  ))}
                                  {emotions.length > 2 && (
                                    <span className="text-xs text-muted-foreground">
                                      +{emotions.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <motion.div
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-6 h-6"
                            >
                              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                            </Button>
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Enhanced Timeline with Waveform */}
                <div className="flex-1 p-4 flex flex-col relative overflow-hidden">
                  <motion.div
                    className="h-8 flex items-center text-xs text-muted-foreground mb-3"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {timeMarkers.map((time, index) => (
                      <motion.div
                        key={time}
                        className="flex-1 text-center relative"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <span className="font-mono">{time}</span>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-px h-2 bg-border mt-1"></div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Animated Waveform Background */}
                  <div className="absolute inset-x-4 top-16 bottom-4 opacity-10">
                    <AnimatedWaveform
                      isPlaying={isPlaying}
                      segments={currentMessage.segments}
                    />
                  </div>

                  {/* Enhanced Timeline Tracks */}
                  <div className="flex-1 space-y-2 relative">
                    {uniqueSpeakers.map((speaker, speakerIndex) => {
                      const speakerSegments = currentMessage.segments.filter(
                        (s) => s.speaker === speaker
                      );
                      const colorClass = SPEAKER_COLORS[speaker] || "bg-muted";

                      return (
                        <motion.div
                          key={speaker}
                          className="h-12 relative rounded-md bg-muted/20"
                          initial={{ scaleX: 0, opacity: 0 }}
                          animate={{ scaleX: 1, opacity: 1 }}
                          transition={{
                            delay: speakerIndex * 0.1,
                            duration: 0.5,
                          }}
                        >
                          {speakerSegments.map((segment, i) => {
                            const startPercent =
                              (segment.start / maxDuration) * 100;
                            const widthPercent =
                              ((segment.end - segment.start) / maxDuration) *
                              100;
                            const isActive =
                              activeSegment ===
                              currentMessage.segments.indexOf(segment);

                            return (
                              <motion.div
                                key={i}
                                className={`absolute top-1 h-10 ${colorClass} rounded-md cursor-pointer shadow-sm`}
                                style={{
                                  left: `${startPercent}%`,
                                  width: `${widthPercent}%`,
                                }}
                                variants={timelineVariants}
                                initial="initial"
                                // animate="animate"
                                whileHover="hover"
                                transition={{ delay: i * 0.02 }}
                                animate={
                                  isActive
                                    ? {
                                        scale: [1, 1.05, 1],
                                        opacity: [0.8, 1, 0.8],
                                      }
                                    : { opacity: 0.8 }
                                }
                                title={`${formatTime(
                                  segment.start
                                )} - ${formatTime(segment.end)}`}
                              />
                            );
                          })}
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Playback Progress Line */}
                  <motion.div
                    className="absolute top-16 bottom-4 w-0.5 bg-primary shadow-lg"
                    style={{
                      left: `${
                        16 + (currentTime / maxDuration) * (100 - 32)
                      }px`,
                      opacity: isPlaying ? 1 : 0,
                    }}
                    animate={{
                      boxShadow: isPlaying
                        ? [
                            "0 0 0 0 rgba(59, 130, 246, 0.4)",
                            "0 0 20px 2px rgba(59, 130, 246, 0.2)",
                            "0 0 0 0 rgba(59, 130, 246, 0.4)",
                          ]
                        : "0 0 0 0 rgba(59, 130, 246, 0)",
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>

                {/* Enhanced Right Controls */}
                <motion.div
                  className="w-56 border-l border-border p-4 flex flex-col items-center justify-between"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-full flex flex-col items-center space-y-4">
                    <div className="flex items-center space-x-2 w-full">
                      <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                          <Search className="w-4 h-4" />
                        </Button>
                      </motion.div>
                      <Slider
                        defaultValue={[50]}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                          <Maximize className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            changePlaybackRate(
                              playbackRate === 1.0
                                ? 1.5
                                : playbackRate === 1.5
                                ? 2.0
                                : 1.0
                            )
                          }
                          className="text-xs h-8 px-3 font-mono"
                        >
                          {playbackRate.toFixed(1)}x
                        </Button>
                      </motion.div>

                      <motion.div
                        variants={playButtonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        animate={isPlaying ? "playing" : ""}
                      >
                        <Button
                          variant="default"
                          size="icon"
                          onClick={togglePlayback}
                          className="w-12 h-12 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 shadow-lg"
                        >
                          <AnimatePresence mode="wait">
                            {isPlaying ? (
                              <motion.div
                                key="pause"
                                initial={{ scale: 0, rotate: 180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: -180 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Pause className="w-5 h-5" />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="play"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 180 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Play className="w-5 h-5 ml-0.5" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Enhanced Message Selector */}
              {session.messages.length > 1 && (
                <motion.div
                  className="border-t border-border p-3 flex space-x-2 overflow-x-auto"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {session.messages.map((message, i) => (
                    <motion.div
                      key={message.id}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Button
                        onClick={() => handleMessageChange(message)}
                        variant={
                          currentMessage?.id === message.id
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className="text-xs whitespace-nowrap"
                      >
                        Message {i + 1}
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.footer>
          )}
        </AnimatePresence>
      </main>

      {/* Enhanced Right Sidebar */}
      <motion.aside
        className="w-80 border-l border-border bg-gradient-to-b from-muted/30 to-muted/10 p-6 flex flex-col backdrop-blur-sm"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div
          className="space-y-6 text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, staggerChildren: 0.1 }}
        >
          <motion.div
            className="p-4 rounded-lg bg-background/50 border border-border/50"
            whileHover={{ scale: 1.02, borderColor: "rgba(59, 130, 246, 0.3)" }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <span className="font-medium block text-xs text-muted-foreground mb-2">
              Title
            </span>
            <span className="text-sm font-medium" title={session?.title}>
              {session?.title}
            </span>
          </motion.div>

          {/* Emotion Overview */}
          {currentMessage && (
            <motion.div
              className="p-4 rounded-lg bg-background/50 border border-border/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="font-medium block text-xs text-muted-foreground mb-3">
                Emotion Analysis
              </span>
              <div className="space-y-2">
                {(() => {
                  const emotionCounts = currentMessage.segments.reduce(
                    (acc, segment) => {
                      if (segment.emotion) {
                        acc[segment.emotion] = (acc[segment.emotion] || 0) + 1;
                      }
                      return acc;
                    },
                    {} as Record<string, number>
                  );

                  return Object.entries(emotionCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([emotion, count]) => (
                      <motion.div
                        key={emotion}
                        className="flex items-center justify-between"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              EMOTION_COLORS[emotion]?.split(" ")[0] ||
                              "bg-muted"
                            }`}
                          />
                          <span className="text-xs">
                            {EMOTION_LABELS[emotion] || emotion}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          {count}
                        </Badge>
                      </motion.div>
                    ));
                })()}
              </div>
            </motion.div>
          )}

          <div>
            <span className="font-medium block text-xs text-muted-foreground">
              Created
            </span>
            <span>
              {currentMessage?.created_at &&
                new Date(currentMessage.created_at).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium block text-xs text-muted-foreground">
                Duration
              </span>
              <span>{formatTime(maxDuration)}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7 text-muted-foreground"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Download Audio</DropdownMenuItem>
                <DropdownMenuItem>Download Transcript</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>
      </motion.aside>
    </motion.div>
  );
}
