import { useUserStore } from "@/context/useUserStore";
import { trpc } from "@/utils/trpc";

/**
 * The signed-in user's "Show Suitable Dishes Only" setting, saved to their
 * account so it carries across reloads and devices. Updates apply
 * optimistically and roll back if saving fails.
 */
export function useShowSuitableDishesOnly() {
  const userId = useUserStore((s) => s.userId);
  const utils = trpc.useUtils();
  const input = { id: userId ?? "" };

  const { data: user } = trpc.user.get.useQuery(input, { enabled: !!userId });

  const { mutate } = trpc.user.setShowSuitableDishesOnly.useMutation({
    onMutate: async ({ value }) => {
      await utils.user.get.cancel(input);
      const previous = utils.user.get.getData(input);
      utils.user.get.setData(input, (old) =>
        old ? { ...old, showSuitableDishesOnly: value } : old,
      );
      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) utils.user.get.setData(input, context.previous);
    },
    onSettled: () => utils.user.get.invalidate(input),
  });

  return {
    showSuitableDishesOnly: user?.showSuitableDishesOnly ?? false,
    setShowSuitableDishesOnly: (value: boolean) => {
      if (userId) mutate({ id: userId, value });
    },
  };
}
