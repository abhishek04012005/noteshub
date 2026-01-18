// Notes Types
export interface Notes {
  id: string;
  title: string;
  description: string;
  university?: string;
  course?: string;
  branch?: string;
  semester?: string;
  subject: string;
  chapter_no?: string;
  price?: number; // Keep for backward compatibility
  original_price: number;
  discounted_price: number;
  author: string;
  image_url?: string;
  download_url?: string;
  created_at: string;
  updated_at: string;
}

// Purchase Types
export interface Purchase {
  email: string;
  id: string;
  notes_id: string;
  customer_email: string;
  customer_name: string;
  amount: number;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  download_url: string;
  created_at: string;
  updated_at: string;
  // Note details
  notes?: {
    download_url: any;
    id: string;
    university?: string;
    course?: string;
    branch?: string;
    semester?: string;
    subject: string;
    chapter_no?: string;
    title: string;
  };
}

// Admin Types
export interface AdminSession {
  id: string;
  email: string;
  name: string;
  is_admin: boolean;
  created_at: string;
}

// Google Drive Upload Response
export interface GoogleDriveUploadResponse {
  file_id: string;
  file_name: string;
  web_view_link: string;
  download_link: string;
}

// Razorpay Order Response
export interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}
