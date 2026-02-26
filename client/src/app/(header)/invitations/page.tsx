"use client";

import { RefreshCw, Clock } from "lucide-react";

import { useInvitations } from "@/hooks";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { InvitationsList } from "@/components/profile";

export default function InvitationsPage() {
  const {
    invitations,
    loading,
    invitationLoading,
    loadInvitations,
    handleRespond,
  } = useInvitations();

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
