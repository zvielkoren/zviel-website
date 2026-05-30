declare global {
  var D1: any;
}

export function getD1Client(): any {
  if (!globalThis.D1) {
    throw new Error("D1 database not available");
  }
  return globalThis.D1;
}
