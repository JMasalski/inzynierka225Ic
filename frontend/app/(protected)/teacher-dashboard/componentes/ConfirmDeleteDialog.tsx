import React from 'react';
import { GridRowId } from "@mui/x-data-grid"; // Importujemy typ ID z MUI
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";

interface ConfirmDeleteDialogProps {
    title: string;
    description: string;
    onConfirmDelete: (ids: GridRowId[]) => void;
    idsToDelete: GridRowId | GridRowId[];
    triggerLabel?: string;
}


const ConfirmDeleteDialog = (
    { title, description, onConfirmDelete, idsToDelete,triggerLabel}:ConfirmDeleteDialogProps
) => {
    const idsArray = Array.isArray(idsToDelete) ? idsToDelete : [idsToDelete];

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"ghost"}>
                    {!triggerLabel ? (
                        <TrashIcon className="h-4 w-4" />
                    ) : (
                        triggerLabel
                    )}
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md md:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => onConfirmDelete(idsArray)}
                            className="flex-1 sm:flex-1"
                        >
                            Usuń
                        </Button>
                    </DialogClose>

                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant="secondary"
                            className="flex-1 sm:flex-1"
                        >
                            Anuluj
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default ConfirmDeleteDialog;