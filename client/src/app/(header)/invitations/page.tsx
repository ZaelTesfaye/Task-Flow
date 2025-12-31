"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RefreshCw, Clock } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { projectAPI } from "@/lib";
import type { ProjectInvitation } from "@/types";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { InvitationsList } from "@/components/profile";

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<ProjectInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [invitationLoading, setInvitationLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const loadInvitations = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getMyInvitations();
      setInvitations(response.data || []);
    } catch (error) {
      console.error("Failed to load invitations", error);
      toast.error("Failed to load invitations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Invalidate the invitations cache when page loads to ensure fresh data
    queryClient.invalidateQueries({ queryKey: ["user-invitations"] });
    // Refetch the user invitations query to update the notification icon immediately
    queryClient.refetchQueries({ queryKey: ["user-invitations"] });
    loadInvitations();
  }, [queryClient]);

  const handleRespond = async (
    invitationId: string,
    action: "accept" | "decline"
  ) => {
    try {
      setInvitationLoading(true);
      await projectAPI.respondToInvitation(invitationId, { action });
      toast.success(
        action === "accept" ? "Invitation accepted!" : "Invitation declined."
      );
      // Invalidate projects cache when accepting an invitation
      if (action === "accept") {
        await queryClient.invalidateQueries({ queryKey: ["user-projects"] });
      }
      // Invalidate user invitations cache to update notification badge
      await queryClient.invalidateQueries({ queryKey: ["user-invitations"] });
      loadInvitations();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Invitation response failed"
      );
    } finally {
      setInvitationLoading(false);
    }
  };

  return (
    <div className="max-w-4xl px-6 py-10 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[hsl(var(--foreground))]">
            Project Invitations
          </h1>
          <p className="text-[hsl(var(--muted-foreground))]">
            Join and collaborate in projects
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => loadInvitations()}
          disabled={loading}
          className="hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <RefreshCw className="w-4 h-4 mr-2 hover:cursor-pointer" />
          Refresh
        </Button>
      </div>

      {/* Loader View */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 text-[hsl(var(--muted-foreground))]">
            <div className="w-6 h-6 border-2 border-blue-600 rounded-full border-t-transparent animate-spin" />
            <span>Loading invitations...</span>
          </div>
        </div>
      ) : invitations.length === 0 ? (
        // No invitations view
        <Card className="border-dashed shadow-none">
          <CardHeader className="text-center">
            <Clock className="w-10 h-10 mx-auto text-[hsl(var(--muted-foreground))] mb-3" />
            <CardTitle className="text-xl">No pending invitations</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-[hsl(var(--muted-foreground))]">
            Invites you receive will appear here.
          </CardContent>
        </Card>
      ) : (
        // Invitations
        <InvitationsList
          invitations={invitations}
          invitationLoading={invitationLoading}
          onRespond={handleRespond}
        />
      )}
    </div>
  );
}
