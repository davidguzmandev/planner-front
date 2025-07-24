export interface User {
  id: string;
  name: string;
  email: string;
  role: "Production Planner" | "Quality Inspector" | "Administrator";
}

export interface Part {
  id: string;
  part_number: string;
  description?: string;
  project_id: number;
  product_id: number;
  coefficient?: number;
  comments?: string;
  destination_id: number;
  quantity_requested: number;
  quantity_remaining: number;
  created_at: Date;
  updated_at: Date;
}

export interface DeliveryPlan {
  id: number;
  week_start_date: Date;
  week_number: number;
  year: number;
  priority_rank: number;
  inspection_date: Date | null; // Nullable
  quantity_to_inspect: number; // NOT NULL, DEFAULT 0
  quantity_inspected: number; // NOT NULL, DEFAULT 0
  quantity_rejected: number; // NOT NULL, DEFAULT 0
  reasons: string | null; // Nullable
  qc_member: string | null; // Nullable
  responsible: string | null;
  comment: string | null; // Nullable
  created_at: Date;
  updated_at: Date;
  part_id: string;
  // Campos obtenidos mediante JOIN
  part_number?: string;
  part_description?: string;
}
