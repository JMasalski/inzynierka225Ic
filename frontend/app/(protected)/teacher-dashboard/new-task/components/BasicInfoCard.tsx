import React from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";

interface BasicInfoCardProps {
    title: string;
    description: string;
    onTitleChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
}

const BasicInfoCard = ({
                           title,
                           description,
                           onTitleChange,
                           onDescriptionChange
                       } : BasicInfoCardProps) => {

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
            </CardContent>
        </Card>
    );
};

export default BasicInfoCard
