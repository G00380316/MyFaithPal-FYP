//middleware can be used to run code before a page is rendered or to handle authentication-related tasks
export { default } from "next-auth/middleware";

export const config = { matcher: ["/profile","/login"] };
