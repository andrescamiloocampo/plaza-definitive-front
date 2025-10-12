import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Correo", type: "email", placeholder: "correo@ejemplo.com" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials: Record<"email" | "password", string> | undefined, req: any) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_USERS_HOST}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          const data = await res.json();

          if (res.ok && data?.token && credentials?.email) {
            return {
              id: credentials.email, 
              email: credentials.email,
              accessToken: data.token, 
            };
          }
          return null;
        } catch (error) {
          console.error("Error en authorize", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {        
        token.accessToken = (user as { accessToken?: string }).accessToken;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          email: token.email,
        };
        session.accessToken = typeof token.accessToken === "string" ? token.accessToken : undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
