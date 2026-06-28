export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
export type ActivityType = 'note' | 'call' | 'meeting' | 'status_change' | 'email_sent' | 'task';
export type WorkflowTrigger = 'lead_status_changed';
export type WorkflowAction = 'create_task' | 'send_email';
export type EmailStatus = 'queued' | 'sent' | 'failed' | 'bounced';
export type TeamRole = 'admin' | 'sales' | 'manager';

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Lead = {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  status: LeadStatus;
  owner_id: string;
  assigned_to: string | null;
  value: number | null;
  created_at: string;
  updated_at: string;
};

export type Activity = {
  id: string;
  lead_id: string;
  type: ActivityType;
  note: string | null;
  created_by: string;
  created_at: string;
};

export type WorkflowCondition = {
  field: string;
  operator: 'eq' | 'neq' | 'in' | 'not_in';
  value: string | string[];
};

export type WorkflowActionPayload = {
  template_id?: string;
  task_note?: string;
};

export type WorkflowRule = {
  id: string;
  name: string;
  trigger_event: WorkflowTrigger;
  condition: WorkflowCondition;
  action: WorkflowAction;
  action_payload: WorkflowActionPayload;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  body: string;
  created_at: string;
  updated_at: string;
};

export type EmailLog = {
  id: string;
  lead_id: string | null;
  template_id: string | null;
  recipient: string;
  status: EmailStatus;
  provider: string;
  sent_at: string | null;
};

export type TeamMember = {
  id: string;
  user_id: string;
  role: TeamRole;
  created_at: string;
};

// Joined types for queries
export type LeadWithAssignee = {
  owner: Profile | null;
  assignee: Profile | null;
} & Lead;

export type ActivityWithUser = {
  creator: Profile | null;
} & Activity;

export type TeamMemberWithProfile = {
  profile: Profile | null;
} & TeamMember;
