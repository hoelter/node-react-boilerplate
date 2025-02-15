export const routes = {
  root: "/",
  signIn: "/sign-in",
  toSignIn: (returnUrl: string) => `/sign-in${returnUrl === "/" ? "" : `?returnUrl=${encodeURIComponent(returnUrl)}`}`,
  helloWorld: "/hello-world",
};
