"use client";

import * as React from "react";
import {
  ArchiveX,
  Command,
  FileStack,
  Plus,
  Trash2,
  Loader2,
  AudioLines,
} from "lucide-react";
import { useSessions } from "@/hooks/use-sessions";

import { NavUser } from "@/components/tools/nav-user";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { CreateSessionDialog } from "@/components/tools/create-session-dialog";

// This is sample data
const data = {
  navMain: [
    {
      title: "Sessions",
      url: "#",
      icon: FileStack,
      isActive: true,
    },
  ],
  sessions: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeItem, setActiveItem] = React.useState(data.navMain[0]);
  const { sessions, loading, error, refetch } = useSessions();
  const { setOpen } = useSidebar();

  const handleSessionsClick = () => {
    setActiveItem(data.navMain[0]);
    refetch(); // Refresh sessions when clicking on Sessions
    setOpen(true);
  };

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="#">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <AudioLines className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Whisper UI</span>
                    <span className="truncate text-xs">Transcription</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip={{
                      children: "Sessions",
                      hidden: false,
                    }}
                    onClick={handleSessionsClick}
                    isActive={activeItem?.title === "Sessions"}
                    className="px-2.5 md:px-2"
                  >
                    <FileStack />
                    <span>Sessions</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <CreateSessionDialog onSessionCreated={refetch} />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>

      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-foreground text-base font-medium">
              {activeItem?.title}
            </div>
            {activeItem?.title === "Sessions" && (
              // <button
              //   onClick={refetch}
              //   disabled={loading}
              //   className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-50"
              // >
              //   {loading ? (
              //     <Loader2 className="h-3 w-3 animate-spin" />
              //   ) : (
              //     "Refresh"
              //   )}
              // </button>
              <SidebarTrigger className="-ml-1" />
            )}
          </div>
          {activeItem?.title === "Sessions" && (
            <SidebarInput placeholder="Search sessions..." />
          )}
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {activeItem?.title === "Sessions" && (
                <>
                  {loading && sessions.length === 0 && (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm text-muted-foreground">
                        Loading sessions...
                      </span>
                    </div>
                  )}
                  {error && (
                    <div className="p-4 text-sm text-red-500">
                      Error: {error}
                    </div>
                  )}
                  {sessions.length === 0 && !loading && !error && (
                    <div className="p-4 text-sm text-muted-foreground text-center">
                      No sessions found
                    </div>
                  )}
                  {sessions.map((session) => (
                    <a
                      href={`/tools/speech-to-text/${session.id}`}
                      key={session.id}
                      className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight last:border-b-0"
                    >
                      <div className="flex w-full items-center gap-2">
                        <span className="font-medium truncate">
                          {session.title}
                        </span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {new Date(session.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Created:{" "}
                        {new Date(session.created_at).toLocaleDateString()}
                      </span>
                    </a>
                  ))}
                </>
              )}
              {activeItem?.title === "New Session" && (
                <div className="p-4 text-center">
                  <Plus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to create a new session
                  </p>
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}
