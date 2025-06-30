"use server";

export const fetchInServer = async (url, options = {}) => {
  try {
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

      if (refreshRes.ok) {
        res = fetch(url, {
          ...options,
          credentials: options?.headers?.Authorization ? "omit" : "include",
        });
      } else {
        return null;
      }
      return res;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    return null; // Return null instead of throwing to prevent crashes
  }
};
