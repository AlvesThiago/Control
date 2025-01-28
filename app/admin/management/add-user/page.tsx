'use client'
import { Button } from "@/components/ui/button";
import RegisterUser from "@/app/_components/registerUser";
import Link from "next/link";

export default function AddUserPage() {

    return (
        <>
            <div className="container mx-auto px-6 border-b">
                <div className="flex justify-around items-center p-6">
                    <h2 className="text-3xl font-light">Control</h2>
                    <div className="flex gap-2">
                        <Link href={'/admin/management/add-user/list-user'}>
                            <Button >Listar usuários</Button>
                        </Link>
                    </div>
                </div>
            </div>
            <RegisterUser />

        </>
    );
}
