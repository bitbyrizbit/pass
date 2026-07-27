export type UserRole = "customer" | "staff" | "admin";

export interface Profile {
  id: string;
  role: UserRole;
  display_name: string | null;
  created_at: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  is_available: boolean;
  category: string;
  created_at: string;
}
export interface Order {
  id: string;
  customer_id: string;
  table_number: number;
  status: "fired" | "in_progress" | "bumped" | "served";
  total: number;
  created_at: string;
  fired_at: string;
  bumped_at: string | null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  notes: string | null;
}

export interface OrderWithItems extends Order {
  order_items: (OrderItem & { menu_items: { name: string; price: number } })[];
}