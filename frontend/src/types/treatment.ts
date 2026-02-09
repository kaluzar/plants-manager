/**
 * Treatment types
 */

export type IssueType = 'pest' | 'disease';
export type TreatmentType = 'chemical' | 'organic' | 'manual' | 'biological';
export type TreatmentStatus = 'active' | 'completed' | 'cancelled';

export interface Treatment {
  id: string;
  plant_id: string;
  issue_type: IssueType;
  issue_name: string;
  treatment_type: TreatmentType;
  product_name?: string;
  start_date: string;
  end_date?: string;
  status: TreatmentStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface TreatmentCreate {
  plant_id: string;
  issue_type: IssueType;
  issue_name: string;
  treatment_type: TreatmentType;
  product_name?: string;
  start_date: string;
  end_date?: string;
  status: TreatmentStatus;
  notes?: string;
}

export interface TreatmentUpdate {
  issue_type?: IssueType;
  issue_name?: string;
  treatment_type?: TreatmentType;
  product_name?: string;
  start_date?: string;
  end_date?: string;
  status?: TreatmentStatus;
  notes?: string;
}

export interface TreatmentApplication {
  id: string;
  treatment_id: string;
  applied_at: string;
  amount?: string;
  notes?: string;
  created_at: string;
}

export interface TreatmentApplicationCreate {
  treatment_id: string;
  applied_at: string;
  amount?: string;
  notes?: string;
}

export interface TreatmentWithApplications extends Treatment {
  applications: TreatmentApplication[];
}
