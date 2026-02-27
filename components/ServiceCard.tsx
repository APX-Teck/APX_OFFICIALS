import Reveal from "@/components/Reveal";

interface ServiceData {
  slug: string;
  title: string;
  tag: string;
  image: string;
  overview: string;
  benefits: string[];
  process: string[];
  idealFor: string[];
}

export default function ServiceCard({ service }: { service: ServiceData }) {
  return (
    <Reveal>
      <div className="card overflow-hidden p-0">
        {/* Image Banner */}
        <div className="relative h-44 w-full">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${service.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-black/55" />

          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xl font-semibold text-white">
                {service.title}
              </p>
              <p className="text-white/70 text-sm mt-1">{service.tag}</p>
            </div>

            <div className="pill !text-white/80 !border-white/20 !bg-white/10">
              {service.tag}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-black/70 dark:text-white/70 max-w-3xl">
            {service.overview}
          </p>

          <div className="grid gap-5 mt-6 md:grid-cols-3">
            <div>
              <p className="text-sm font-semibold">Key Benefits</p>
              <ul className="mt-3 space-y-2 text-black/75 dark:text-white/75 list-disc pl-5">
                {service.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold">Process</p>
              <ol className="mt-3 space-y-2 text-black/75 dark:text-white/75 list-decimal pl-5">
                {service.process.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ol>
            </div>

            <div>
              <p className="text-sm font-semibold">Ideal For</p>
              <ul className="mt-3 space-y-2 text-black/75 dark:text-white/75 list-disc pl-5">
                {service.idealFor.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
