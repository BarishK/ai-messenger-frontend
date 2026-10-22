import "./globals.css";

export const metadata = {
  title: "AI Messenger",
  description: "Persona tabanlı AI sohbet uygulaması",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="antialiased bg-gray-900 text-white">{children}</body>
    </html>
  );
}
