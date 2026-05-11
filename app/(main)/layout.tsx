import { Header } from "../components/header";
import Footer from "../components/footer";
import MainWrapper from "../components/main-wrapper";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="wrap">
      <Header />
      <MainWrapper>
        {children}
        <Analytics />
        <SpeedInsights />
      </MainWrapper>
      <Footer />
    </div>
  );
}