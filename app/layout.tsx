import React from "react"
import type { Metadata, Viewport } from "next"
import { Cairo } from "next/font/google"
import "./globals.css"

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
})

export const metadata: Metadata = {
  title: "NutriSync Ai - مركز صحي متكامل للتغذية واللياقة البدنية",
  description: "خطط تغذية مخصصة وبرامج تدريب رياضية متكاملة بإشراف نخبة من الأخصائيين والمدربين المعتمدين",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0d7a4f",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} bg-background`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
