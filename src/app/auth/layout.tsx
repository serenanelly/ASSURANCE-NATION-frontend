import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentification",
};

export default function AuthRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
