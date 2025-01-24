import GestoresPage from '@/app/_components/gestores'
import React from 'react'

function Page() {
  return (

    <>
      <div className="container mx-auto px-6 border-b">
        <div className="flex justify-around items-center p-6">
          <h2 className="text-3xl font-light">Control</h2>
          <div className="flex gap-2">
          </div>
        </div>
      </div>

      <GestoresPage />
    </>

  )
}

export default Page