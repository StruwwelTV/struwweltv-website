import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/siteSettings";

export const dynamic = "force-dynamic";
export async function GET(){ return NextResponse.json(await getSiteSettings(),{headers:{"Cache-Control":"no-store"}}); }
