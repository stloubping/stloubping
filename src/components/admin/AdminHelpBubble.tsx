import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type AdminHelpBubbleProps = {
  label: string;
  text: string;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
};

const AdminHelpBubble = ({ label, text, className, side = "top" }: AdminHelpBubbleProps) => (
  <Tooltip delayDuration={100}>
    <TooltipTrigger asChild>
      <button
        type="button"
        aria-label={`Aide : ${label}`}
        className={cn(
          "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-clubPrimary/25 bg-clubPrimary/10 text-clubPrimary transition hover:bg-clubPrimary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clubPrimary focus-visible:ring-offset-2",
          className,
        )}
      >
        <Info className="h-4 w-4" />
      </button>
    </TooltipTrigger>
    <TooltipContent side={side} className="max-w-xs px-4 py-3 text-sm leading-relaxed shadow-xl">
      {text}
    </TooltipContent>
  </Tooltip>
);

export default AdminHelpBubble;
