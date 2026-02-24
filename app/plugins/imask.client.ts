import IMask from 'imask';

export default defineNuxtPlugin(() => {
  return {
    provide: {
      imask: IMask
    }
  }
})
