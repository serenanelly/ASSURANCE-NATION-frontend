import { cookies } from "next/headers";
import { type NavigationConfig, type NotionConfig } from "next-intl/dist/server";
import { routing } from "./routing";

export const i18n = {
  defaultLocale: "en",
  locales: ["en", "fr"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};

export const localeNamesNative: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};

export const messages = {
  en: () => import("./locale/en.json"),
  fr: () => import("./locale/fr.json"),
};

export const routing = {
  i18n,
  defaultLocale: "en",
  localePrefix: "always",
} as const;

export const notFound = {
  redirect: () => {
    const cookieStore = cookies();
    const preferredLocale = cookieStore.get("NEXT_LOCALE")?.value || "en";
    return {
      redirect: {
        destination: `/${preferredLocale}/not-found`,
        permanent: false,
      },
    };
  },
};
