"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { useUser } from "@/store/auth.store";
import {
  createLink as createLinkFirebase,
  updateLink as updateLinkFirebase,
  deleteLink as deleteLinkFirebase,
  getLinks,
} from "@/lib/firebase/links";
import type { CreateLinkInput, Link } from "@/types";

function linksQueryKey(uid: string | undefined): QueryKey {
  return ["links", uid];
}

export function useLinks() {
  const user = useUser();
  const uid = user?.uid;

  return useQuery({
    queryKey: linksQueryKey(uid),
    queryFn: () => getLinks(uid!),
    enabled: !!uid,
  });
}

export function useCreateLink() {
  const queryClient = useQueryClient();
  const user = useUser();
  const uid = user?.uid;

  return useMutation({
    mutationFn: (input: CreateLinkInput) => createLinkFirebase(uid!, input),
    // Prepend the new link immediately, before the server round-trip
    // finishes, so it shows up at the top of the table right away.
    onSuccess: (newLink) => {
      queryClient.setQueryData<Link[]>(linksQueryKey(uid), (old) =>
        old ? [newLink, ...old] : [newLink],
      );
    },
    onError: () => {
      // Fall back to a full refetch if something went wrong so the
      // table doesn't drift out of sync with Firestore.
      queryClient.invalidateQueries({ queryKey: linksQueryKey(uid) });
    },
  });
}

export function useUpdateLink() {
  const queryClient = useQueryClient();
  const user = useUser();
  const uid = user?.uid;

  return useMutation({
    mutationFn: ({
      linkId,
      input,
    }: {
      linkId: string;
      input: Partial<CreateLinkInput>;
    }) => updateLinkFirebase(uid!, linkId, input),
    onSuccess: (_, { linkId, input }) => {
      queryClient.setQueryData<Link[]>(linksQueryKey(uid), (old) =>
        old?.map((link) => (link.id === linkId ? { ...link, ...input } : link)),
      );
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: linksQueryKey(uid) });
    },
  });
}

export function useDeleteLink() {
  const queryClient = useQueryClient();
  const user = useUser();
  const uid = user?.uid;

  return useMutation({
    mutationFn: (linkId: string) => deleteLinkFirebase(uid!, linkId),
    onSuccess: (_, linkId) => {
      queryClient.setQueryData<Link[]>(linksQueryKey(uid), (old) =>
        old?.filter((link) => link.id !== linkId),
      );
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: linksQueryKey(uid) });
    },
  });
}
