export function Footer({ brandName }: { brandName: string }) {
  return (
    <footer className="bg-primary text-white py-8">
      <div className="container-narrow flex flex-col md:flex-row justify-between items-center gap-2 text-sm">
        <span>© {new Date().getFullYear()} {brandName}. Tutti i diritti riservati.</span>
        <span className="opacity-70 text-xs">
          Made by <a href="https://poweragency.it" className="underline hover:text-accent">Power Agency</a>
        </span>
      </div>
    </footer>
  );
}
