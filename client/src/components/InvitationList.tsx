import { Check, XCircle } from "lucide-react";
import {
  Button,
  Spinner,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components";
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
                invitation.status === "pending"
                  ? "badge-invitation-pending"
                  : invitation.status === "accepted"
                    ? "badge-invitation-accepted"
                    : invitation.status === "declined"
                      ? "badge-invitation-declined"
                      : "badge-invitation-expired"
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
                className="flex items-center justify-center flex-1 gap-2 hover:cursor-pointer hover:bg-transparent hover:text-green-400"
                onClick={() => onRespond(invitation.id, "accept")}
                disabled={invitationLoading}
              >
                {invitationLoading ? (
                  <Spinner />
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                Accept
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center flex-1 gap-2 hover:cursor-pointer hover:text-red-500 hover:bg-transparent"
                onClick={() => onRespond(invitation.id, "decline")}
                disabled={invitationLoading}
              >
                {invitationLoading ? (
                  <Spinner />
                ) : (
                  <XCircle className="w-4 h-4 mr-2" />
                )}
                <span>Decline</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
