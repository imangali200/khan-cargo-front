export default defineNuxtRouteMiddleware(async (to) => {
  const token = useCookie("token").value;
  
  // Skip if no token (auth middleware will handle this)
  if (!token) return;
  
  // Only check for user routes (not index which handles its own check)
  if (!to.path.startsWith('/user/') || to.path === '/user' || to.path === '/user/') return;
  
  const { $axios } = useNuxtApp();
  
  try {
    const response = await $axios.get('profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    // If user is not active, redirect to user index which shows the message
    if (!response.data.isActive) {
      return navigateTo('/user');
    }
  } catch (error) {
    // If error checking profile, redirect to user index
    return navigateTo('/user');
  }
});






