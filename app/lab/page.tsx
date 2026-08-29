"use client";

import { useAuth } from "@/lib/auth";
import { PatientsManager } from "@/components/patients-manager";

export default function LabPage() {
  const { user } = useAuth();
  if (!user) return null;
  return <PatientsManager ownerType="lab" ownerId={user.id} />;
}
