import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/events/:id", "/api/webhook/clerk", "/api/uploadthing"],
  ignoredRoutes: ["/api/webhook/clerk", "/api/uploadthing"],
  afterAuth: (auth, req, _) => {
    console.log("auth", auth);
    console.log("req", req);
    console.log("other", _);
  },
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
