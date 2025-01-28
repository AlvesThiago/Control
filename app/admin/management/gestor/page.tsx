import GestoresPage from '@/app/_components/gestores'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

function Page() {
  return (

    <>
      <div className="container mx-auto px-6 border-b">
        <div className="flex justify-around items-center p-6">
          <h2 className="text-3xl font-light">Control</h2>
          <div className="flex gap-2">
            <Link href={'/admin/management/gestor/list-gestores'}>
              <Button >Listar Notebooks</Button>
            </Link>
          </div>
        </div>
      </div>
      <GestoresPage />
    </>

  )
}

export default Page