import { APIError, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { E164_RE } from "./phone";
import { after } from "next/server";
import { emailLink } from "./emailTemplates";
import { sendEmail } from "./email";
import { checkRateLimits } from "./rateLimit";
import { deleteAccountData } from "@/features/account/delete-data";

type Mail = { to: string; subject: string; html: string; text: string };

async function sendLimitedEmail(kind: "verify" | "reset", mail: Mail) {
  try {
    const perRecipient = await checkRateLimits([
      {
        name: `mail-${kind}`,
        id: mail.to.toLowerCase(),
        max: 3,
        windowSec: 3600,
      },
    ]);
    if (!perRecipient.ok) {
      console.warn(`[mail-limit] ${kind} email suppressed (recipient cap)`);
      return;
    }

    const global = await checkRateLimits([
      { name: "mail-global", id: "all", max: 100, windowSec: 3600 },
    ]);
    if (!global.ok) {
      console.warn(`[mail-limit] ${kind} email suppressed (global cap)`);
      return;
    }

    await sendEmail(mail);
  } catch (e) {
    console.error("[mail] send failed:", e);
  }
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  rateLimit: {
    enabled: true,
    storage: "database",
    window: 60,
    max: 60,
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 60, max: 5 },
      "/request-password-reset": { window: 300, max: 3 },
      "/send-verification-email": { window: 300, max: 3 },
      "/change-password": { window: 300, max: 5 },
      "/delete-user": { window: 300, max: 3 },
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      const { html, text } = await emailLink({
        heading: "إعادة تعيين كلمة المرور",
        intro:
          "طلبت إعادة تعيين كلمة مرور، اضغط علي الرابط لتحديد الكلمة الجديدة.",
        button: "تعيين كلمة المرور الجديدة",
        url,
      });

      after(() =>
        sendLimitedEmail("reset", {
          to: user.email,
          subject: "إعادة تعيين كلمة المرور",
          html,
          text,
        }),
      );
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const { html, text } = await emailLink({
        heading: "فعل حسابك في وكيل",
        intro: "اضغط علي الزر لتأكيد بريدك الإلكتروني",
        button: "تفعيل الحساب",
        url,
      });

      after(() =>
        sendLimitedEmail("verify", {
          to: user.email,
          subject: "فعّل بريدك الإلكتروني",
          html,
          text,
        }),
      );
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  user: {
    additionalFields: {
      phone: { type: "string", required: false, input: true },
    },
    deleteUser: {
      enabled: true,
      // Runs before Better Auth removes the user; if it throws, nothing is deleted
      beforeDelete: async (user) => {
        await deleteAccountData(user.id);
      },
    },
  },

  session: {
    // Sensitive actions (like deleting the account) need a session created in the last 10 minutes
    freshAge: 60 * 10,
  },

  databaseHooks: {
    user: {
      create: {
        before: async (d) => {
          const phone = d.phone as string | undefined;
          if (phone !== undefined && !E164_RE.test(phone)) {
            throw new APIError("BAD_REQUEST", {
              message: "رقم الهاتف غير صحيح",
            });
          }

          return { data: d };
        },

        after: async (d) => {
          try {
            await db
              .insert(schema.userSettings)
              .values({ userId: d.id })
              .onConflictDoNothing();
          } catch (e) {
            console.log("failed to create user_settings:", e);
          }
        },
      },

      update: {
        before: async (d) => {
          const phone = d.phone as string | undefined;
          if (phone !== undefined && !E164_RE.test(phone)) {
            throw new APIError("BAD_REQUEST", {
              message: "رقم الهاتف غير صحيح",
            });
          }

          return { data: d };
        },
      },
    },
  },

  plugins: [nextCookies()],
});
