
// Store the refresh promise to avoid duplicate requests
let refreshPromise = null;

export const fetchInClient = async (url, options = {}) => {
  try {
    let res = await fetch(url, {
      ...options,
      credentials: "include",
    });

    if (res.status === 401) {
      // If a refresh is already in progress, wait for it
      if (refreshPromise) {
        await refreshPromise;
        // Retry the original request after refresh completes
        res = await fetch(url, {
          ...options,
          credentials: "include",
        });
        return res;
      }

      // Start a new refresh request and store the promise
      refreshPromise = fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/refresh`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const refreshRes = await refreshPromise;

      if (refreshRes.ok) {
        // Retry the original request with new token
        res = await fetch(url, {
          ...options,
          credentials: "include",
        });
        // Clear the refresh promise after completion
        refreshPromise = null;
        return res;
      } else {
        // Refresh failed - clear tokens and redirect to login
        refreshPromise = null;
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
        return null;
      }
    }
    return res;
  } catch (error) {
    console.error("Fetch error:", error);
    // Clear the refresh promise in case of error
    refreshPromise = null;
    return null;
  }
};
