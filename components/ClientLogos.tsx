import Reveal from "@/components/Reveal";

const clients = [
  {
    name: "Tour De Sahyadri",
    logo: "/clients/tourdesahyadri.png",
    url: "https://tourdesahyadri.in/",
  },
  {
    name: "Phoenix Infotainment",
    logo: "/clients/phoenixinfotainment.png",
    url: "https://www.phoenixinfotainment.com/",
  },
];

export default function ClientLogos() {
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
      {clients.map((c) => (
        <Reveal key={c.name}>
          <a
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className="logo-card hover:scale-[1.03] transition text-center"
            aria-label={c.name}
            title={c.name}
          >
            <img
              src={c.logo}
              alt={c.name}
              className="h-10 w-auto opacity-90 mx-auto object-contain"
            />

            <p className="mt-3 text-sm font-semibold text-black/70 dark:text-white/70">
              {c.name}
            </p>
          </a>
        </Reveal>
      ))}
    </div>
  );
}
