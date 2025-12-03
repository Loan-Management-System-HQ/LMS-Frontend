import apiClient from './apiClient';
import API_CONFIG from '../config/apiConfig';

export interface Document {
    id: number;
    document_type: string;
    file: string;
    uploaded_at: string;
    status: string;
    notes?: string;
}

export const documentService = {
    // Upload a new document
    uploadDocument: async (file: File, type: string, notes?: string, loanApplicationId?: string) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('document_type', type);
        if (notes) {
            formData.append('notes', notes);
        }
        if (loanApplicationId) {
            formData.append('loan_application_id', loanApplicationId);
        }

        const response = await apiClient.post(API_CONFIG.ENDPOINTS.DOCUMENTS.UPLOAD, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Get current user's documents
    getMyDocuments: async () => {
        const response = await apiClient.get<Document[]>(API_CONFIG.ENDPOINTS.DOCUMENTS.MY_DOCUMENTS);
        return response.data;
    },

    // Get document by ID
    getDocumentById: async (id: string) => {
        const response = await apiClient.get<Document>(`${API_CONFIG.ENDPOINTS.DOCUMENTS.BASE}${id}/`);
        return response.data;
    },

    // Delete a document
    deleteDocument: async (id: string) => {
        await apiClient.delete(`${API_CONFIG.ENDPOINTS.DOCUMENTS.BASE}${id}/`);
    }
};

export default documentService;
