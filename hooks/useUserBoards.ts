import { IBoardMember } from '@/types/type';
import { api } from '@/utils/api';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

interface PaginatedBoardsResponse {
  success: boolean;
  data: {
    boards: IBoardMember[];
    pagination: {
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    };
  };
}

async function fetchMemberBoards(page: number, pageSize: number) {
  const { data } = await api.get<PaginatedBoardsResponse>('/boards/member', {
    params: { page, pageSize },
  });
  return data;
}

async function fetchOwnerBoards(page: number, pageSize: number) {
  const { data } = await api.get<PaginatedBoardsResponse>('/boards/owner', {
    params: { page, pageSize },
  });
  return data;
}

export function useUserBoards(initialPageSize = 10) {
  const [ownerPage, setOwnerPage] = useState(1);
  const [memberPage, setMemberPage] = useState(1);
  const pageSize = initialPageSize;
  const emptyPagination = {
    total: 0,
    page: 1,
    pageSize,
    totalPages: 1,
  };
  const ownerQuery = useQuery({
    queryKey: ['ownerBoards', ownerPage, pageSize],
    queryFn: () => fetchOwnerBoards(ownerPage, pageSize),
    staleTime: 1000 * 30,
    placeholderData: (previousData) => previousData,
  });

  const memberQuery = useQuery({
    queryKey: ['memberBoards', memberPage, pageSize],
    queryFn: () => fetchMemberBoards(memberPage, pageSize),
    staleTime: 1000 * 30,
    placeholderData: (previousData) => previousData,
  });

  const goToOwnerPage = (page: number) => {
    const totalPages = ownerQuery.data?.data.pagination.totalPages ?? 1;

    if (page < 1 || page > totalPages) return;

    setOwnerPage(page);
  };

  const goToMemberPage = (page: number) => {
    const totalPages = memberQuery.data?.data.pagination.totalPages ?? 1;

    if (page < 1 || page > totalPages) return;

    setMemberPage(page);
  };

  return {
    ownerBoards: ownerQuery.data?.data.boards ?? [],
    ownerPagination: ownerQuery.data?.data.pagination ?? emptyPagination,
    ownerLoading: ownerQuery.isLoading,
    ownerFetching: ownerQuery.isFetching,
    ownerError: ownerQuery.error,

    memberBoards: memberQuery.data?.data.boards ?? [],
    memberPagination: memberQuery.data?.data.pagination ?? emptyPagination,
    memberLoading: memberQuery.isLoading,
    memberFetching: memberQuery.isFetching,
    memberError: memberQuery.error,

    isFetching: ownerQuery.isFetching || memberQuery.isFetching,

    ownerRefetch: ownerQuery.refetch,
    memberRefetch: memberQuery.refetch,
    loading: ownerQuery.isLoading || memberQuery.isLoading,
    goToOwnerPage,
    nextOwnerPage: () => goToOwnerPage(ownerPage + 1),
    prevOwnerPage: () => goToOwnerPage(ownerPage - 1),

    goToMemberPage,
    nextMemberPage: () => goToMemberPage(memberPage + 1),
    prevMemberPage: () => goToMemberPage(memberPage - 1),
  };
}
