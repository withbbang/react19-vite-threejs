if (import.meta.env.MODE === 'production') {
  console.debug = () => {};
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
  // except console.error
}
