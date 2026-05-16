export type Language = "English" | "Hinglish" | "Hindi";

export interface SellerSummary {
  glid: string;
  record_type: string;
  company_name: string;
  contact_person: string;
  city: string;
  state: string;
  customer_type: string;
  business_type: string;
  product_count: number;
  category_score: string;
}

export interface SourceChunk {
  id: string;
  source: string;
  title: string;
  text: string;
  score: number;
  kind: "doc" | "seller";
}

export interface SellerRecord {
  record_type: string;
  glid: string;
  company_id: string;
  sts_company_id: string;
  seller_identity: Record<string, any>;
  account_status: Record<string, any>;
  contact_context: Record<string, any>;
  performance_snapshot: Record<string, any>;
  sales_service_history: Array<Record<string, any>>;
  pain_points: Array<Record<string, any>>;
  model_usage_notes: Record<string, any>;
}

export interface GenerationResponse {
  mode: "gateway" | "local_fallback";
  model: string;
  content: string;
  sources: SourceChunk[];
  diagnostics: Record<string, string | null>;
}

export interface HealthResponse {
  status: string;
  sellers: number;
  docs: number;
  seller_chunks: number;
  total_chunks: number;
  llm_configured: boolean;
  primary_model: string;
  fallback_model: string;
  base_url: string;
  llm_status: string;
  rag_status: string;
}
