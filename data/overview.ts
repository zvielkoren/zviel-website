export const metrics = [
  { label: "Latency", value: "12ms", detail: "Avg Response Time" },
  { label: "Throughput", value: "2.4M", detail: "Requests / Sec" }
];

export const coreCompetency = {
  title: "Kubernetes & Distributed Systems",
  subLeft: "99.99% UPTIME ARCH",
  subRight: "#01_DEPLOY"
};

export const liveLogs = [
  {
    timestamp: "2024.05.22 14:02:11",
    event: "Optimized PostgreSQL query execution plan for high-load billing module",
    state: "Deployed"
  },
  {
    timestamp: "2024.05.21 09:44:56",
    event: "Migrated 4TB legacy S3 storage to optimized Coldline tier via Terraform",
    state: "Archived"
  },
  {
    timestamp: "2024.05.18 22:10:02",
    event: "Internal load balancer reconfiguration: +15% throughput efficiency",
    state: "Completed"
  }
];

export const architectureNodes = [
  { id: "Node_01", label: "API CLUSTER" },
  { id: "Node_02", label: "MESSAGE BUS" },
  { id: "Node_03", label: "PERSISTENCE" }
];
