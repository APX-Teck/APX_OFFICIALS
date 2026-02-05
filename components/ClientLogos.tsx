import Reveal from "@/components/Reveal";

const logos = [
  "/clients/client-1.svg",
  "/clients/client-2.svg",
  "/clients/client-3.svg",
  "/clients/client-4.svg",
  "/clients/client-5.svg",
];

export default function ClientLogos() {
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
      {logos.map((src) => (
        <Reveal key={src}>
          <div className="logo-card">
            <img src={src} alt="Client logo" className="h-10 w-auto opacity-80" />
          </div>
        </Reveal>
      ))}
    </div>
  );
}
