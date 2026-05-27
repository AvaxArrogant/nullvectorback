import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import Providers from "./providers";

export const metadata = {
  title: "PulseShield.io | PulseChain DeFi Risk Scanner",
  description: "PulseShield is a PulseChain-native DeFi audit intelligence platform with live contract risk scanning.",
  icons: {
    icon: "/assets/pulseshield-shield-bright.png",
    shortcut: "/assets/pulseshield-shield-bright.png",
    apple: "/assets/pulseshield-shield-bright.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
