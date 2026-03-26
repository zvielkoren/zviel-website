export type Experiment = {
  name: string;
  category: string;
  summary: string;
  tags: string[];
  stats?: { label: string; value: string }[];
};

export const experimentFilters = [
  "All Nodes",
  "AI Infrastructure",
  "DevOps Tools",
  "Protocol Labs",
  "System Logs"
];

export const labHighlights: Experiment[] = [
  {
    name: "NEURAL_NET_INFRA",
    category: "REF: AX-700",
    summary:
      "Multi-region LLM deployment orchestrator using Kubernetes and custom load-balancing algorithms for token-efficient inference.",
    tags: ["Rust", "K8S", "CUDA"],
    stats: [{ label: "Uptime Index", value: "99.998%" }]
  },
  {
    name: "GHOST_DB",
    category: "ACTIVE",
    summary: "In-memory ephemeral database for stateless microservices with sub-ms latency.",
    tags: ["Throughput", "80%"]
  },
  {
    name: "SHARD_COLLECTOR",
    category: "Observability",
    summary: "Real-time log aggregation engine built for high-throughput observability.",
    tags: ["NODE_01 0.14ms", "NODE_02 0.18ms", "NODE_03 LOST"]
  },
  {
    name: "TERMINAL_CORE_V2",
    category: "Experimental UI",
    summary: "Next-gen CLI interface for managing distributed infrastructure using natural language.",
    tags: ["Source Placeholder"]
  }
];

export const activityLogs = [
  {
    time: "12:45:01.004",
    source: "NETWORK_INF",
    message: "Initializing peer discovery on port 4004. Protocol: QUIC.",
    region: "US-EAST-1",
    level: "info"
  },
  {
    time: "12:44:58.212",
    source: "STORAGE_MGR",
    message: "Shard reallocation completed for Cluster_Delta. 1.2TB balanced.",
    region: "EU-WEST-2",
    level: "info"
  },
  {
    time: "12:44:12.885",
    source: "AUTH_CORE",
    message: "Handshake timeout on internal proxy node AX-04. Retrying...",
    region: "SYS_INT",
    level: "error"
  },
  {
    time: "12:43:45.109",
    source: "CI_CD_BOT",
    message: "Experiment [NEURAL_ENV] deployed to staging-v4 successfully.",
    region: "BUILD_09",
    level: "info"
  }
];
