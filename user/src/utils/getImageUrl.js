// src/utils/getImageUrl.js
export function getImageUrl(pathOrUrl) {
  if (!pathOrUrl) return null;

  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }

  return `${process.env.REACT_APP_BACKEND_URL.replace(
    /\/$/,
    ""
  )}/${pathOrUrl.replace(/^\//, "")}`;
}
