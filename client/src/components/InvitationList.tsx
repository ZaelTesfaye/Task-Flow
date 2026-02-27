import { Check, XCircle } from "lucide-react";
import { Button, Spinner, Card, CardContent, CardHeader, CardTitle } from "@/components";
import type { ProjectInvitation } from "@/types";

interface InvitationsListProps {
  invitations: ProjectInvitation[];
  invitationLoading: boolean;
  onRespond: (invitationId: string, action: "accept" | "decline") => void;
}

export default function InvitationsList({ invitations, invitationLoading, onRespond }: InvitationsListProps) {
  return (
    <div className="space-y-4">
      {/* Invitations List */}
      {invitations.map((invitation) => (
        <Card key={invitation.id} className="border border-[hsl(var(--border))]">
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-lg text-[hsl(var(--foreground))]">
                {invitation.project?.title || "Project Invitation"}
              </CardTitle>
              <p className="whitespace-pre-line text-sm text-[hsl(var(--muted-foreground))]">
                {invitation.project?.description || "No project description provided."}
              </p>
            </div>
            <span
              className={`${
                invitation.status === "pending"
                  ? "badge-invitation-pending"
                  : invitation.status === "accepted"
                    ? "badge-invitation-accepted"
                    : invitation.status === "declined"
                      ? "badge-invitation-declined"
                      : "badge-invitation-expired"
              } rounded-full px-3 py-1 text-xs font-semibold capitalize`}
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
                className="flex flex-1 items-center justify-center gap-2 hover:cursor-pointer hover:bg-transparent hover:text-green-400"
                onClick={() => onRespond(invitation.id, "accept")}
                disabled={invitationLoading}
              >
                {invitationLoading ? <Spinner /> : <Check className="mr-2 h-4 w-4" />}
                Accept
              </Button>
              <Button
                variant="outline"
                className="flex flex-1 items-center justify-center gap-2 hover:cursor-pointer hover:bg-transparent hover:text-red-500"
                onClick={() => onRespond(invitation.id, "decline")}
                disabled={invitationLoading}
              >
                {invitationLoading ? <Spinner /> : <XCircle className="mr-2 h-4 w-4" />}
                <span>Decline</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
