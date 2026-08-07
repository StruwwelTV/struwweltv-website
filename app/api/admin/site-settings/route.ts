import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getSiteSettings, saveSiteSettings } from "@/lib/siteSettings";

export const dynamic = "force-dynamic";
export async function GET(){ if(!(await isAdminAuthenticated())) return NextResponse.json({error:"Unauthorized"},{status:401}); return NextResponse.json(await getSiteSettings(),{headers:{"Cache-Control":"no-store"}}); }
export async function PUT(req:Request){ if(!(await isAdminAuthenticated())) return NextResponse.json({error:"Unauthorized"},{status:401}); try { const settings=await req.json(); await saveSiteSettings(settings); return NextResponse.json({ok:true}); } catch { return NextResponse.json({error:"Speichern fehlgeschlagen."},{status:400}); } }
