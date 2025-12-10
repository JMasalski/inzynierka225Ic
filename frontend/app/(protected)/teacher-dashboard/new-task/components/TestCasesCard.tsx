import React from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Plus, Trash2} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";

interface TestCasesCardProps {
    testCases: any[];
    functionSignature: {
        params: any[];
        return_type: string;
    };
    onTestCasesChange: (testCases: any[]) => void;
}

const TestCasesCard = ({
                           testCases,
                           functionSignature,
                           onTestCasesChange
                       }: TestCasesCardProps) => {
    
    const addTestCase = () => {
        onTestCasesChange([...testCases, {input: '', expected_output: ''}]);
    };

    const removeTestCase = (index: number) => {
        onTestCasesChange(testCases.filter((_, i) => i !== index));
    };

    const updateTestCase = (index: number, field: string, value: string) => {
        const newTestCases = [...testCases];
        newTestCases[index] = {...newTestCases[index], [field]: value};
        onTestCasesChange(newTestCases);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-bold">Przypadki testowe</CardTitle>
            </CardHeader>
            <CardContent>
                {functionSignature.params.some(p => p.type === 'string') && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800">
                            ⚠️ Dla stringów ze spacjami: każdy parametr w osobnej linii w polu "Input"
                        </p>
                    </div>
                )}

                {functionSignature.params.some(p => p.type === 'array') && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-sm text-blue-800 font-medium mb-1">
                            📋 Format dla tablic jako parametr:
                        </p>
                        <p className="text-sm text-blue-700 mb-2">
                            Pierwsza linia: rozmiar tablicy (n)<br/>
                            Druga linia: elementy oddzielone spacjami<br/>
                            Przykład: <code className="bg-blue-100 px-1 rounded">3\n1 2 3</code>
                        </p>
                        <p className="text-xs text-blue-600 italic">
                            💡 Rozmiar (n) jest potrzebny tylko dla C++. Python i JS automatycznie znają rozmiar tablicy.<br/>
                            💡 Pamiętaj, że w parametrach funkcji w polu rozmiar tablicy podajesz nazwę zmiennej a nie
                            jej rozmiar.
                        </p>
                    </div>
                )}

                {functionSignature.return_type === 'void' && (
                    <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-md">
                        <p className="text-sm text-purple-800 font-medium mb-1">
                            🔧 Funkcja void - Expected Output:
                        </p>
                        <p className="text-sm text-purple-700">
                            Ponieważ funkcja nic nie zwraca, musisz określić co ma być wypisane po jej wykonaniu.<br/>
                            Przykład: Dla <code className="bg-purple-100 px-1 rounded">sortArray(arr, n)</code> wpisz
                            posortowaną tablicę: <code className="bg-purple-100 px-1 rounded">1 2 3</code>
                        </p>
                    </div>
                )}

                {testCases.map((testCase, index) => (
                    <div key={index} className="border border-gray-300 rounded-md p-4 mb-3">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-medium">Test {index + 1}</h3>
                            <Button
                                onClick={() => removeTestCase(index)}
                                className="text-red-600"
                                variant="ghost"
                            >
                                <Trash2 size={18}/>
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="block text-sm font-medium text-gray-700 mb-1">
                                    Input
                                </Label>
                                <Textarea
                                    value={testCase.input}
                                    onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                                    placeholder="np. 5 3"
                                />
                            </div>

                            <div>
                                <Label className="block text-sm font-medium text-gray-700 mb-1">
                                    Expected Output
                                </Label>
                                <Textarea
                                    value={testCase.expected_output}
                                    onChange={(e) => updateTestCase(index, 'expected_output', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                                    placeholder="np. 8"
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <Button onClick={addTestCase}>
                    <Plus size={20}/>
                    Dodaj test case
                </Button>
            </CardContent>
        </Card>
    );
};

export default TestCasesCard;