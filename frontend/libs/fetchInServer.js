"use server";

export const fetchInServer = async (url, options = {}) => {
  let res = await fetch(url, {
    ...options,
    credentials: options?.headers?.Authorization ? "omit" : "include",
  });

  // here I am getting user data

  if (res.status === 401) {
    const refreshRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/refresh`,
      {
        method: "POST",
        ...options,
      }
    );

    let resFinal = null;
    if (refreshRes.ok) {
      resFinal = fetch(url, {
        ...options,
        credentials: options?.headers?.Authorization ? "omit" : "include",
      });
    }
    return resFinal;
  }

  return res;
};
