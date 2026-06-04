import { NextResponse } from "next/server";
import { getServices, addService, deleteService } from "@/lib/portfolioService";

export async function GET() {
  console.log("Services API: GET request received");
  try {
    const list = await getServices();
    return NextResponse.json(list);
  } catch (error) {
    console.error("Services API GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch services", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, title, category, description, techs, iconName, colorClass } = body;

    if (!title) {
      return NextResponse.json({ error: "Service title is required" }, { status: 400 });
    }

    const cleanId = id || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const newService = await addService({
      id: cleanId,
      title,
      category: category || "General",
      description: description || "",
      techs: Array.isArray(techs) ? techs : [],
      iconName: iconName || "FaCode",
      colorClass: colorClass || "from-cyan-400 to-teal-400 text-cyan-400"
    });

    return NextResponse.json({ success: true, service: newService });
  } catch (error) {
    console.error("Services API POST error:", error);
    return NextResponse.json(
      { error: "Failed to create service", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
    }

    const success = await deleteService(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("Services API DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete service", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
