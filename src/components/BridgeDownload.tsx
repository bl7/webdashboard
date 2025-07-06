"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BridgeDownloadProps {
  platform: "mac" | "windows";
  className?: string;
}

export default function BridgeDownload({ platform, className = "" }: BridgeDownloadProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmDownload = async () => {
    setIsDownloading(true);
    setShowConfirmDialog(false);
    
    try {
      const fileId = "1Ra8hrl--GOUjg6jUO7GP59gx62-V_MfK";
      const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", "");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Simulate download time for better UX
      setTimeout(() => {
        setIsDownloading(false);
      }, 2000);
    } catch (error) {
      console.error("Download failed:", error);
      setIsDownloading(false);
    }
  };

  const platformInfo = {
    mac: {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      ),
      label: "Download for Mac",
      className: "bg-gray-900 text-white hover:bg-gray-800"
    },
    windows: {
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 3.545L9.818 2.182v9.818H0V3.545zm9.818 9.818L0 12.455v8.182h9.818V13.363zm11.182-9.818L11.182 2.182v9.818h9.818V3.545zm-9.818 9.818L11.182 12.455v8.182h9.818V13.363z"/>
        </svg>
      ),
      label: "Download for Windows", 
      className: "bg-purple-600 text-white hover:bg-purple-700"
    }
  };

  const info = platformInfo[platform];

  return (
    <>
      <Button 
        onClick={handleDownloadClick}
        disabled={isDownloading}
        className={`inline-flex items-center gap-2 px-6 py-3 font-semibold transition-colors ${info.className} ${className}`}
      >
        {isDownloading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Downloading...
          </>
        ) : (
          <>
            <span role="img" aria-label={platform === "mac" ? "Mac" : "Windows"}>
              {info.icon}
            </span>
            {info.label}
          </>
        )}
      </Button>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Download</DialogTitle>
            <DialogDescription>
              You're about to download the InstaLabel Print Server for {platform === "mac" ? "macOS" : "Windows"}. 
              This will start the download immediately. Do you want to continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmDownload}>
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 