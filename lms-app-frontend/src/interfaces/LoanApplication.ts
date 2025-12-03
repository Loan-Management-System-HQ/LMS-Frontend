export interface LoanApplication {
    id: string;
    applicantName: string;
    amount: number;
    date: string;
    status: 'Draft' | 'Pending' | 'Approved' | 'Denied';
    email: string;
}
