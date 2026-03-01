import axios from "axios";

export default defineNuxtPlugin(() => {
  const tokenCookie = useCookie("token", { maxAge: 30 * 24 * 60 * 60, path: '/' });
  const refreshTokenCookie = useCookie("refreshToken", { maxAge: 21 * 24 * 60 * 60, path: '/' });

  const config = useRuntimeConfig();

  const instance = axios.create({
    baseURL: config.public.apiBase,
  });

  // Request interceptor - барлық сұраныстарға token қосу
  instance.interceptors.request.use(
    (reqConfig) => {
      const token = tokenCookie.value;
      if (token && reqConfig.headers) {
        reqConfig.headers.Authorization = `Bearer ${token}`;
      }
      return reqConfig;
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

        // Refresh token жоқ болса - auth/login-ге жіберу (клиент жағында ғана)
        if (!refreshToken) {
          tokenCookie.value = null;
          refreshTokenCookie.value = null;
          if (process.client) {
            window.location.href = '/auth/login';
          }
          return Promise.reject(error);
        }

        try {
          // Refresh endpoint-ке сұраныс жіберу
          // Custom axios instance қолданбау керек, өйткені ол бесконечный циклге түсіруі мүмкін
          const response = await axios.post(
            `${config.public.apiBase}/auth/refresh`,
            { refreshToken }
          );

          const newAccessToken = response.data.accessToken || response.data.access_token;
          const newRefreshToken = response.data.refreshToken || response.data.refresh_token;

          if (newAccessToken) {
            // Жаңа токендерді сақтау
            tokenCookie.value = newAccessToken;
            if (newRefreshToken) {
              refreshTokenCookie.value = newRefreshToken;
            }

            // Бастапқы сұранысты жаңа токенмен қайта жіберу
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            return instance(originalRequest);
          } else {
            throw new Error('No access token returned');
          }
        } catch (refreshError) {
          // Refresh сәтсіз болса - тазалап login-ге жіберу
          tokenCookie.value = null;
          refreshTokenCookie.value = null;
          if (process.client) {
            window.location.href = '/auth/login';
          }
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
