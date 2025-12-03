import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    Alert,
    LinearProgress,
} from "@mui/material";
import { CloudUpload, Delete, CheckCircle, FileText } from "lucide-react";
import "./LoanDocumentUpload.css";
import AlertBox from "../components/AlertBox";
import { documentService } from "../services/documentService";

interface UploadedFile {
    name: string;
    type: string;
    size: number;
    progress: number;
    status: "uploading" | "completed" | "error";
    error?: string;
}

const LoanDocumentUpload: React.FC = () => {
    const { loanId } = useParams<{ loanId: string }>();
    const navigate = useNavigate();
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    // Alert state
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertSeverity, setAlertSeverity] = useState<"success" | "error" | "warning" | "info">("success");

    // Required documents list
    const requiredDocs = [
        "Government Issued Identity (Passport/Driver's License)",
        "Credit Score Report",
        "Paystub (Last 3 months)",
        "Bank Statement (Last 6 months)",
    ];

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const newFiles = Array.from(event.target.files);

            // Add to state first
            const fileObjects: UploadedFile[] = newFiles.map((file) => ({
                name: file.name,
                type: file.type,
                size: file.size,
                progress: 0,
                status: "uploading" as const,
            }));

            setFiles((prev) => [...prev, ...fileObjects]);
            setIsUploading(true);

            // Upload each file
            for (let i = 0; i < newFiles.length; i++) {
                const file = newFiles[i];
                try {
                    // Determine document type based on file name or just use 'OTHER' for now
                    // The backend supports: GOVT_ID, PAYROLL, CREDIT_HISTORY, BANK_STATEMENT, OTHER
                    let docType = "OTHER";
                    const lowerName = file.name.toLowerCase();
                    if (lowerName.includes("passport") || lowerName.includes("license") || lowerName.includes("id")) docType = "GOVT_ID";
                    else if (lowerName.includes("paystub") || lowerName.includes("salary")) docType = "PAYROLL";
                    else if (lowerName.includes("bank") || lowerName.includes("statement")) docType = "BANK_STATEMENT";
                    else if (lowerName.includes("credit") || lowerName.includes("score")) docType = "CREDIT_HISTORY";

                    await documentService.uploadDocument(file, docType, "Uploaded via Loan Application", loanId);

                    setFiles((prev) =>
                        prev.map((f) =>
                            f.name === file.name ? { ...f, status: "completed", progress: 100 } : f
                        )
                    );
                } catch (error: any) {
                    console.error(`Failed to upload ${file.name}`, error);
                    setFiles((prev) =>
                        prev.map((f) =>
                            f.name === file.name ? { ...f, status: "error", error: "Upload failed" } : f
                        )
                    );

                    let errorMsg = `Failed to upload ${file.name}`;
                    if (error.response?.data) {
                        const data = error.response.data;
                        if (typeof data === 'object') {
                            const messages = Object.values(data).flat();
                            if (messages.length > 0) {
                                errorMsg += `: ${messages[0]}`;
                            } else {
                                errorMsg += `: ${JSON.stringify(data)}`;
                            }
                        } else {
                            errorMsg += `: ${String(data)}`;
                        }
                    }

                    setAlertMessage(errorMsg);
                    setAlertSeverity("error");
                    setAlertOpen(true);
                }
            }
            setIsUploading(false);
        }
    };

    const handleDelete = (fileName: string) => {
        // Note: This only removes from UI list. 
        // To delete from server, we'd need the document ID returned from upload.
        // For now, just removing from UI as per original requirement scope.
        setFiles((prev) => prev.filter((f) => f.name !== fileName));
    };

    const handleFinish = () => {
        // Check if any files failed
        if (files.some(f => f.status === "error")) {
            setAlertMessage("Some files failed to upload. Please retry them.");
            setAlertSeverity("error");
            setAlertOpen(true);
            return;
        }

        setAlertMessage("Documents uploaded successfully! Your application is now under review.");
        setAlertSeverity("success");
        setAlertOpen(true);

        // Navigate after a delay to allow user to read the alert
        setTimeout(() => {
            navigate("/home/loan-status");
        }, 3000);
    };

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    return (
        <div className="loan-upload-container">
            <Button
                onClick={() => navigate("/home/loan-application")}
                className="upload-back-btn"
                sx={{ mb: 2 }}
            >
                &larr; Back to Application
            </Button>

            <Paper elevation={3} className="upload-paper">
                <Typography variant="h5" className="upload-title">
                    Upload Documents
                </Typography>
                <Typography variant="subtitle1" className="upload-subtitle">
                    Application ID: <strong>#{loanId ? loanId.substring(0, 8) : 'Unknown'}</strong>
                </Typography>

                <Alert severity="info" className="upload-alert">
                    Please upload the following documents to complete your application:
                    <ul className="upload-list">
                        {requiredDocs.map((doc, i) => (
                            <li key={i}>{doc}</li>
                        ))}
                    </ul>
                </Alert>

                <Box
                    component="label"
                    className="dropzone"
                >
                    <input
                        type="file"
                        multiple
                        hidden
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                    <CloudUpload size={48} color="#64748b" />
                    <Typography variant="h6" className="dropzone-text">
                        Click to Upload Documents
                    </Typography>
                    <Typography variant="body2" className="dropzone-subtext">
                        Supported formats: PDF, JPG, PNG, DOC
                    </Typography>
                </Box>

                {files.length > 0 && (
                    <List className="file-list">
                        {files.map((file, index) => (
                            <ListItem
                                key={index}
                                className="file-item"
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(file.name)}>
                                        <Delete size={20} />
                                    </IconButton>
                                }
                            >
                                <ListItemIcon>
                                    {file.status === "completed" ? (
                                        <CheckCircle color="green" size={24} />
                                    ) : file.status === "error" ? (
                                        <Delete color="red" size={24} />
                                    ) : (
                                        <FileText color="#64748b" size={24} />
                                    )}
                                </ListItemIcon>
                                <ListItemText
                                    primary={file.name}
                                    secondaryTypographyProps={{ component: "div" }}
                                    secondary={
                                        <div className="file-progress-container">
                                            {file.status === "uploading" && (
                                                <LinearProgress variant="indeterminate" sx={{ mt: 1 }} />
                                            )}
                                            {file.status === "completed" && (
                                                <span className="upload-complete-text">
                                                    Upload Complete
                                                </span>
                                            )}
                                            {file.status === "error" && (
                                                <span style={{ color: "red" }}>
                                                    Upload Failed
                                                </span>
                                            )}
                                        </div>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                )}

                <div className="submit-container">
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleFinish}
                        disabled={files.length === 0 || isUploading}
                    >
                        Submit Documents
                    </Button>
                </div>
            </Paper>

            <AlertBox
                open={alertOpen}
                message={alertMessage}
                severity={alertSeverity}
                onClose={handleCloseAlert}
            />
        </div>
    );
};

export default LoanDocumentUpload;
