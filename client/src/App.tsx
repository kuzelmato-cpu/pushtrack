// PushTrack — App Shell
// Design: Minimal Dark Precision / Sports Analytics
// Dark background #0F1117, mint accent #4FFFB0, Syne + DM Sans

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PushTrackProvider } from "./contexts/PushTrackContext";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import Log from "./pages/Log";
import Goals from "./pages/Goals";
import History from "./pages/History";
import Stats from "./pages/Stats";
import FitnessTest from "./pages/FitnessTest";
import Templates from "./pages/Templates";
import MonthlyReport from "./pages/MonthlyReport";
import ProgressiveOverload from "./pages/ProgressiveOverload";

function Router() {
  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/log" component={Log} />
        <Route path="/goals" component={Goals} />
        <Route path="/history" component={History} />
        <Route path="/stats" component={Stats} />
        <Route path="/fitness-test" component={FitnessTest} />
        <Route path="/templates" component={Templates} />
        <Route path="/monthly-report" component={MonthlyReport} />
        <Route path="/progressive-overload" component={ProgressiveOverload} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
      <BottomNav />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <PushTrackProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </PushTrackProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
