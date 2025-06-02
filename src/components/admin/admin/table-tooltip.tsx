import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function TableTooltip({triggerText, children}: {
  triggerText: string,
  children: React.ReactNode
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{triggerText}</span>
        </TooltipTrigger>
        <TooltipContent>
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
