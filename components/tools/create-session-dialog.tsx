"use client";

import { useState } from "react";
import { Plus, Upload, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateSessionDialogProps {
  onSessionCreated?: () => void;
}

export function CreateSessionDialog({
  onSessionCreated,
}: CreateSessionDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("kk");
  const [enableDiarization, setEnableDiarization] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      // Auto-generate title from filename if not set
      if (!title) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        setTitle(nameWithoutExt);
      }
    }
  };

  const handleCreateSession = async () => {
    setError("");

    if (!title.trim()) {
      setError("Please enter a session title");
      return;
    }

    if (!audioFile) {
      setError("Please select an audio file");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create session first
      const sessionResponse = await fetch("/api/stt/create-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
        }),
      });

      if (!sessionResponse.ok) {
        const error = await sessionResponse.json();
        throw new Error(error.detail || "Failed to create session");
      }

      const session = await sessionResponse.json();
      console.log("Session created successfully:", session);

      // Validate that we have a session ID
      const sessionId = session.chat_id || session.id;
      if (!sessionId) {
        console.error("Session response:", session);
        throw new Error("Session created but no ID returned");
      }

      // Step 2: Now upload and transcribe audio to the created session
      const formData = new FormData();
      formData.append("audio", audioFile);
      formData.append("language", language);
      formData.append("enable_diarization", enableDiarization.toString());

      console.log(`Attempting to transcribe to session ID: ${sessionId}`);

      const transcribeResponse = await fetch(
        `/api/stt/sessions/${sessionId}/transcribe`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!transcribeResponse.ok) {
        const error = await transcribeResponse.json();
        console.error("Transcription error:", error);
        throw new Error(error.detail || "Failed to transcribe audio");
      }

      const transcriptionResult = await transcribeResponse.json();
      console.log("Transcription completed:", transcriptionResult);

      // Reset form
      setTitle("");
      setAudioFile(null);
      setLanguage("kk");
      setEnableDiarization(false);
      setError("");
      setOpen(false);

      // Callback to refresh sessions list
      onSessionCreated?.();

      // Navigate to the new session
      window.location.href = `/tools/speech-to-text/${sessionId}`;
    } catch (error) {
      console.error("Create session error:", error);
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start px-2.5 md:px-2"
          size="icon"
        >
          <Plus className="w-4 h-4 " />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Session</DialogTitle>
          <DialogDescription>
            Upload an audio file to create a new transcription session.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Session Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter session title..."
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="audio">Audio File</Label>
            <div className="relative">
              <Input
                id="audio"
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                disabled={loading}
                className="cursor-pointer"
              />
              {audioFile && (
                <p className="text-xs text-muted-foreground mt-1">
                  Selected: {audioFile.name}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="language">Language</Label>
            <Select
              value={language}
              onValueChange={setLanguage}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kk">Kazakh</SelectItem>
                <SelectItem value="ru">Russian</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="auto">Auto-detect</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="diarization" className="text-sm font-medium">
              Enable Speaker Diarization
            </Label>
            <Switch
              id="diarization"
              checked={enableDiarization}
              onCheckedChange={setEnableDiarization}
              disabled={loading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleCreateSession} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Create & Transcribe
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
