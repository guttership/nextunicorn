import { NextResponse } from "next/server";

function getConfiguredAdminSecret() {
  return process.env.ADMIN_PASSWORD || process.env.CRON_SECRET || "";
}

export function isAdminRequest(request: Request) {
  const configuredSecret = getConfiguredAdminSecret();
  const providedSecret = request.headers.get("x-admin-secret") || "";

  return Boolean(configuredSecret) && providedSecret === configuredSecret;
}

export function unauthorizedAdminResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
