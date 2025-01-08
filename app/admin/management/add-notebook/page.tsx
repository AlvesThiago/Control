import RegisterNote from "@/app/_components/registerNote";
import { Button } from "@/components/ui/button";

export default function AddNotebookPage() {
    return (
      <>
            <div className="mx-auto h-24 w-full max-w-3xl rounded-xl bg-muted/50">
                <div className="flex justify-around items-center p-6">
                    <h2>IS Admin</h2>
                    <div className="flex gap-2">
                        <Button>Add notebook</Button>
                        <Button>Listar</Button>
                    </div>
                </div>
            </div>
            
            <RegisterNote />
      </>
    );
  }
  