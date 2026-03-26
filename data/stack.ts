export const stackIntro = {
  title: "Engineered for Resilience.",
  subtitle:
    "A comprehensive overview of the technologies and architectural patterns used to build high-availability, low-latency backend infrastructure."
};

export const stackGroups = [
  {
    category: "Languages",
    description: "Production languages used in reliability-critical backends and services.",
    items: [
      { name: "Java", detail: "Spring Boot, JVM profiling, service hardening" },
      { name: "Python", detail: "Data pipelines, observability automation, orchestration tooling" },
      { name: "Rust", detail: "Low-level systems, memory safety, high-throughput workers" },
      { name: "TypeScript", detail: "Node services, control planes, API contracts" }
    ]
  },
  {
    category: "Infrastructure",
    description: "Cloud and platform capabilities for scalable deployments.",
    items: [
      { name: "Kubernetes", detail: "Multi-cluster operations, workload scheduling, autoscaling" },
      { name: "Terraform", detail: "Composable infrastructure modules, policy-driven rollout" },
      { name: "AWS", detail: "VPC, Lambda, storage tiers, event routing" },
      { name: "Cloudflare", detail: "Edge controls, DNS, traffic management, security rules" }
    ]
  },
  {
    category: "Systems / Architecture",
    description: "Design patterns for resilient distributed platforms.",
    items: [
      { name: "Distributed Systems", detail: "Event-driven services, consensus-aware design" },
      { name: "Networking", detail: "L4/L7 patterns, secure service communication, routing strategy" },
      { name: "Caching & State", detail: "Redis layers, cache topology, invalidation strategy" },
      { name: "Scaling", detail: "Sharding, partitioning, horizontal and queue-driven elasticity" }
    ]
  },
  {
    category: "Tooling",
    description: "Engineering tools that support reliability and operational speed.",
    items: [
      { name: "GitHub Actions", detail: "CI/CD workflows, deployment safeguards, release automation" },
      { name: "Docker", detail: "Repeatable local and production runtime environments" },
      { name: "PostgreSQL", detail: "Query optimization, migration planning, indexing strategy" },
      { name: "OpenTelemetry", detail: "Tracing and metrics instrumentation" }
    ]
  }
];
