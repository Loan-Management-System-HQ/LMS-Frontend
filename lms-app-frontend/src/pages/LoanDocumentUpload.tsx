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
    id: string;
    name: string;
    type: string;
    size: number;
    progress: number;
    status: "uploading" | "completed" | "error";
    file: File;
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
        "Bank Statement (Last 6 months)",
    ];

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const newFiles = Array.from(event.target.files).map((file) => ({
                id: Math.random().toString(36).substr(2, 9),
                name: file.name,
                type: file.type,
                size: file.size,
                progress: 0,
                status: "uploading" as const,
                file: file // Store the actual file object
            }));

            setFiles((prev) => [...prev, ...newFiles]);

            // Upload each file
            newFiles.forEach(fileWrapper => {
                uploadFile(fileWrapper);
            });
        }
    };

    const uploadFile = (fileWrapper: UploadedFile) => {
        const formData = new FormData();
        formData.append("file", fileWrapper.file);
        formData.append("loanId", loanId || "unknown");

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:3001/upload");

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const progress = Math.round((event.loaded / event.total) * 100);
                setFiles((prevFiles) =>
                    prevFiles.map((f) =>
                        f.id === fileWrapper.id ? { ...f, progress } : f
                    )
                );
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                setFiles((prevFiles) =>
                    prevFiles.map((f) =>
                        f.id === fileWrapper.id ? { ...f, status: "completed", progress: 100 } : f
                    )
                );
            } else {
                setFiles((prevFiles) =>
                    prevFiles.map((f) =>
                        f.id === fileWrapper.id ? { ...f, status: "error" } : f
                    )
                );
            }
        };

        xhr.onerror = () => {
            setFiles((prevFiles) =>
                prevFiles.map((f) =>
                    f.id === fileWrapper.id ? { ...f, status: "error" } : f
                )
            );
        };

        xhr.send(formData);
    };
    const handleDelete = (id: string) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
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
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(file.id)}>
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
                                            {file.status === "error" && (
                                                <span className="upload-error-text" style={{ color: 'red' }}>
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
        </div>
    );
};

export default LoanDocumentUpload;
