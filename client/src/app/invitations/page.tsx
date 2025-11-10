'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { projectAPI } from '@/lib/api';
import type { ProjectInvitation } from '@/types/api';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, XCircle, RefreshCw, Clock } from 'lucide-react';
import { INVITATION_STATUS_COLORS } from '@/constants/project';

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<ProjectInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadInvitations = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getMyInvitations();
      setInvitations(response.data || []);
    } catch (error) {
      console.error('Failed to load invitations', error);
      toast.error('Failed to load invitations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadInvitations();
  }, []);

  const handleRespond = async (
    invitationId: string,
    action: 'accept' | 'decline',
  ) => {
    try {
      setProcessingId(invitationId + action);
      await projectAPI.respondToInvitation(invitationId, { action });
      toast.success(
        action === 'accept'
          ? 'Invitation accepted!'
          : 'Invitation declined.',
      );
      void loadInvitations();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Failed to respond to invitation',
      );
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[hsl(var(--foreground))]">
              Project Invitations
            </h1>
            <p className="text-[hsl(var(--muted-foreground))]">
              Review and respond to pending project invitations.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => void loadInvitations()}
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-[hsl(var(--muted-foreground))]">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>Loading invitations...</span>
            </div>
          </div>
        ) : invitations.length === 0 ? (
          <Card className="shadow-none border-dashed">
            <CardHeader className="text-center">
              <Clock className="w-10 h-10 mx-auto text-[hsl(var(--muted-foreground))] mb-3" />
              <CardTitle className="text-xl">
                No pending invitations
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center text-[hsl(var(--muted-foreground))]">
              Invites you receive will appear here.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {invitations.map((invitation) => (
              <Card key={invitation.id} className="border border-[hsl(var(--border))]">
                <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg text-[hsl(var(--foreground))]">
                      {invitation.project?.title || 'Project Invitation'}
                    </CardTitle>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      Invited by {invitation.inviter?.name || 'Unknown'}
                    </p>
                  </div>
                  <span
                    className={`${INVITATION_STATUS_COLORS[invitation.status]} capitalize px-3 py-1 rounded-full text-xs font-semibold`}
                  >
                    {invitation.status}
                  </span>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-[hsl(var(--muted-foreground))] whitespace-pre-line">
                    {invitation.project?.description || 'No project description provided.'}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[hsl(var(--muted-foreground))]">
                    <span>Email: {invitation.email}</span>
                    <span>Role: {invitation.access}</span>
                    <span>
                      Invited {new Date(invitation.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      className="flex-1"
                      onClick={() => handleRespond(invitation.id, 'accept')}
                      disabled={processingId === invitation.id + 'accept'}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleRespond(invitation.id, 'decline')}
                      disabled={processingId === invitation.id + 'decline'}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Decline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}