import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {axiosInstance} from "@/lib/axiosInstance";
import {useGroupStore} from "@/store/useGroupStore";

type AddGroupDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

/**
 * Render a modal dialog that collects a new group name and invokes group creation when saved.
 *
 * @param open - Whether the dialog is visible.
 * @param onOpenChange - Callback invoked with the new open state when the dialog is opened or closed.
 * @returns The rendered dialog element.
 */
export function AddGroupDialog({ open, onOpenChange }: AddGroupDialogProps) {
    const [groupName, setGroupName] = useState("");
    const {createGroup} = useGroupStore()
    const handleSubmit = async () => {
        if (!groupName.trim()) return;

        await createGroup({ name: groupName });

        setGroupName("");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Dodaj nową grupę</DialogTitle>
                </DialogHeader>

                <div className="space-y-2">
                    <Label htmlFor="groupName">Nazwa grupy</Label>
                    <Input
                        id="groupName"
                        placeholder="np. Grupa A"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Anuluj
                    </Button>
                    <Button onClick={handleSubmit} disabled={!groupName.trim()}>
                        Zapisz
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}