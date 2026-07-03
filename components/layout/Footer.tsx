import Link from "next/link";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Explore", href: "/explore" },
      { label: "Create", href: "/create" },
      { label: "Impact", href: "/impact" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", href: "#" },
      { label: "Blog", href: "#" },
      { label: "FAQ", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "X / Twitter", href: "https://x.com" },
      { label: "Discord", href: "https://discord.com" },
      { label: "GitHub", href: "https://github.com" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-primary/10 bg-bg">
      <div className="relative z-[1] max-w-7xl mx-auto px-6 py-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-fg-muted mb-5 font-[family-name:var(--font-heading)]">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("http") ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-fg-subtle hover:text-primary transition-colors duration-200 text-sm"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-fg-subtle hover:text-primary transition-colors duration-200 text-sm"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-[1] max-w-7xl mx-auto px-6 pb-6 text-center text-xs text-fg-subtle">
        &copy; {new Date().getFullYear()} Donation.Box. All rights reserved.
      </div>

      <div
        className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span className="text-[clamp(80px,20vw,180px)] font-bold leading-none text-primary/[100] dark:text-primary/[0.04] whitespace-nowrap">
          donation.box
        </span>
      </div>
    </footer>
  );
}
