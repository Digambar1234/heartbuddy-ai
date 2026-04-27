import { Component, type ErrorInfo, type ReactNode } from "react";
import { HeartPulse, RotateCcw } from "lucide-react";
import { Button } from "../ui/Button";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("HeartBuddy UI crashed:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="premium-bg grid min-h-screen place-items-center px-4 py-10">
        <section className="luxe-panel w-full max-w-lg rounded-2xl p-6 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-500 text-white shadow-glow">
            <HeartPulse className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-3xl font-black text-slate-950">HeartBuddy needs a quick refresh</h1>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Something in the interface failed, but your page is protected from going blank.
          </p>
          <Button className="mt-6" icon={<RotateCcw className="h-4 w-4" />} onClick={() => window.location.reload()}>
            Reload page
          </Button>
        </section>
      </main>
    );
  }
}
