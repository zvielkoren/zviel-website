export type A11yContrast = "normal" | "high" | "monochrome";
export type A11yTextSize = "normal" | "large" | "extra-large";
export type A11yLineSpacing = "normal" | "wide" | "extra-wide";
export type A11yCursor = "normal" | "large";
export type A11yMotion = "normal" | "reduced";

export interface A11yState {
  contrast: A11yContrast;
  textSize: A11yTextSize;
  lineSpacing: A11yLineSpacing;
  cursor: A11yCursor;
  motion: A11yMotion;
}

const DEFAULT_STATE: A11yState = {
  contrast: "normal",
  textSize: "normal",
  lineSpacing: "normal",
  cursor: "normal",
  motion: "normal"
};

type Listener = (state: A11yState) => void;

class A11yStore {
  private state: A11yState = { ...DEFAULT_STATE };
  private listeners: Set<Listener> = new Set();
  private storageKey = "zviel-website-a11y-prefs";

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
          this.state = { ...DEFAULT_STATE, ...JSON.parse(saved) };
        }
      } catch (e) {
        console.error("Failed to load a11y preferences:", e);
      }
    }
  }

  public getState(): A11yState {
    return { ...this.state };
  }

  public setState(updates: Partial<A11yState>) {
    this.state = { ...this.state, ...updates };
    
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
        this.applyDomClasses(this.state);
      } catch (e) {
        console.error("Failed to save a11y preferences:", e);
      }
    }

    this.notify();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener({ ...this.state }));
  }

  public reset() {
    this.setState(DEFAULT_STATE);
  }

  public applyDomClasses(state: A11yState) {
    if (typeof document === "undefined") return;
    
    const root = document.documentElement;

    // 1. Contrast Classes
    root.classList.remove("a11y-contrast-high", "a11y-contrast-monochrome");
    if (state.contrast === "high") root.classList.add("a11y-contrast-high");
    else if (state.contrast === "monochrome") root.classList.add("a11y-contrast-monochrome");

    // 2. Text Size Classes
    root.classList.remove("a11y-text-large", "a11y-text-extra-large");
    if (state.textSize === "large") root.classList.add("a11y-text-large");
    else if (state.textSize === "extra-large") root.classList.add("a11y-text-extra-large");

    // 3. Line Spacing Classes
    root.classList.remove("a11y-spacing-wide", "a11y-spacing-extra-wide");
    if (state.lineSpacing === "wide") root.classList.add("a11y-spacing-wide");
    else if (state.lineSpacing === "extra-wide") root.classList.add("a11y-spacing-extra-wide");

    // 4. Cursor Classes
    root.classList.remove("a11y-cursor-large");
    if (state.cursor === "large") root.classList.add("a11y-cursor-large");

    // 5. Motion Classes
    root.classList.remove("a11y-motion-reduced");
    if (state.motion === "reduced") root.classList.add("a11y-motion-reduced");
  }
}

// Single instance of the store
export const a11yStore = new A11yStore();
