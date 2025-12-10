import React from 'react';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Code, Plus, Trash2} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";

interface FunctionSignatureCardProps {
    functionSignature: {
        name: string;
        params: any[];
        return_type: string;
        return_element_type: string | null;
    };
    onSignatureChange: (signature: any) => void;
    onGenerateTemplates: () => void;
}

const FunctionSignatureCard = ({
                                   functionSignature,
                                   onSignatureChange,
                                   onGenerateTemplates
                               }: FunctionSignatureCardProps) => {
    const addParameter = () => {
        onSignatureChange({
            ...functionSignature,
            params: [...functionSignature.params, {name: '', type: 'int', allowSpaces: false}]
        });
    };

    const updateParameter = (index: number, field: string, value: string | boolean) => {
        const newParams = [...functionSignature.params];
        newParams[index] = {...newParams[index], [field]: value};
        onSignatureChange({...functionSignature, params: newParams});
    };

    const removeParameter = (index: number) => {
        const newParams = functionSignature.params.filter((_, i) => i !== index);
        onSignatureChange({...functionSignature, params: newParams});
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-bold">Sygnatura funkcji</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                        Nazwa funkcji *
                    </Label>
                    <Input
                        type="text"
                        value={functionSignature.name}
                        onChange={(e) => onSignatureChange({...functionSignature, name: e.target.value})}
                        placeholder="np. add"
                    />
                </div>

                <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">
                        Typ zwracany
                    </Label>
                    <Select
                        value={functionSignature.return_type}
                        onValueChange={(value) =>
                            onSignatureChange({
                                ...functionSignature,
                                return_type: value,
                                return_element_type: value === "array" ? "int" : null,
                            })
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="void"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="void">void</SelectItem>
                                <SelectItem value="int">int</SelectItem>
                                <SelectItem value="float">float</SelectItem>
                                <SelectItem value="string">string</SelectItem>
                                <SelectItem value="double">double</SelectItem>
                                <SelectItem value="array">array</SelectItem>
                                <SelectItem value="bool">bool</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {functionSignature.return_type === 'array' && (
                        <div className="mt-2">
                            <Label className="block text-xs font-medium text-gray-600 mb-1">
                                Typ elementów tablicy
                            </Label>
                            <Select
                                value={functionSignature.return_element_type || "int"}
                                onValueChange={(value) =>
                                    onSignatureChange({
                                        ...functionSignature,
                                        return_element_type: value,
                                    })
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="int[]"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="int">int[]</SelectItem>
                                        <SelectItem value="float">float[]</SelectItem>
                                        <SelectItem value="double">double[]</SelectItem>
                                        <SelectItem value="string">string[]</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {functionSignature.return_type === 'void' && (
                        <p className="text-md text-gray-500 mt-1">
                            💡 Funkcja nic nie zwraca - modyfikuje dane przez referencję
                        </p>
                    )}
                </div>

                <div className="col-span-2">
                    <Label className="block text-md font-medium text-gray-700 mb-1">
                        Parametry funkcji
                    </Label>
                    {functionSignature.params.map((param, i) => (
                        <div key={i} className="flex gap-2 mb-5">
                            <Input
                                type="text"
                                value={param.name}
                                onChange={(e) => updateParameter(i, "name", e.target.value)}
                                placeholder="Nazwa parametru"
                            />

                            <Select
                                value={param.type}
                                onValueChange={(value) => updateParameter(i, "type", value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="int"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="int">int</SelectItem>
                                        <SelectItem value="float">float</SelectItem>
                                        <SelectItem value="string">string</SelectItem>
                                        <SelectItem value="double">double</SelectItem>
                                        <SelectItem value="array">array</SelectItem>
                                        <SelectItem value="bool">bool</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            {param.type === "array" && (
                                <>
                                    <Select
                                        value={param.element_type || 'int'}
                                        onValueChange={(value) => updateParameter(i, "element_type", value)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="int[]"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectItem value="int">int[]</SelectItem>
                                                <SelectItem value="float">float[]</SelectItem>
                                                <SelectItem value="double">double[]</SelectItem>
                                                <SelectItem value="string">string[]</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                    <Input
                                        type="text"
                                        value={param.size_param || ''}
                                        onChange={(e) => updateParameter(i, 'size_param', e.target.value)}
                                        className="w-24 px-3 py-2 border border-gray-300 rounded-md bg-blue-50"
                                        placeholder="size (n)"
                                        title="Nazwa parametru z rozmiarem"
                                    />
                                </>
                            )}

                            {param.type === 'string' && (
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id={`terms-${i}`}
                                        onCheckedChange={(value) => updateParameter(i, 'allowSpaces', value)}
                                        checked={param.allowSpaces || false}
                                    />
                                    <Label htmlFor={`terms-${i}`}>Spacje</Label>
                                </div>
                            )}

                            <Button
                                onClick={() => removeParameter(i)}
                                variant="ghost"
                                className="p-2 text-red-600 hover:bg-red-50"
                            >
                                <Trash2 size={20}/>
                            </Button>
                        </div>
                    ))}
                    <Button
                        onClick={addParameter}
                        className="text-blue-600 hover:bg-blue-50"
                        variant='ghost'
                    >
                        <Plus size={20}/>
                        Dodaj parametr
                    </Button>
                </div>
            </CardContent>

            <CardFooter>
                <Button onClick={onGenerateTemplates}>
                    <Code/>
                    Generuj szablony kodu
                </Button>
            </CardFooter>
        </Card>
    );
};

export default FunctionSignatureCard;