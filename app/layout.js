import "./globals.css";

export const metadata = {
  title: "PulseShield.io | PulseChain DeFi Risk Scanner",
  description: "PulseShield is a PulseChain-native DeFi audit intelligence platform with live contract risk scanning.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
