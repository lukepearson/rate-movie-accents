import { Suspense } from "react";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import Loading from "./loading";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={GeistSans.className}>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/theme-change@2.0.2/index.js"></script>
      </head>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
          <header className="flex justify-center items-center w-full h-24 border-b">
            <h1 className="text-lg text-primary sm:text-2xl font-bold mb-2">
              Rate film accents
            </h1>
          </header>

          <div className="breadcrumbs text-sm mt-3">
            <ul>
              <li><a className="underline" href='/'>Navigate Home</a></li>
            </ul>
          </div>

          <Suspense fallback={<Loading />}>
            <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-20 text-center">
              {children}
            </main>
          </Suspense>

          <footer className="flex items-center justify-center w-full h-24 border-t">
            <p className="text-sm text-center text-gray-500">
              Made using{" "}
              <a
                href="https://nextjs.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                NextJS
              </a>
                &nbsp;|&nbsp; 
              <a
                href="https://tailwindcss.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                Tailwind CSS
              </a>
              &nbsp;|&nbsp;
              <a
                href="https://daisyui.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                DaisyUI
              </a>
              &nbsp;|&nbsp;
              <a
                href="https://www.typescriptlang.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                TypeScript
              </a>
              &nbsp;|&nbsp;
              <a
                href="https://upstash.com/docs/introduction"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                Upstash
              </a>
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
