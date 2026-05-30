import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import A11yWidget from "@/components/A11yWidget";
import CustomCursorAndMenu from "@/components/CustomCursorAndMenu";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Zviel Koren | Full Stack Developer",
  description: "Personal portfolio website of Zviel Koren - Full Stack Developer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark text-foreground bg-background">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem("zviel-website-a11y-prefs");
                  if (saved) {
                    var state = JSON.parse(saved);
                    var root = document.documentElement;
                    
                    if (state.contrast === "high") root.classList.add("a11y-contrast-high");
                    else if (state.contrast === "monochrome") root.classList.add("a11y-contrast-monochrome");
                    
                    if (state.textSize === "large") root.classList.add("a11y-text-large");
                    else if (state.textSize === "extra-large") root.classList.add("a11y-text-extra-large");
                    
                    if (state.lineSpacing === "wide") root.classList.add("a11y-spacing-wide");
                    else if (state.lineSpacing === "extra-wide") root.classList.add("a11y-spacing-extra-wide");
                    
                    if (state.cursor === "large") root.classList.add("a11y-cursor-large");
                    if (state.motion === "reduced") root.classList.add("a11y-motion-reduced");
                  }
                } catch (e) {
                  console.error("A11y bootstrap error:", e);
                }
              })();
            `
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <CustomCursorAndMenu />
          <Navbar />
          {children}
          <A11yWidget />
        </Providers>
      </body>
    </html>
  );
}
