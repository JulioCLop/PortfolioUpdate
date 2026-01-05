import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Julio Lopez — Front-End Developer",
  description: "Portfolio and case studies for Julio Lopez.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="page-shell">
          <header className="site-header">
            <div className="container nav">
              <div className="brand">
                <span className="brand-mark">JL</span>
                <div>
                  <div className="brand-name">Julio Lopez</div>
                  <div className="brand-sub">Front-End Developer</div>
                </div>
              </div>
              <nav className="nav-links">
                <a href="/">Work</a>
                <a href="/case-studies/checkout-donation-flow">Case Study</a>
                <a href="#contact">Contact</a>
              </nav>
            </div>
          </header>
          <main>{children}</main>
          <footer className="site-footer">
            <div className="container footer-inner">
              <div>© {new Date().getFullYear()} Julio Lopez</div>
              <div className="footer-links">
                <a href="#">LinkedIn</a>
                <a href="#">GitHub</a>
                <a href="mailto:hello@julio.dev">hello@julio.dev</a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
