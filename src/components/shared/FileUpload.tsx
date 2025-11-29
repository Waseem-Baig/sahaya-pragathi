import { useState, useCallback } from "react";
import { Upload, X, FileText, Image, File, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizePerFile?: number; // in bytes
  acceptedTypes?: string[];
  existingFiles?: UploadedFile[];
  disabled?: boolean;
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  uploadedAt?: string;
}

interface FileWithProgress {
  id: string;
  file: File;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
  url?: string;
}

const defaultAcceptedTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB default

export function FileUpload({
  onFilesChange,
  maxFiles = 10,
  maxSizePerFile = MAX_FILE_SIZE,
  acceptedTypes = defaultAcceptedTypes,
  existingFiles = [],
  disabled = false,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (file.size > maxSizePerFile) {
        return `File size exceeds ${(maxSizePerFile / (1024 * 1024)).toFixed(
          1
        )}MB limit`;
      }

      if (!acceptedTypes.includes(file.type)) {
        return `File type ${file.type} not supported`;
      }

      return null;
    },
    [maxSizePerFile, acceptedTypes]
  );

  const uploadFile = useCallback(
    async (fileWithProgress: FileWithProgress) => {
      const formData = new FormData();
      formData.append("file", fileWithProgress.file);

      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/upload/single`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = progressEvent.total
                ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                : 0;

              setFiles((prev) =>
                prev.map((f) =>
                  f.id === fileWithProgress.id
                    ? { ...f, progress: percentCompleted }
                    : f
                )
              );
            },
          }
        );

        if (response.data.success) {
          setFiles((prev) => {
            const updated = prev.map((f) =>
              f.id === fileWithProgress.id
                ? {
                    ...f,
                    status: "success" as const,
                    url: response.data.data.url,
                  }
                : f
            );

            // Notify parent with updated files
            const uploadedFileData = updated
              .filter((f) => f.status === "success")
              .map((f) => ({
                name: f.file.name,
                url: f.url || "",
                size: f.file.size,
                type: f.file.type,
              }));
            onFilesChange(uploadedFileData as unknown as File[]);

            return updated;
          });
        }
      } catch (error) {
        console.error("Upload error:", error);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileWithProgress.id
              ? {
                  ...f,
                  status: "error" as const,
                  error: axios.isAxiosError(error)
                    ? error.response?.data?.error || "Upload failed"
                    : "Upload failed",
                }
              : f
          )
        );
      }
    },
    [onFilesChange]
  );

  const handleFiles = useCallback(
    (newFiles: FileList) => {
      const validFiles: FileWithProgress[] = [];
      const newErrors: string[] = [];

      Array.from(newFiles).forEach((file) => {
        const error = validateFile(file);
        if (error) {
          newErrors.push(`${file.name}: ${error}`);
          return;
        }

        if (
          files.length + validFiles.length + existingFiles.length >=
          maxFiles
        ) {
          newErrors.push(`Maximum ${maxFiles} files allowed`);
          return;
        }

        const fileWithProgress: FileWithProgress = {
          id: Math.random().toString(36).substr(2, 9),
          file: file,
          progress: 0,
          status: "uploading",
        };

        validFiles.push(fileWithProgress);
      });

      setErrors(newErrors);

      if (validFiles.length > 0) {
        const updatedFiles = [...files, ...validFiles];
        setFiles(updatedFiles);

        // Upload files to backend
        validFiles.forEach((fileWithProgress) => {
          uploadFile(fileWithProgress);
        });
      }
    },
    [files, existingFiles.length, maxFiles, uploadFile, validateFile]
  );

  const removeFile = useCallback(
    (fileId: string) => {
      setFiles((prev) => {
        const updatedFiles = prev.filter((f) => f.id !== fileId);
        const uploadedFileData = updatedFiles
          .filter((f) => f.status === "success")
          .map((f) => ({
            name: f.file.name,
            url: f.url || "",
            size: f.file.size,
            type: f.file.type,
          }));
        onFilesChange(uploadedFileData as unknown as File[]);
        return updatedFiles;
      });
    },
    [onFilesChange]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="h-4 w-4" />;
    if (type.includes("pdf")) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card
        className={`relative border-2 border-dashed p-6 text-center transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25"
        } ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:border-primary/50"
        }`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() =>
          !disabled && document.getElementById("file-input")?.click()
        }
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
          disabled={disabled}
        />

        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />

        <div className="space-y-2">
          <p className="text-lg font-medium">
            {dragActive ? "Drop files here" : "Upload files"}
          </p>
          <p className="text-sm text-muted-foreground">
            Drag and drop files here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Max {maxFiles} files, {(maxSizePerFile / (1024 * 1024)).toFixed(1)}
            MB each
          </p>
        </div>
      </Card>

      {/* Errors */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* File List */}
      <div className="space-y-3">
        {/* Existing Files */}
        {existingFiles.map((file) => (
          <Card key={file.id} className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getFileIcon(file.type)}
                <div>
                  <div className="font-medium">{file.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                    {file.uploadedAt &&
                      ` • Uploaded ${new Date(
                        file.uploadedAt
                      ).toLocaleDateString()}`}
                  </div>
                </div>
              </div>
              <Badge variant="success">Uploaded</Badge>
            </div>
          </Card>
        ))}

        {/* New Files */}
        {files.map((file) => (
          <Card key={file.id} className="p-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getFileIcon(file.file.type)}
                  <div>
                    <div className="font-medium">{file.file.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatFileSize(file.file.size)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {file.status === "success" && (
                    <Badge variant="success">Uploaded</Badge>
                  )}
                  {file.status === "error" && (
                    <Badge variant="destructive">Error</Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {file.status === "uploading" && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Uploading...</span>
                    <span>{file.progress}%</span>
                  </div>
                  <Progress value={file.progress} className="h-2" />
                </div>
              )}

              {file.status === "error" && file.error && (
                <div className="text-xs text-destructive">{file.error}</div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
