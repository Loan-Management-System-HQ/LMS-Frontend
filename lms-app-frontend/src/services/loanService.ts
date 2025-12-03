import apiClient from './apiClient';
import API_CONFIG from '../config/apiConfig';

export interface LoanApplication {
    amount: number;
    duration: number;
    interest_rate: number;
    purpose?: string;
    remarks?: string;
}

export interface Loan {
    id: number;
    loan_id: string;
    amount: number;
    term_months: number;
    interest_rate: number;
    status: string;
    created_at: string;
    remaining_amount: number;
}

export interface Installment {
    id: number;
    installment_number: number;
    due_date: string;
    amount_due: number;
    amount_paid: number;
    status: string;
    paid_date?: string;
}

export const loanService = {
    // Get all loans for current user
    getLoans: async () => {
        const response = await apiClient.get<Loan[]>(API_CONFIG.ENDPOINTS.LOANS.LOANS);
        return response.data;
    },

    // Get specific loan details
    getLoanById: async (id: string) => {
        const response = await apiClient.get<Loan>(`${API_CONFIG.ENDPOINTS.LOANS.LOANS}${id}/`);
        return response.data;
    },

    // Get installments for a loan
    getInstallments: async (loanId: string) => {
        const response = await apiClient.get<Installment[]>(`${API_CONFIG.ENDPOINTS.LOANS.LOANS}${loanId}/installments/`);
        return response.data;
    },

    // Apply for a new loan
    applyForLoan: async (applicationData: LoanApplication) => {
        const response = await apiClient.post(API_CONFIG.ENDPOINTS.LOANS.APPLICATIONS, applicationData);
        return response.data;
    },

    // Get loan applications
    getApplications: async () => {
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.LOANS.APPLICATIONS);
        return response.data;
    },

    // Calculate loan details (simulation)
    calculateLoan: async (amount: number, term: number) => {
        const response = await apiClient.post(API_CONFIG.ENDPOINTS.LOANS.CALCULATOR, {
            amount,
            term_months: term
        });
        return response.data;
    },

    // Get dashboard statistics
    getDashboardStats: async () => {
        const response = await apiClient.get(API_CONFIG.ENDPOINTS.LOANS.DASHBOARD);
        return response.data;
    }
};

export default loanService;
