export default function getCookie(cookieName) {
  const cookieValue = document.cookie.match(
    "(^|[^;]+)\\s*" + cookieName + "\\s*=\\s*([^;]+)"
  );
  return cookieValue ? JSON.parse(cookieValue.pop()) : null;
}
