import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Checkbox} from "@/components/ui/checkbox";
import {useGroupStore} from "@/store/useGroupStore";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";

interface BasicInfoCardProps {
    title: string;
    description: string;
    isActive: boolean;
    groupIds: string[];
    onTitleChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onIsActiveChange: (value: boolean) => void;
    onGroupIdsChange: (value: string[]) => void;
}

const BasicInfoCard = ({
                           title,
                           description,
                           isActive,
                           groupIds,
                           onTitleChange,
                           onDescriptionChange,
                           onIsActiveChange,
                           onGroupIdsChange
                       }: BasicInfoCardProps) => {


    const {groups, fetchGroupesToTable} = useGroupStore()
    const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>(groupIds);

    useEffect(() => {
        fetchGroupesToTable({page: 0, pageSize: 1000})
    }, []);

    useEffect(() => {
        setSelectedGroupIds(groupIds);
    }, [groupIds]);

    const toggleGroup = (groupId: string) => {
        setSelectedGroupIds(prev =>
            prev.includes(groupId)
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-bold">
                    Podstawowe informacje
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-8">
                <div className="grid w-full items-center gap-3">
                    <Label htmlFor="title">Tytuł zadania</Label>
                    <Input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        placeholder="np. Dodawanie dwóch liczb"
                    />
                </div>
                <div className="grid w-full items-center gap-3">
                    <Label htmlFor="description">Opis zadania</Label>
                    <Textarea
                        id="description"
                        placeholder="Napisz funkcję która…"
                        value={description}
                        onChange={(e) => onDescriptionChange(e.target.value)}
                    />
                </div>
                <div className="flex justify-between items-center gap-3">
                    <div className="flex items-center gap-3">
                        <Checkbox
                            id="isTaskActive"
                            checked={isActive}
                            onCheckedChange={onIsActiveChange}
                        />
                        <Label htmlFor="isTaskActive">Czy chcesz aby zadanie było odrazu widoczne?</Label>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                Przydziel grupy ({selectedGroupIds.length})
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Przydziel grupy</DialogTitle>
                                <DialogDescription>
                                    Zaznacz grupy, którym chcesz przypisać to zadanie.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="max-h-[300px] overflow-y-auto border rounded-lg divide-y">
                                {groups.length === 0 ? (
                                    <div className="p-4 text-sm text-muted-foreground text-center">
                                        Brak dostępnych grup
                                    </div>
                                ) : (
                                    groups.map((group) => (
                                        <div
                                            key={group.id}
                                            className="flex items-center gap-3 p-3 hover:bg-muted/40 cursor-pointer"
                                            onClick={() =>  toggleGroup(group.id)}
                                        >
                                            <Checkbox
                                                checked={selectedGroupIds.includes(group.id)}
                                            />
                                            <span className="font-medium">{group.name}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                            <DialogFooter>
                                <Button variant={"destructive"} onClick={()=>setSelectedGroupIds([])}>
                                    Odznacz wszystkich
                                </Button>
                                <DialogClose asChild>
                                    <Button
                                        onClick={() => onGroupIdsChange(selectedGroupIds)}>
                                        Zapisz ({selectedGroupIds.length})
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    );
};

export default BasicInfoCard
