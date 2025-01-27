import DataTableNote from '@/app/_components/tabelaNote'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function ListNotebook() {
    return (
        <>
            <div className="mx-auto w-full">
                <div className="flex justify-between items-center p-6">
                    <div className="flex gap-2">
                        <Link href={'/admin/management/add-notebook'}>
                            <Button><ArrowLeft /> Voltar</Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mx-auto h-[650px] w-full rounded-xl bg-muted/50">
                <div className="flex flex-col items-center justify-center p-6">
                    <DataTableNote />
                </div>
            </div>
        </>

    )
}

export default ListNotebook