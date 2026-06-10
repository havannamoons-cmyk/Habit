import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { Backdrop } from "@/app/_components/Backdrop";
import { ThemeToggle } from "@/app/_components/ThemeToggle";

// Se ejecuta antes de pintar para aplicar el tema guardado (o el del sistema)
// y evitar el parpadeo claro→oscuro al cargar.
const themeScript = `
  try {
    var t = localStorage.getItem('theme');
    if (t === 'dark' || (!t && matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Serif elegante para el nombre y los títulos.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Habituación — tu día, paso a paso",
  description:
    "Seguí tus hábitos día a día, sumá rachas y construí constancia. Un tracker simple y lindo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <Backdrop />
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
