"use client";

import { useState } from "react";
import { RefreshCw, Clock } from "lucide-react";
import toast from "react-hot-toast";

import { useInvitations, useInvitationActions } from "@/hooks";
import { Button, Card, CardContent, CardHeader, CardTitle, InvitationsList } from "@/components";

export default function InvitationsPage() {
  const { invitations, loading, loadInvitations } = useInvitations();
  const { respondToInvitation } = useInvitationActions();
  const [invitationLoading, setInvitationLoading] = useState(false);

  const handleRespond = async (invitationId: string, action: "accept" | "decline") => {
    try {
      setInvitationLoading(true);
      await respondToInvitation(invitationId, action);
      toast.success(action === "accept" ? "Invitation accepted!" : "Invitation declined.");
      loadInvitations();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Invitation response failed");
    } finally {
      setInvitationLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[hsl(var(--foreground))]">Project Invitations</h1>
          <p className="text-[hsl(var(--muted-foreground))]">Join and collaborate in projects</p>
        </div>

        <Button
          variant="outline"
          onClick={() => loadInvitations()}
          disabled={loading}
          className="hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <RefreshCw className="mr-2 h-4 w-4 hover:cursor-pointer" />
          Refresh
        </Button>
      </div>

      {/* Loader View */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 text-[hsl(var(--muted-foreground))]">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <span>Loading invitations...</span>
          </div>
        </div>
      ) : invitations.length === 0 ? (
        // No invitations view
        <Card className="border-dashed shadow-none">
          <CardHeader className="text-center">
            <Clock className="mx-auto mb-3 h-10 w-10 text-[hsl(var(--muted-foreground))]" />
            <CardTitle className="text-xl">No pending invitations</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-[hsl(var(--muted-foreground))]">
            Invites you receive will appear here.
          </CardContent>
        </Card>
      ) : (
        // Invitations
        <InvitationsList invitations={invitations} invitationLoading={invitationLoading} onRespond={handleRespond} />
      )}
    </div>
  );
}
