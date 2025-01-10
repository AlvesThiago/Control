'use client'
import RegisterNote from "@/app/_components/registerNote";
import DataTableNote from "@/app/_components/tabelaNote";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function AddNotebookPage() {

    const [showRegister, setShowRegister] = useState(true);
    return (
        <>
        <div className="mx-auto h-24 w-full max-w-3xl rounded-xl bg-muted/50 ">
            <div className="flex justify-around items-center p-6">
                <h2 className="text-3xl font-bold">IS Admin</h2>
                <div className="flex gap-2">
                    <Button onClick={() => setShowRegister(true)}>Add User</Button>
                    <Button onClick={() => setShowRegister(false)}>Listar Users</Button>
                </div>
            </div>
        </div>

        {showRegister? (
            <RegisterNote/>
        ) : (
            <div className="mx-auto h-[470px] w-full max-w-3xl rounded-xl bg-muted/50">
                <div className="flex flex-col items-center justify-center p-6">
                    <DataTableNote/>
                </div>
            </div>
        )}

    </>
    );
  }
  