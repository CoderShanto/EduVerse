export const apiUrl = import.meta.env.VITE_API_URL;

// ✅ Always reads fresh from localStorage at call time — never stale
export const getToken = () => {
  const directToken = localStorage.getItem("token");
  if (directToken && directToken !== "undefined" && directToken !== "null") {
    return directToken;
  }

  const userInfo = localStorage.getItem("userInfoLms");
  try {
    return userInfo ? JSON.parse(userInfo).token : null;
  } catch {
    return null;
  }
};

// ❌ REMOVED: export const token = getToken();
// This was the root bug — it ran once at import time (before login),
// so it was always null. Any file using `token` instead of `getToken()`
// would send "Authorization: Bearer null" on every request.

export function convertMinutesToHours(minutes) {
  let hours = Math.floor(minutes / 60);
  let remainingMinutes = minutes % 60;

  if (hours > 0) {
    let hString = hours === 1 ? "hr" : "hrs";
    let mString = remainingMinutes === 1 ? "min" : "mins";

    if (remainingMinutes > 0) {
      return `${hours} ${hString} ${remainingMinutes} ${mString}`;
    } else {
      return `${hours} ${hString}`;
    }
  } else {
    if (remainingMinutes > 0) {
      let mString = remainingMinutes === 1 ? "min" : "mins";
      return `${remainingMinutes} ${mString}`;
    }
  }

  return "0 min";
}
