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
    // Token жоқ, бірақ refreshToken бар болса — page load жасатамыз,
    // Axios interceptor бірінші API call-да refresh жасайды
    const refreshToken = useCookie("refreshToken").value;
    if (refreshToken) {
      return;
    }
    return navigateTo("/auth/login");
  }

  try {
    const payload = jwtDecode<JwtPayload>(token);

    // Token expire болған-болмағанын тексеру
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      const refreshToken = useCookie("refreshToken").value;
      if (refreshToken) {
        // Token expire болды, бірақ refreshToken бар — page load жасатамыз,
        // Axios interceptor 401-де refresh жасайды
        return;
      }
      // refreshToken жоқ — login-ге redirect
      useCookie("token").value = null;
      return navigateTo("/auth/login");
    }

    if (payload.role === "admin" && !to.path.startsWith('/admin')) {
      return navigateTo("/admin");
    } else if (payload.role === "superAdmin" && !to.path.startsWith('/superAdmin')) {
      return navigateTo("/superAdmin");
    } else if (payload.role === "user" && !to.path.startsWith('/user')) {
      return navigateTo("/user");
    }
  } catch (e) {
    // Token invalid болса — refreshToken бар-жоғын тексеру
    const refreshToken = useCookie("refreshToken").value;
    if (refreshToken) {
      return;
    }
    useCookie("token").value = null;
    return navigateTo("/auth/login");
  }
});

