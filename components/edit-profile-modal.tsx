"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, X, Check } from "lucide-react";
import Image from "next/image";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    id: string | number;
    name: string;
    profileImage?: string;
  };
  onSave: (data: { name: string; profileImage?: File }) => Promise<void>;
}

export function EditProfileModal({
  isOpen,
  onClose,
  currentUser,
  onSave,
}: EditProfileModalProps) {
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName(currentUser.name || "");
      setProfileImagePreview(currentUser.profileImage || null);
      setProfileImage(null);
      setError("");
      setSuccess(false);
    }
  }, [isOpen, currentUser]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  // Handle file validation and preview
  const handleFile = (file?: File) => {
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image too large. Please select an image under 5MB.");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setError("");
    setProfileImage(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Clear image selection
  const handleClearImage = () => {
    setProfileImage(null);
    setProfileImagePreview(currentUser.profileImage || null);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      await onSave({
        name: name.trim(),
        ...(profileImage && { profileImage }),
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-black/90 border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="profileImage" className="text-white/70">
              Profile Image
            </Label>

            <div
              className={`relative flex flex-col items-center justify-center h-48 rounded-md border-2 border-dashed transition-all ${
                dragActive
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-white/20 hover:border-white/40"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {profileImagePreview ? (
                <div className="relative">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden">
                    <Image
                      src={profileImagePreview}
                      alt="Profile preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white shadow-sm hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-white/40 mb-2" />
                  <p className="text-sm text-white/60">
                    Drag & drop an image or click to browse
                  </p>
                </>
              )}

              <input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            <p className="text-xs text-white/50">
              Recommended: Square image, 500x500px or larger
            </p>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white/70">
              Display Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your display name"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-blue-500"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-sm text-red-400">{error}</p>}

          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 text-sm text-green-400">
              <Check className="h-4 w-4" />
              Profile updated successfully!
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="bg-transparent text-white border-white/20 hover:bg-white/10 hover:border-white/30"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || success}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : success ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Saved
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
