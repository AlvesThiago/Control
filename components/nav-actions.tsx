"use client"

import * as React from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function NavActions() {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Link href={'/'}>
        <Button variant={"outline"}>
          <ArrowRight />
          Sair
        </Button>
      </Link>
    </div>
  )
}
