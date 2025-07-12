export interface User {
    id: string;
    name: string;
    email: string;
    role: 'Production Planner' | 'Quality Inspector' | 'Administrator';
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