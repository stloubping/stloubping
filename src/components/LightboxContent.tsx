"use client";

import React from 'react';
import { DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface LightboxContentProps extends React.ComponentPropsWithoutRef<typeof DialogContent> {
  children: React.ReactNode;
}

const LightboxContent = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  LightboxContentProps
>(({ className, children, ...props }, ref) => (
  <DialogContent
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 flex items-center justify-center bg-black/80 cursor-zoom-out",
      "w-screen h-screen max-w-none p-0 border-none", // Ensure full screen and no default padding/border
      "data-[state=open]:animate-in data-[state=closed]:animate-out", // Keep animations
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]", // Override default slide-out
      "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]", // Override default slide-in
      "sm:max-w-none sm:rounded-none", // Override default max-width and rounded corners for small screens
      className
    )}
    {...props}
  >
    {children}
  </DialogContent>
));
LightboxContent.displayName = DialogContent.displayName;

export default LightboxContent;