export const fetchInClient = async (url, options = {}) => {
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
          credentials: "include",
        }
      );

      if (refreshRes.ok) {
        res = await fetch(url, {
          ...options,
          credentials: "include",
        });
      } else {
        return null;
      }
      return res;
    }

    return res;
  }catch (error) {
    console.error("Fetch error:", error);
    return null; // Return null instead of throwing to prevent crashes
  }
};
