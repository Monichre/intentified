"use client";

// External imports
import { BuildingIcon } from "lucide-react";

// Internal imports
import { Card, CardContent } from "@/components/ui/card";

/**
 * SectionTitle component for consistent headings across sections
 */
const SectionTitle = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
      <h2 className="text-3xl font-bold tracking-tight uppercase sm:text-4xl">
        <span className="relative">{title}</span>
      </h2>
      <p className="text-muted-foreground mt-4 max-w-2xl text-center text-lg">
        {subtitle}
      </p>
    </div>
  );
};

/**
 * ClientCard component for displaying client logos
 */
interface Client {
  id: string;
  name: string;
  logo: string;
}

const ClientCard = ({ client, index }: { client: Client; index: number }) => {
  return (
    <Card
      key={index}
      className="border-border/50 bg-background/60 hover:border-primary/20 group overflow-hidden rounded-xl border p-1 transition-all duration-300 hover:shadow-lg"
    >
      <CardContent className="flex h-full flex-col items-center justify-center p-6">
        <div className="flex w-full flex-col gap-5">
          <div className="flex w-full items-center justify-between">
            <div
              className="bg-primary/10 group-hover:bg-primary/20 flex h-12 w-12 items-center justify-center rounded-full transition-all"
              aria-hidden="true"
            >
              <BuildingIcon className="text-primary h-6 w-6" />
            </div>
            <div className="text-muted-foreground text-right text-sm tracking-wide italic">
              Trusted Partner
            </div>
          </div>

          <div className="flex items-center justify-center py-8">
            <div className="relative flex h-32 w-full items-center justify-center">
              <img
                src={client.logo}
                alt={`${client.name} logo`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>

          <div className="w-full border-t pt-4">
            <div className="text-center text-lg font-semibold tracking-tight">
              {client.name}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Client data
 */
const clients = [
  {
    id: "client-1",
    name: "TARGET",
    logo: "/logos/target-logo.svg",
  },
  {
    id: "client-2",
    name: "SEIDIO",
    logo: "/logos/seidio-logo.svg",
  },
  {
    id: "client-3",
    name: "3RHINO",
    logo: "/logos/3rhino-logo.svg",
  },
  {
    id: "client-4",
    name: "BEST BUY",
    logo: "/logos/bestbuy-logo.svg",
  },
  {
    id: "client-5",
    name: "DAVISCO FOODS INTERNATIONAL",
    logo: "/logos/davisco-logo.svg",
  },
  {
    id: "client-6",
    name: "PBS",
    logo: "/logos/pbs-logo.svg",
  },
  {
    id: "client-7",
    name: "NYU LANGONE MEDICAL CENTER",
    logo: "/logos/nyu-logo.svg",
  },
];

/**
 * Main Clients component
 */
export function Clients() {
  return (
    <section
      id="clients"
      className="relative"
      aria-labelledby="clients-heading"
    >
      {/* Background elements */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"
        aria-hidden="true"
      />
      <div
        className="bg-primary/20 absolute right-1/4 bottom-1/4 -z-10 h-72 w-72 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-yellow-500/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <SectionTitle
          title="Trusted by Industry Leaders"
          subtitle="We partner with top companies across various industries to deliver exceptional results."
        />

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              index={Number.parseInt(client.id.split("-")[1]) - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
