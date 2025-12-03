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

interface UploadedFile {
    name: string;
    type: string;
    size: number;
    progress: number;
    status: "uploading" | "completed" | "error";
}

const LoanDocumentUpload: React.FC = () => {
    const { loanId } = useParams<{ loanId: string }>();
    const navigate = useNavigate();
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    // Required documents list
    const requiredDocs = [
        "Government Issued Identity (Passport/Driver's License)",
        "Credit Score Report",
        "Paystub (Last 3 months)",
        "Bank Statement (Last 6 months)",
    ];

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const newFiles = Array.from(event.target.files).map((file) => ({
                name: file.name,
                type: file.type,
                size: file.size,
                progress: 0,
                status: "uploading" as const,
            }));

            setFiles((prev) => [...prev, ...newFiles]);
            simulateUpload(newFiles);
        }
    };

    const simulateUpload = (newFiles: UploadedFile[]) => {
        setIsUploading(true);

        newFiles.forEach((file, index) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;

                setFiles((prevFiles) =>
                    prevFiles.map((f) =>
                        f.name === file.name ? { ...f, progress: Math.min(progress, 100) } : f
                    )
                );

                if (progress >= 100) {
                    clearInterval(interval);
                    setFiles((prevFiles) =>
                        prevFiles.map((f) =>
                            f.name === file.name ? { ...f, status: "completed" } : f
                        )
                    );
                    setIsUploading(false);
                }
            }, 300);
        });
    };

    const handleDelete = (fileName: string) => {
        setFiles((prev) => prev.filter((f) => f.name !== fileName));
    };

    const handleFinish = () => {
        alert("Documents uploaded successfully! Your application is now under review.");
        navigate("/home/loan-application");
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
                    Application ID: <strong>#{loanId}</strong>
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
                                    ) : (
                                        <FileText color="#64748b" size={24} />
                                    )}
                                </ListItemIcon>
                                <ListItemText
                                    primary={file.name}
                                    secondary={
                                        <div className="file-progress-container">
                                            {file.status === "uploading" && (
                                                <LinearProgress variant="determinate" value={file.progress} sx={{ mt: 1 }} />
                                            )}
                                            {file.status === "completed" && (
                                                <span className="upload-complete-text">
                                                    Upload Complete
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
        </div>
    );
};

export default LoanDocumentUpload;
