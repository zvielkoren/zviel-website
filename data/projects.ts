export type ProjectEntry = {
  code: string;
  title: string;
  summary: string;
  stack: string[];
};

export const featuredProjects: ProjectEntry[] = [
  {
    code: "PROD_01",
    title: "Distributed Ledger Core",
    summary:
      "High-throughput transaction engine processing 50k+ events/sec. Built with event-sourcing patterns and multi-region consensus protocols to ensure atomic consistency across global nodes.",
    stack: ["Rust", "gRPC", "PostgreSQL", "Kafka"]
  },
  {
    code: "PROD_02",
    title: "Cloud Orchestration Mesh",
    summary:
      "Custom service mesh implementation providing automated mTLS, circuit breaking, and traffic shadowing. Reduced inter-service latency by 40% using optimized eBPF filtering.",
    stack: ["Go", "Kubernetes", "eBPF", "Istio"]
  },
  {
    code: "PROD_03",
    title: "Real-time Analytics Pipeline",
    summary:
      "Serverless data processing pipeline handling multi-terabyte daily streams. Implemented custom windowing logic and secondary indexing for sub-second query responses on cold storage.",
    stack: ["Python", "AWS Lambda", "Snowflake", "Terraform"]
  },
  {
    code: "PROD_04",
    title: "Identity & Access Hub",
    summary:
      "Hardened IAM system supporting OIDC and hardware-backed MFA. Features an automated credential rotation engine and real-time anomaly detection for authentication patterns.",
    stack: ["Node.js", "Redis", "OAuth 2.0", "Vault"]
  }
];
