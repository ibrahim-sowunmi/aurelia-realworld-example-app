import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import Header from "./components/common/Header";

export const metadata: Metadata = {
  title: "Conduit",
  description: "A place to share your knowledge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" rel="stylesheet" type="text/css" />
        <link href="//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic" rel="stylesheet" type="text/css" />
        <link rel="stylesheet" href="//demo.productionready.io/main.css" />
      </head>
      <body
        className="antialiased"
      >
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <footer>
            <div className="container">
              <a href="/" className="logo-font">conduit</a>
              <span className="attribution">
                An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed under MIT.
              </span>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
