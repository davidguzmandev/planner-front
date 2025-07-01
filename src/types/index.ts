export interface User {
    id: string;
    name: string;
    email: string;
    role: 'Production Planner' | 'Quality Inspector' | 'Administrator';
}