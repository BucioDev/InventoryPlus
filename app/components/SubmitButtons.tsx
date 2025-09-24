"use client"
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";


interface SubmitButtonProps {
    text: string;
}

export function SubmitButton({text}:SubmitButtonProps){
    const { pending} = useFormStatus();

    return(
        <>
        {pending ? (
            <Button disabled >
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Por favor espere...
            </Button>
        ):(
            <Button type="submit" variant="default">
                {text}
            </Button>
        )}
        </>
    )
}



export function DeleteButton({text}:SubmitButtonProps){
    const { pending} = useFormStatus();

    return(
        <>
        {pending ? (
            <Button disabled >
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Eliminando por favor espere...
            </Button>
        ):(
            <Button type="submit" variant="destructive">
                {text}
            </Button>
        )}
        </>
    )
}