'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/api';

async function joinMemberRequest(code: string) {
  const { data } = await api.post(`/invite/${code}/join`);
  return data;
}
async function createInviteRequest(boardId: string, body: any) {
  const { data } = await api.post(`/invite/${boardId}/create-invite-code`, {
    body,
  });
  return data;
}
async function removeMemberRequest(boardId: string, targetUserId: string) {
  const { data } = await api.delete(
    `/member/${boardId}/members/${targetUserId}`,
  );
  return data;
}
async function fetchMembers(boardId: string) {
  const { data } = await api.get(`/member/${boardId}/members`);
  return data;
}

export function useMemberActions(boardId?: string) {
  const queryClient = useQueryClient();

  const membersQuery = useQuery({
    queryKey: ['members', boardId],
    queryFn: () => fetchMembers(boardId!),
    enabled: !!boardId,
    staleTime: 1000 * 30,
  });

  const joinMutation = useMutation({
    mutationFn: (code: string) => joinMemberRequest(code),
  });

  const createInviteMutation = useMutation({
    mutationFn: ({ boardId, body }: { boardId: string; body: any }) =>
      createInviteRequest(boardId, body),
  });

  const removeMutation = useMutation({
    mutationFn: ({
      boardId,
      targetUserId,
    }: {
      boardId: string;
      targetUserId: string;
    }) => removeMemberRequest(boardId, targetUserId),
    onSuccess: (_, { boardId }) => {
      queryClient.invalidateQueries({ queryKey: ['members', boardId] });
    },
  });

  return {
    members: membersQuery.data?.data ?? [],
    membersLoading: membersQuery.isLoading,
    memberError: membersQuery.error,
    refetchMembers: membersQuery.refetch,

    joinMember: joinMutation.mutateAsync,
    joining: joinMutation.isPending,
    joinError: joinMutation.error,

    createInvite: createInviteMutation.mutateAsync,
    creatingInvite: createInviteMutation.isPending,
    createInviteError: createInviteMutation.error,

    removeMember: (targetUserId: string) =>
      removeMutation.mutateAsync({ boardId: boardId!, targetUserId }),
    removing: removeMutation.isPending,
    removeError: removeMutation.error,
  };
}
