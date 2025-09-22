"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, File, Loader2, CheckCircle } from "lucide-react";

interface TaskSubmissionCardProps {
  onTaskSubmitted?: (taskData: any) => void;
}

export function TaskSubmissionCard({
  onTaskSubmitted,
}: TaskSubmissionCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Auto-fill task name from file name if empty
      if (!taskName) {
        setTaskName(selectedFile.name.split(".")[0]);
      }
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setMessage("Please select a file to upload");
      return;
    }

    if (!taskName.trim()) {
      setMessage("Please enter a task name");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("taskName", taskName);
      formData.append("description", description);

      console.log("[TASK SUBMISSION] Uploading file:", file.name);

      // Upload to the Flask backend
      const response = await fetch("/api/flask/receivedd", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(`Success: File uploaded successfully! ${result.message}`);
        onTaskSubmitted?.({
          taskName,
          description,
          fileName: file.name,
          fileSize: file.size,
        });

        // Clear form on success
        setFile(null);
        setTaskName("");
        setDescription("");

        // Clear file input
        const fileInput = document.getElementById(
          "file-input"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error || "Upload failed"}`);
      }
    } catch (error) {
      console.error("[TASK SUBMISSION] Error:", error);
      setMessage("Failed to upload file. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white/5 backdrop-blur-sm border border-white/10 text-white">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Upload className="h-5 w-5 text-blue-400" />
          Submit Task for Processing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Task Name */}
        <div>
          <label className="text-sm text-white/70 mb-2 block">Task Name</label>
          <Input
            placeholder="Enter task name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm text-white/70 mb-2 block">
            Description (Optional)
          </label>
          <Textarea
            placeholder="Describe what this task will do..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 resize-none h-20"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="text-sm text-white/70 mb-2 block">
            Upload File
          </label>
          <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-white/40 transition-colors">
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".txt,.py,.json,.csv,.zip"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              {file ? (
                <div className="flex items-center justify-center gap-2">
                  <File className="h-6 w-6 text-green-400" />
                  <span className="text-green-400">{file.name}</span>
                  <span className="text-white/60">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              ) : (
                <div>
                  <Upload className="h-8 w-8 text-white/60 mx-auto mb-2" />
                  <p className="text-white/80">Click to select a file</p>
                  <p className="text-xs text-white/50 mt-1">
                    Supports: .txt, .py, .json, .csv, .zip
                  </p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!file || !taskName.trim() || isSubmitting}
          className="w-full bg-purple-400/20 hover:bg-purple-400/30 text-purple-400 border border-purple-400/30 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Submit Task
            </>
          )}
        </Button>

        {/* Message */}
        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.startsWith("Success")
                ? "bg-green-400/20 text-green-400 border border-green-400/30"
                : "bg-red-400/20 text-red-400 border border-red-400/30"
            }`}
          >
            {message}
          </div>
        )}

        {/* Instructions */}
        <div className="text-xs text-white/50 space-y-1">
          <p>
            • Upload your data file to be processed by the distributed system
          </p>
          <p>• File will be split and distributed across available nodes</p>
          <p>• Check the task list below for processing status</p>
        </div>
      </CardContent>
    </Card>
  );
}
