import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function RegisterNote(){
    return(
        <div className="mx-auto h-[325px] w-full max-w-3xl rounded-xl bg-muted/50">
                <div className="flex flex-col items-center justify-center p-6">
                    <Card className="w-[580px] ">
                        <CardHeader>
                            <CardTitle className="text-2xl mb-6">Cadastro</CardTitle>
                        </CardHeader>
                        <CardContent className="mb-6">
                            <form>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="numbernote">Notebook</Label>
                                        <Input type="number" id="numbernote" placeholder="S/N" />
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button>Cadastrar Notebook</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
    )
}

export default RegisterNote;