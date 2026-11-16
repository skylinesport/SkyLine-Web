import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AnimatedRoutes } from "@/components/AnimatedRoutes";
import { SmoothScroll } from "@/components/fx/SmoothScroll";
import { Cursor } from "@/components/fx/Cursor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" forcedTheme="dark">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* Film-grain texture + custom cursor, site-wide */}
        <div className="grain-overlay" aria-hidden="true" />
        <Cursor />
        <BrowserRouter>
          <SmoothScroll>
            <AnimatedRoutes />
          </SmoothScroll>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
