import { NextResponse } from "next/server";
import { auth } from "./auth";
import { authRoutes, publicRoutes } from "./routes";

export default auth((req) => {
  const {nextUrl} = req;
  const isLoggedIn = !!req.auth;

  console.log("======================================================")
  console.log(nextUrl.pathname)
  console.log("===================")
  console.log(isLoggedIn);

  const isPublic = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  console.log("===================")
  console.log(isPublic);
  console.log(isAuthRoute);
  console.log("===================")

  if (isPublic) {
    return NextResponse.next();
  }

  if (isAuthRoute){
    if (isLoggedIn ) {
      return NextResponse.redirect(new URL('/members', nextUrl));
    } 
    return NextResponse.next();
    
  }



  if (!isPublic && !isLoggedIn){
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  return NextResponse.next();
  
})


 /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}