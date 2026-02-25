import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MainContent from "@/components/layout/MainContent";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <MainContent>{children}</MainContent>
      <Footer />
    </>
  );
}
