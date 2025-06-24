import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const logout = async () => {
  await fetch("http://localhost:5100/api/logout", {
    method: "POST",
    credentials: "include",
  });
};

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["me"], null);
    },
  });
}
