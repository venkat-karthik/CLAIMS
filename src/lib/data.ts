// KiAI Claims — shared types and mock data

export type Role = 'claims_manager' | 'claims_handler' | 'surveyor' | 'workshop' | 'siu' | 'cx' | 'finance' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  team: string;
  region: string;
}

export interface Claim {
  id: string;
  policyNumber: string;
  claimantName: string;
  vehicle: string;
  status: 'submitted' | 'docs_pending' | 'in_review' | 'surveyed' | 'estimated' | 'approved' | 'in_repair' | 'invoice_uploaded' | 'delivered' | 'closed' | 'flagged';
  riskScore: number;
  fraudFlagged: boolean;
  slaDue: string;
  slaStatus: 'ok' | 'warn' | 'breach';
  assignedTo: string;
  workshop: string;
  aiEstimate: number;
  invoiceAmount: number;
  claimAmount: number;
  incidentDate: string;
  createdAt: string;
  region: string;
  requiredAction: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  docCompleteness: number;
  aiConfidence: number;
  type: 'motor' | 'health' | 'property' | 'liability';
}

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Arjun Mehta', email: 'arjun@kiai.claims', role: 'claims_manager', avatar: 'AM', team: 'Operations', region: 'South' },
  { id: 'u2', name: 'Priya Sharma', email: 'priya@kiai.claims', role: 'claims_handler', avatar: 'PS', team: 'Claims Desk', region: 'North' },
  { id: 'u3', name: 'Rajesh Kumar', email: 'rajesh@kiai.claims', role: 'surveyor', avatar: 'RK', team: 'Survey', region: 'West' },
  { id: 'u4', name: 'AutoFix Bangalore', email: 'autofix@workshop.in', role: 'workshop', avatar: 'AF', team: 'Workshop', region: 'South' },
  { id: 'u5', name: 'Sneha Patel', email: 'sneha@kiai.claims', role: 'siu', avatar: 'SP', team: 'SIU', region: 'All' },
  { id: 'u6', name: 'Kavita Rao', email: 'kavita@kiai.claims', role: 'cx', avatar: 'KR', team: 'Customer Experience', region: 'All' },
  { id: 'u7', name: 'Vikram Singh', email: 'vikram@kiai.claims', role: 'finance', avatar: 'VS', team: 'Finance', region: 'All' },
  { id: 'u8', name: 'Admin User', email: 'admin@kiai.claims', role: 'admin', avatar: 'AU', team: 'IT Admin', region: 'All' },
];

export const MOCK_CLAIMS: Claim[] = [
  {
    id: 'CLM-2024-0891', policyNumber: 'POL-MH-48291', claimantName: 'Deepak Nair', vehicle: 'Honda City DL-01-AB-1234',
    status: 'flagged', riskScore: 87, fraudFlagged: true, slaDue: '2h 14m', slaStatus: 'breach',
    assignedTo: 'Priya Sharma', workshop: 'AutoFix Bangalore', aiEstimate: 145000, invoiceAmount: 218000,
    claimAmount: 210000, incidentDate: '2024-02-14', createdAt: '2024-02-15', region: 'South',
    requiredAction: 'SIU Review Required — Invoice deviation 50%', priority: 'critical',
    docCompleteness: 72, aiConfidence: 34, type: 'motor',
  },
  {
    id: 'CLM-2024-0892', policyNumber: 'POL-KA-92847', claimantName: 'Meera Krishnan', vehicle: 'Hyundai Creta KA-03-CD-5678',
    status: 'in_review', riskScore: 42, fraudFlagged: false, slaDue: '1d 6h', slaStatus: 'warn',
    assignedTo: 'Priya Sharma', workshop: 'StarAuto Chennai', aiEstimate: 89000, invoiceAmount: 91500,
    claimAmount: 90000, incidentDate: '2024-02-13', createdAt: '2024-02-14', region: 'South',
    requiredAction: 'Awaiting manager approval — ₹90,000 threshold', priority: 'high',
    docCompleteness: 100, aiConfidence: 91, type: 'motor',
  },
  {
    id: 'CLM-2024-0893', policyNumber: 'POL-MH-38102', claimantName: 'Suresh Babu', vehicle: 'Maruti Swift MH-12-EF-9012',
    status: 'docs_pending', riskScore: 28, fraudFlagged: false, slaDue: '3d 2h', slaStatus: 'ok',
    assignedTo: 'Unassigned', workshop: 'TBD', aiEstimate: 0, invoiceAmount: 0,
    claimAmount: 34000, incidentDate: '2024-02-16', createdAt: '2024-02-16', region: 'West',
    requiredAction: 'Missing: RC copy, FIR report — Auto-reminder sent', priority: 'medium',
    docCompleteness: 45, aiConfidence: 0, type: 'motor',
  },
  {
    id: 'CLM-2024-0894', policyNumber: 'POL-TN-77291', claimantName: 'Ananya Iyer', vehicle: 'Toyota Innova TN-22-GH-3456',
    status: 'in_repair', riskScore: 31, fraudFlagged: false, slaDue: '5d 0h', slaStatus: 'ok',
    assignedTo: 'Rajesh Kumar', workshop: 'Premium Motors Chennai', aiEstimate: 62000, invoiceAmount: 0,
    claimAmount: 65000, incidentDate: '2024-02-10', createdAt: '2024-02-11', region: 'South',
    requiredAction: 'Workshop: Day 4 of 7 — On track', priority: 'low',
    docCompleteness: 100, aiConfidence: 88, type: 'motor',
  },
  {
    id: 'CLM-2024-0895', policyNumber: 'POL-DL-11847', claimantName: 'Rohit Gupta', vehicle: 'BMW 3 Series DL-5C-IJ-7890',
    status: 'estimated', riskScore: 61, fraudFlagged: false, slaDue: '18h', slaStatus: 'warn',
    assignedTo: 'Priya Sharma', workshop: 'Prestige BMW Delhi', aiEstimate: 285000, invoiceAmount: 0,
    claimAmount: 280000, incidentDate: '2024-02-12', createdAt: '2024-02-13', region: 'North',
    requiredAction: 'High value — Manager approval pending', priority: 'high',
    docCompleteness: 100, aiConfidence: 78, type: 'motor',
  },
  {
    id: 'CLM-2024-0896', policyNumber: 'POL-MH-55210', claimantName: 'Lakshmi Venkat', vehicle: 'Tata Nexon MH-04-KL-2345',
    status: 'approved', riskScore: 15, fraudFlagged: false, slaDue: '2d 12h', slaStatus: 'ok',
    assignedTo: 'Rajesh Kumar', workshop: 'QuickFix Mumbai', aiEstimate: 28000, invoiceAmount: 0,
    claimAmount: 27500, incidentDate: '2024-02-14', createdAt: '2024-02-14', region: 'West',
    requiredAction: 'Workshop assignment confirmed — Awaiting start', priority: 'low',
    docCompleteness: 100, aiConfidence: 95, type: 'motor',
  },
  {
    id: 'CLM-2024-0897', policyNumber: 'POL-GJ-19283', claimantName: 'Chirag Patel', vehicle: 'Kia Seltos GJ-01-MN-6789',
    status: 'invoice_uploaded', riskScore: 72, fraudFlagged: true, slaDue: '4h 30m', slaStatus: 'breach',
    assignedTo: 'Priya Sharma', workshop: 'SpeedAuto Ahmedabad', aiEstimate: 95000, invoiceAmount: 141000,
    claimAmount: 138000, incidentDate: '2024-02-08', createdAt: '2024-02-09', region: 'West',
    requiredAction: 'Invoice deviation 48% — Review flagged items', priority: 'critical',
    docCompleteness: 100, aiConfidence: 52, type: 'motor',
  },
  {
    id: 'CLM-2024-0898', policyNumber: 'POL-TN-84721', claimantName: 'Vijaya Lakshmi', vehicle: 'Ford EcoSport TN-09-OP-1234',
    status: 'closed', riskScore: 8, fraudFlagged: false, slaDue: 'Closed', slaStatus: 'ok',
    assignedTo: 'Priya Sharma', workshop: 'AutoCare Coimbatore', aiEstimate: 41000, invoiceAmount: 42500,
    claimAmount: 42000, incidentDate: '2024-02-01', createdAt: '2024-02-02', region: 'South',
    requiredAction: 'NPS survey sent — Awaiting response', priority: 'low',
    docCompleteness: 100, aiConfidence: 93, type: 'motor',
  },
];

export const DASHBOARD_KPIs = {
  ops: {
    totalActive: 847,
    slaBreaches: 23,
    pendingApprovals: 41,
    avgCycleTime: '6.2d',
    throughputToday: 38,
    backlogChange: -12,
  },
  risk: {
    fraudFlagged: 14,
    siuActive: 8,
    highValue: 31,
    totalRisk: '₹2.3Cr',
    avgRiskScore: 34,
    falsePositiveRate: '18%',
  },
  cx: {
    npsScore: 52,
    churnRisk: 17,
    openComplaints: 9,
    avgResponseTime: '3.2h',
    satisfactionRate: '84%',
    surveyResponseRate: '67%',
  },
  finance: {
    leakageDetected: '₹18.4L',
    autoApproved: 156,
    manualApprovals: 41,
    aiSavings: '₹31.2L',
    invoiceDeviations: 12,
    pendingPayouts: '₹4.2Cr',
  },
  ai: {
    estimationAccuracy: '91.4%',
    autoApprovalRate: '62%',
    avgConfidence: 84,
    modelsRunToday: 312,
    costPerClaim: '₹127',
  },
};

export const WORKFLOW_STEPS = [
  { id: 'fnol', label: 'FNOL / Intake', count: 48, color: 'blue' },
  { id: 'docs', label: 'Doc Verification', count: 34, color: 'cyan' },
  { id: 'triage', label: 'Triage & Assign', count: 22, color: 'purple' },
  { id: 'survey', label: 'Survey / Estimate', count: 67, color: 'amber' },
  { id: 'approval', label: 'Approval Gate', count: 41, color: 'orange' },
  { id: 'repair', label: 'In Repair', count: 198, color: 'green' },
  { id: 'invoice', label: 'Invoice Validation', count: 29, color: 'pink' },
  { id: 'closure', label: 'Closure / NPS', count: 408, color: 'slate' },
];

export const FRAUD_PIPELINE = [
  { stage: 'AI Flagged', count: 47, color: '#ef4444' },
  { stage: 'Under Review', count: 14, color: '#f97316' },
  { stage: 'SIU Active', count: 8, color: '#a855f7' },
  { stage: 'Confirmed Fraud', count: 3, color: '#dc2626' },
  { stage: 'Cleared', count: 22, color: '#22c55e' },
];

export const WORKSHOP_PERFORMANCE = [
  { name: 'AutoFix Bangalore', jobs: 23, onTime: 87, avgCost: 68000, rating: 4.2, deviation: 8, riskScore: 22 },
  { name: 'Premium Motors Chennai', jobs: 18, onTime: 94, avgCost: 82000, rating: 4.6, deviation: 4, riskScore: 11 },
  { name: 'StarAuto Chennai', jobs: 31, onTime: 79, avgCost: 54000, rating: 3.8, deviation: 14, riskScore: 38 },
  { name: 'Prestige BMW Delhi', jobs: 12, onTime: 100, avgCost: 210000, rating: 4.8, deviation: 2, riskScore: 8 },
  { name: 'SpeedAuto Ahmedabad', jobs: 27, onTime: 67, avgCost: 71000, rating: 3.2, deviation: 22, riskScore: 61 },
  { name: 'QuickFix Mumbai', jobs: 44, onTime: 91, avgCost: 45000, rating: 4.4, deviation: 6, riskScore: 15 },
];
