"use client";

import React from "react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

export function CustomToaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {/* Enveloppe les toasts et le viewport dans un React.Fragment pour s'assurer que ToastProvider reçoit un seul enfant */}
      <React.Fragment>
        {toasts.map(function ({ id, title, description, action, ...props }) {
          return (
            <Toast key={id} {...props}>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              {action}
              <ToastClose />
            </Toast>
          );
        })}
        <ToastViewport />
      </React.Fragment>
    </ToastProvider>
  );
}