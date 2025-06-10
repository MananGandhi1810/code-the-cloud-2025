import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-start justify-center min-h-screen py-12 px-8 text-left max-w-6xl mx-auto sm:px-12 lg:px-16">
      <div className="mb-6">
        <span className="inline-block px-3 py-1 text-xs font-mono font-medium tracking-wider uppercase text-yellow-900 bg-yellow-200 rounded-full">
          ⚡ Supercharge Your API Integrations
        </span>
      </div>{" "}
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4 sm:text-4xl md:text-6xl lg:text-7xl">
        Stop waiting for your backend team to deploy.
        <br />
        <span className="text-primary">Ship faster.</span>
      </h1>
      <div className="mb-8">
        <p
          className="text-lg text-muted-foreground font-mono italic tracking-wide"
          style={{
            fontFamily: "'Product Sans', sans-serif",
            fontWeight: 400,
            fontStyle: "italic",
          }}
        >
          Backend devs got Postman, don't worry frontend gurus,{" "}
          <span className="text-primary font-medium">Manpost</span> got you
          covered.
        </p>
      </div>
      <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl font-light">
        Drop your GitHub repo or OpenAPI spec. We instantly deploy, run
        comprehensive tests, and make your APIs production-ready while you focus
        on building.
      </p>
      <Button className="text-lg px-8 font-medium py-5 border-2 border-black">
        <a href="/signup">Start Building Now →</a>
      </Button>
    </div>
  );
}
