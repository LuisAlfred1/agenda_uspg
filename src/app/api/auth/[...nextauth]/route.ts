//Este codigo me permite comunicarme con la API de google para autenticar a los usuarios
//y poder acceder a la informacion de su cuenta de google
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();


export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // otras opciones, callbacks, etc.
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
