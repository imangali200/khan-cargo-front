import axios from "axios";

export default defineNuxtPlugin(() => {
  const tokenCookie = useCookie("token", { maxAge: 15 * 60 });
  const refreshTokenCookie = useCookie("refreshToken", { maxAge: 21 * 24 * 60 * 60 });

  const config = useRuntimeConfig();

  const instance = axios.create({
    baseURL: config.public.apiBase,
  });

  // Request interceptor - барлық сұраныстарға token қосу
  instance.interceptors.request.use(
    (config) => {
      const token = tokenCookie.value;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - 401 қатесінде token жаңарту
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // 401 қатесі және әлі retry жасалмаған болса
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = refreshTokenCookie.value;

        // Refresh token жоқ болса - login-ге redirect
        if (!refreshToken) {
          tokenCookie.value = null;
          refreshTokenCookie.value = null;
          navigateTo("/auth/login");
          return Promise.reject(error);
        }

        try {
          // Refresh endpoint-ке сұраныс жіберу
          const response = await axios.post(
            `${config.public.apiBase}auth/refresh`,
            { refreshToken }
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          // Жаңа токендерді сақтау
          tokenCookie.value = accessToken;
          if (newRefreshToken) {
            refreshTokenCookie.value = newRefreshToken;
          }

          // Бастапқы сұранысты жаңа токенмен қайта жіберу
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          // Refresh сәтсіз болса - login-ге redirect
          tokenCookie.value = null;
          refreshTokenCookie.value = null;
          navigateTo("/auth/login");
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return {
    provide: {
      axios: instance,
    },
  };
});
