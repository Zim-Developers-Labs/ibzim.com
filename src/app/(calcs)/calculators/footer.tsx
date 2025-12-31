export default function CalculatorFooter() {
  return (
    <footer className="border-border bg-card mt-auto border-t">
      <div className="container mx-auto px-4 py-6">
        <p className="text-muted-foreground text-center text-sm">
          © {new Date().getFullYear()} IBZIM. Disclaimer: Rates and charges may
          vary. Always confirm with official sources.
        </p>
      </div>
    </footer>
  );
}
