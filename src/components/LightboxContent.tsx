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
      "top-0 left-0 right-0 bottom-0 translate-x-0 translate-y-0", // Explicitly override default dialog positioning and transform
      "data-[state=open]:animate-in data-[state=closed]:animate-out", // Keep animations
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
      // Removed slide animations as they might conflict with full-screen positioning
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