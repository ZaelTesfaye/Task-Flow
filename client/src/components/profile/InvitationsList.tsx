import { Check, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { INVITATION_STATUS_COLORS } from "@/constants";
import type { ProjectInvitation } from "@/types";

interface InvitationsListProps {
  invitations: ProjectInvitation[];
  invitationLoading: boolean;
  onRespond: (invitationId: string, action: "accept" | "decline") => void;
}

export default function InvitationsList({
  invitations,
  invitationLoading,
  onRespond,
}: InvitationsListProps) {
  return (
    <div className="space-y-4">
      {/* Invitations List */}
      {invitations.map((invitation) => (
        <Card
          key={invitation.id}
          className="border border-[hsl(var(--border))]"
        >
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-lg text-[hsl(var(--foreground))]">
                {invitation.project?.title || "Project Invitation"}
              </CardTitle>
              <p className="text-sm text-[hsl(var(--muted-foreground))] whitespace-pre-line">
                {invitation.project?.description ||
                  "No project description provided."}
              </p>
            </div>
            <span
              className={`${
                INVITATION_STATUS_COLORS[invitation.status]
              } capitalize px-3 py-1 rounded-full text-xs font-semibold`}
            >
              {invitation.status}
            </span>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 text-sm text-[hsl(var(--muted-foreground))]">
              <p>Invited by {invitation.inviter?.name || "Unknown"}</p>

              <p>Role: {invitation.access}</p>
              <p>Invited {new Date(invitation.createdAt).toLocaleString()}</p>
            </div>

            <div className="flex gap-3">
              <Button
                className="flex-1 hover:cursor-pointer hover:bg-transparent hover:text-green-400"
                onClick={() => onRespond(invitation.id, "accept")}
                disabled={invitationLoading}
              >
                <Check className="w-4 h-4 mr-2" />
                Accept
              </Button>
              <Button
                variant="outline"
                className="flex-1 hover:cursor-pointer hover:text-red-500 hover:bg-transparent"
                onClick={() => onRespond(invitation.id, "decline")}
                disabled={invitationLoading}
              >
                <XCircle className="w-4 h-4 mr-2" />
                <span>Decline</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
