import { spawn } from "child_process";

interface RunnerConfig {
  language: string;
  timeout?: number;
}

interface CodeExecutionResult {
  output: string;
  error?: string;
}

const languageConfigs: Record<string, RunnerConfig> = {
  python: {
    language: "python",
    timeout: 30000,
  },
  javascript: {
    language: "javascript",
    timeout: 30000,
  },
  typescript: {
    language: "typescript",
    timeout: 30000,
  },
  java: {
    language: "java",
    timeout: 30000,
  },
  c: {
    language: "c",
    timeout: 30000,
  },
  cpp: {
    language: "cpp",
    timeout: 30000,
  },
  go: {
    language: "go",
    timeout: 30000,
  },
  rust: {
    language: "rust",
    timeout: 30000,
  },
  ruby: {
    language: "ruby",
    timeout: 30000,
  },
  php: {
    language: "php",
    timeout: 30000,
  },
  swift: {
    language: "swift",
    timeout: 30000,
  },
  kotlin: {
    language: "kotlin",
    timeout: 30000,
  },
};

export class CodeRunner {
  private static executions = new Map<string, { timeout: NodeJS.Timeout }>();

  static async runCode(
    demoId: string,
    code: string,
    language: string
  ): Promise<CodeExecutionResult> {
    // Remove any existing execution
    CodeRunner.stopCode(demoId);

    // For now, return a mock response
    // TODO: Implement actual code execution using a service or WebAssembly
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        resolve({
          output: `Mock output for ${language} code:\n${code.slice(0, 100)}...`,
          error: undefined,
        });
      }, 1000);

      CodeRunner.executions.set(demoId, { timeout: timer });
    });
  }

  static stopCode(demoId: string): void {
    const execution = CodeRunner.executions.get(demoId);
    if (execution) {
      clearTimeout(execution.timeout);
      CodeRunner.executions.delete(demoId);
    }
  }

  static detectLanguage(fileName: string): string {
    const ext = fileName.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "py":
        return "python";
      case "js":
        return "javascript";
      case "ts":
        return "typescript";
      case "java":
        return "java";
      case "c":
        return "c";
      case "cpp":
        return "cpp";
      case "go":
        return "go";
      case "rs":
        return "rust";
      case "rb":
        return "ruby";
      case "php":
        return "php";
      case "swift":
        return "swift";
      case "kt":
        return "kotlin";
      default:
        return "unknown";
    }
  }
}
