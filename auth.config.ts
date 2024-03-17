import type { NextAuthConfig } from "next-auth";
import { LoginSchema } from "./schemas";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmail } from "./data/user";
import bcrypt from "bcryptjs";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);
          if (!user || !user.password) return Promise.resolve(null);

          const passwordsMatch = await bcrypt.compare(
            password,
            user.password,
          );

          if (passwordsMatch) {
            console.log(user.name);
            console.log("Passwords match, returning user");
            return Promise.resolve(user);
          }
        }

        console.log("Invalid credentials, returning null");
        return Promise.resolve(null);
      },
    }),
  ],
} as NextAuthConfig;