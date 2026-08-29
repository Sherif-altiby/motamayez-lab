"use client";

// المتميز لاب — طبقة تخزين بيانات بسيطة فوق localStorage (بيانات تجريبية للعرض).
// كل الملفات (نتائج PDF) تُخزَّن كـ base64 داخل localStorage لأغراض العرض التوضيحي.

export type Role = "admin" | "doctor" | "lab";

export interface DoctorAccount {
  id: string;
  name: string;
  phone: string;
  specialty: string;
  username: string;
  password: string;
  createdAt: string;
}

export interface LabAccount {
  id: string;
  name: string;
  address: string;
  phone: string;
  username: string;
  password: string;
  createdAt: string;
}

export interface ResultFile {
  id: string;
  fileName: string;
  fileData: string; // base64 data URL
  uploadedAt: string;
  note?: string;
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  age: number;
  ownerType: "doctor" | "lab";
  ownerId: string;
  createdAt: string;
  results: ResultFile[];
}

interface DB {
  admin: { username: string; password: string; name: string };
  doctors: DoctorAccount[];
  labs: LabAccount[];
  patients: Patient[];
}

const DB_KEY = "motamayez-lab-db-v1";
const EVENT = "motamayez-lab-db-changed";

function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function seed(): DB {
  const now = new Date().toISOString();
  const doctorId = uid("doc");
  const labId = uid("lab");
  return {
    admin: { username: "admin", password: "admin123", name: "مدير النظام" },
    doctors: [
      {
        id: doctorId,
        name: "د. أحمد سامي",
        phone: "01001234567",
        specialty: "باطنة عامة",
        username: "ahmed.sami",
        password: "12345",
        createdAt: now,
      },
    ],
    labs: [
      {
        id: labId,
        name: "معمل النور للتحاليل",
        address: "القاهرة - المعادي",
        phone: "01123456789",
        username: "alnoor.lab",
        password: "12345",
        createdAt: now,
      },
    ],
    patients: [
      {
        id: uid("pat"),
        name: "مريم عبد الله",
        phone: "01234567890",
        age: 29,
        ownerType: "doctor",
        ownerId: doctorId,
        createdAt: now,
        results: [],
      },
      {
        id: uid("pat"),
        name: "كريم عزت",
        phone: "01098765432",
        age: 41,
        ownerType: "lab",
        ownerId: labId,
        createdAt: now,
        results: [],
      },
    ],
  };
}

function read(): DB {
  if (typeof window === "undefined") return seed();
  const raw = window.localStorage.getItem(DB_KEY);
  if (!raw) {
    const fresh = seed();
    window.localStorage.setItem(DB_KEY, JSON.stringify(fresh));
    return fresh;
  }
  try {
    return JSON.parse(raw) as DB;
  } catch {
    const fresh = seed();
    window.localStorage.setItem(DB_KEY, JSON.stringify(fresh));
    return fresh;
  }
}

function write(db: DB) {
  window.localStorage.setItem(DB_KEY, JSON.stringify(db));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export const store = {
  getAll(): DB {
    return read();
  },

  // ----- Doctors -----
  addDoctor(input: Omit<DoctorAccount, "id" | "createdAt">) {
    const db = read();
    const doc: DoctorAccount = { ...input, id: uid("doc"), createdAt: new Date().toISOString() };
    db.doctors.push(doc);
    write(db);
    return doc;
  },
  updateDoctor(id: string, patch: Partial<Omit<DoctorAccount, "id" | "createdAt">>) {
    const db = read();
    db.doctors = db.doctors.map((d) => (d.id === id ? { ...d, ...patch } : d));
    write(db);
  },
  deleteDoctor(id: string) {
    const db = read();
    db.doctors = db.doctors.filter((d) => d.id !== id);
    db.patients = db.patients.filter((p) => !(p.ownerType === "doctor" && p.ownerId === id));
    write(db);
  },

  // ----- Labs -----
  addLab(input: Omit<LabAccount, "id" | "createdAt">) {
    const db = read();
    const lab: LabAccount = { ...input, id: uid("lab"), createdAt: new Date().toISOString() };
    db.labs.push(lab);
    write(db);
    return lab;
  },
  updateLab(id: string, patch: Partial<Omit<LabAccount, "id" | "createdAt">>) {
    const db = read();
    db.labs = db.labs.map((l) => (l.id === id ? { ...l, ...patch } : l));
    write(db);
  },
  deleteLab(id: string) {
    const db = read();
    db.labs = db.labs.filter((l) => l.id !== id);
    db.patients = db.patients.filter((p) => !(p.ownerType === "lab" && p.ownerId === id));
    write(db);
  },

  // ----- Patients -----
  addPatient(input: { name: string; phone: string; age: number; ownerType: "doctor" | "lab"; ownerId: string }) {
    const db = read();
    const patient: Patient = { ...input, id: uid("pat"), createdAt: new Date().toISOString(), results: [] };
    db.patients.push(patient);
    write(db);
    return patient;
  },
  updatePatient(id: string, patch: Partial<Pick<Patient, "name" | "phone" | "age">>) {
    const db = read();
    db.patients = db.patients.map((p) => (p.id === id ? { ...p, ...patch } : p));
    write(db);
  },
  deletePatient(id: string) {
    const db = read();
    db.patients = db.patients.filter((p) => p.id !== id);
    write(db);
  },
  addResult(patientId: string, file: Omit<ResultFile, "id" | "uploadedAt">) {
    const db = read();
    db.patients = db.patients.map((p) =>
      p.id === patientId
        ? { ...p, results: [...p.results, { ...file, id: uid("res"), uploadedAt: new Date().toISOString() }] }
        : p
    );
    write(db);
  },
  deleteResult(patientId: string, resultId: string) {
    const db = read();
    db.patients = db.patients.map((p) =>
      p.id === patientId ? { ...p, results: p.results.filter((r) => r.id !== resultId) } : p
    );
    write(db);
  },

  patientsFor(ownerType: "doctor" | "lab", ownerId: string) {
    return read().patients.filter((p) => p.ownerType === ownerType && p.ownerId === ownerId);
  },
};
