import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { Toaster } from "react-hot-toast"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full px-6">
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>
        <Toaster position="top-right" reverseOrder={false} /> 
      </body>
    </html>
  );
}
