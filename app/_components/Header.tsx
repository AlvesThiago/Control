import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

function Header() {
  return (
    <div className="p-4 shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Controle de Equipamentos</h2>
        <Link href={'/admin/login'}>
            <Button>
                Entrar
            </Button>
        </Link>
      </div>
    </div>
  )
}

export default Header
