import { NextResponse } from "next/server";
import { getLanguages, addLanguage, deleteLanguage } from "@/lib/portfolioService";

export async function GET() {
  console.log("Languages API: GET request received");
  try {
    const list = await getLanguages();
    return NextResponse.json(list);
  } catch (error) {
    console.error("Languages API GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch languages", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, type } = body;

    if (!name) {
      return NextResponse.json({ error: "Language name is required" }, { status: 400 });
    }

    if (!type || (type !== "core" && type !== "other")) {
      return NextResponse.json({ error: "Type must be either 'core' or 'other'" }, { status: 400 });
    }

    const cleanId = id || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const newLang = await addLanguage({
      id: cleanId,
      name,
      type
    });

    return NextResponse.json({ success: true, language: newLang });
  } catch (error) {
    console.error("Languages API POST error:", error);
    return NextResponse.json(
      { error: "Failed to create language", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Language ID is required" }, { status: 400 });
    }

    const success = await deleteLanguage(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("Languages API DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete language", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
