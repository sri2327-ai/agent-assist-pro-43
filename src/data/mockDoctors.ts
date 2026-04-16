export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  status: "Active" | "On Leave" | "Inactive";
  patients: number;
  rating: number;
  joinDate: string;
  avatar?: string;
}

const specialties = [
  "Cardiology", "Dermatology", "Neurology", "Orthopedics", "Pediatrics",
  "Psychiatry", "Radiology", "Surgery", "Oncology", "Endocrinology",
];

const doctorNames = [
  "Dr. Aisha Patel", "Dr. Rajesh Kumar", "Dr. Sneha Reddy", "Dr. Vikram Shah",
  "Dr. Meera Nair", "Dr. Arjun Desai", "Dr. Priya Gupta", "Dr. Sanjay Iyer",
  "Dr. Kavita Sharma", "Dr. Rohit Menon", "Dr. Divya Das", "Dr. Manish Joshi",
  "Dr. Anita Rao", "Dr. Suresh Pillai", "Dr. Neha Kapoor", "Dr. Tarun Bhatia",
  "Dr. Swati Sen", "Dr. Gaurav Mishra", "Dr. Rekha Prasad", "Dr. Nikhil Goyal",
];

const statuses: Doctor["status"][] = ["Active", "On Leave", "Inactive"];

export const mockDoctors: Doctor[] = Array.from({ length: 20 }, (_, i) => ({
  id: String(i + 1),
  name: doctorNames[i % doctorNames.length],
  specialty: specialties[i % specialties.length],
  phone: `+91 ${Math.floor(7000000000 + Math.random() * 3000000000)}`,
  email: `${doctorNames[i % doctorNames.length].replace("Dr. ", "").toLowerCase().replace(/\s/g, ".")}@hospital.com`,
  status: statuses[i < 14 ? 0 : i < 18 ? 1 : 2],
  patients: Math.floor(50 + Math.random() * 200),
  rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
  joinDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(1 + Math.random() * 28)).toISOString().split("T")[0],
}));
