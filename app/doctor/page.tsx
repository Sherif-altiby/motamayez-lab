"use client";

import { useAuth } from "@/lib/auth";
import { PatientsManager } from "@/components/patients-manager";

export default function DoctorPage() {
  const { user } = useAuth();
  if (!user) return null;
  return <PatientsManager ownerType="doctor" ownerId={user.id} />;
}
