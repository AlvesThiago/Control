'use client'
import { Button } from "@/components/ui/button";
import DataTableDemo from "@/app/_components/tabelaUser";
import RegisterUser from "@/app/_components/registerUser";
import { useState } from "react";

export default function AddUserPage() {

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
                <RegisterUser/>
            ) : (
                <div className="mx-auto h-[470px] w-full max-w-3xl rounded-xl bg-muted/50">
                    <div className="flex flex-col items-center justify-center p-6">
                        <DataTableDemo/>
                    </div>
                </div>
            )}
 
        </>
    );
  }
  