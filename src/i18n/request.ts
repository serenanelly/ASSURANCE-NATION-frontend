import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./config";

export default getRequestConfig(async ({ locale }) => {
  if (!routing.i18n.locales.includes(locale as any)) {
    notFound();
  }

  return {
    messages: (await import(`./locale/${locale}.json`)).default,
  };
});
