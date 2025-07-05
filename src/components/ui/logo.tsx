import { BriefcaseBusiness } from "lucide-react"

export function Logo() {
  return (

            <div
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <BriefcaseBusiness />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight pl-2">
                <span className="truncate font-medium">Acme</span>
                <span className="truncate text-xs">Enterprise Inc.</span>
              </div>
            </div>
  )
}
