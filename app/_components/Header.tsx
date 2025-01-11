import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

function Header() {
  return (
    <div className="p-4 shadow-md bg-[#001220]">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-white">Controle de Equipamentos</h2>
        <Link href={'/admin/login'}>
            <Button variant={'outline'}>
                Entrar
            </Button>
        </Link>
      </div>
    </div>
  )
}

export default Header
