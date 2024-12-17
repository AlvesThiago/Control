import { Button } from "@/components/ui/button";
import DataTableDemo from "@/app/components/tabelaUser";
import RegisterUser from "@/app/components/registerUser";

export default function AddUserPage() {
    return (
        <>
            <div className="mx-auto h-24 w-full max-w-3xl rounded-xl bg-muted/50 ">
                <div className="flex justify-around items-center p-6">
                    <h2>IS Admin</h2>
                    <div className="flex gap-2">
                        <Button>Add User</Button>
                        <Button>Listar Users</Button>
                    </div>
                </div>
            </div>
            <div className="mx-auto h-[470px] w-full max-w-3xl rounded-xl bg-muted/50">
                <div className="flex flex-col items-center justify-center p-6">
                    <DataTableDemo/>
                </div>
            </div>

            <RegisterUser/>
        </>
    );
  }
  