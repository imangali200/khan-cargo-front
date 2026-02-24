import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  role: string;
  sub: number;
  iat: number;
  exp: number;
}

function getRedirectByRole(role: string): string {
  switch (role) {
    case 'admin': return '/admin';
    case 'superAdmin': return '/superAdmin';
    default: return '/user';
  }
}

export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie("token").value;

  // Auth pages — allow without token, redirect away if already logged in
  if (to.path.startsWith("/auth/")) {
    if (token) {
      try {
        const payload = jwtDecode<JwtPayload>(token);
        return navigateTo(getRedirectByRole(payload.role));
      } catch {
        useCookie("token").value = null;
        return;
      }
    }
    return;
  }

  // All other pages require a token
  if (!token) {
    return navigateTo("/auth/login");
  }

  try {
    const payload = jwtDecode<JwtPayload>(token);

    if (payload.role === "admin" && !to.path.startsWith('/admin')) {
      return navigateTo("/admin");
    } else if (payload.role === "superAdmin" && !to.path.startsWith('/superAdmin')) {
      return navigateTo("/superAdmin");
    } else if (payload.role === "user" && !to.path.startsWith('/user')) {
      return navigateTo("/user");
    }
  } catch (e) {
    // If token is invalid, clear it and redirect to login
    useCookie("token").value = null;
    return navigateTo("/auth/login");
  }
});

