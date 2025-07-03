// import { useMutation, useQueryClient } from "@tanstack/react-query";

// const register = async ({ email, password, username }) => {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/register`,
//     {
//       method: "POST",
//       credentials: "include",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password, username }),
//     }
//   );

//   const data = await res.json();

//   if (!res.ok) {
//     throw new Error(data.message || "Registration failed");
//   }

//   return data;
// };

// export function useRegister() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: register,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["me"] });
//     },
//   });
// }

export const register = async ({ email, password, username }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/register`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    data.error = true;
  }

  return data;
};
