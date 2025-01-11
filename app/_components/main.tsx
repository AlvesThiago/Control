'use client'

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Main(){
    return(
        <div className='flex items-center justify-center min-h-screen bg-[url("/fundoMain.svg")] bg-cover bg-center'>
            <Card className="w-[800px] flex flex-col justify-center">
                <CardHeader className="mt-10">
                    <CardTitle className="text-center text-3xl mb-2">Controle de Notebook</CardTitle>
                    <CardDescription className="text-center">Rápido e fácil.</CardDescription>
                </CardHeader>
                <CardContent className="mb-20">
                    <form>
                        <div className="grid w-full items-center gap-4 ">
                            <div className="flex flex-col space-y-1.5 ">
                                <Label htmlFor="name" className="font-bold">Crácha</Label>
                                <Input id="name" placeholder="Encoste o seu crácha"/>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name" className="font-bold">Notebook</Label>
                                <Input id="name" placeholder="Bipe o QRcode" />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button>Verificar</Button>
                </CardFooter>
            </Card>
        </div>
    );
}

