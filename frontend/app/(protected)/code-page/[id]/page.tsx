"use client"
import React, {useEffect, useState} from 'react'
import {useParams} from "next/navigation";
import {useTaskStore} from "@/store/useTaskStore";
import Loader from "@/components/Loader";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable";
import {Editor} from "@monaco-editor/react";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {LANGUAGES} from "@/lib/languages";
import {CheckCircle2, Clock, Database, SquareArrowRight, XCircle} from "lucide-react";


const Page = () => {
    const params = useParams()
    const taskId = params.id as string;

    const {getIndividualTask, individualTask, loading, submitTask, submitResponse,clearSubmitResponse} = useTaskStore()
    const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0])
    const [code, setCode] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        getIndividualTask(taskId)
    }, [taskId, getIndividualTask])

    useEffect(() => {
        if (individualTask?.templates) {
            const template = individualTask.templates[selectedLanguage.templateKey as keyof typeof individualTask.templates]
            setCode(template || "")
        }
    }, [individualTask, selectedLanguage])

    const handleLanguageChange = (languageId: string) => {
        const language = LANGUAGES.find(lang => lang.id.toString() === languageId)
        if (language) {
            setSelectedLanguage(language)
        }
    }
    useEffect(() => {
        clearSubmitResponse()
    }, [taskId])

    const handleSubmit = async () => {
        setIsSubmitting(true)
        await submitTask({
            taskId: taskId,
            language_id: selectedLanguage.id,
            code: code
        })
        setIsSubmitting(false)
    }

    if (loading && !individualTask) return <Loader/>

    return (
        <div className="h-full w-full">
            <ResizablePanelGroup
                direction="horizontal"
                className="h-full w-full border rounded-lg bg-white"
            >
                <ResizablePanel defaultSize={60}>
                    <div className="h-full w-full flex flex-col">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h3 className="font-semibold">Edytor kodu</h3>
                            <Select
                                value={selectedLanguage.id.toString()}
                                onValueChange={handleLanguageChange}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Wybierz język"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {LANGUAGES.map((lang) => (
                                        <SelectItem
                                            key={lang.id}
                                            value={lang.id.toString()}
                                        >
                                            {lang.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex-1 p-4">
                            <Editor
                                language={selectedLanguage.monacoLang}
                                value={code}
                                onChange={(value) => setCode(value || "")}
                                options={{
                                    fontSize: 16,
                                    minimap: {enabled: false},
                                    scrollBeyondLastLine: false,
                                }}
                            />
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle/>

                <ResizablePanel defaultSize={40}>
                    <ResizablePanelGroup
                        direction="vertical"
                        className="h-full bg-white"
                    >
                        <ResizablePanel defaultSize={25}>
                            <div className="h-full w-full p-4 overflow-auto">
                                <h2 className="text-xl font-bold mb-2">{individualTask?.title}</h2>
                                <p className="text-lg font-semibold mb-1">Opis zadania:</p>
                                <span className="text-md">{individualTask?.description}</span>
                            </div>
                        </ResizablePanel>

                        <ResizableHandle withHandle/>

                        <ResizablePanel defaultSize={75}>
                            <div className="h-full w-full p-4 flex flex-col">
                                <h3 className="font-semibold mb-4">Wyniki testów</h3>
                                <div className="flex-1 overflow-auto space-y-3">
                                    {isSubmitting && (
                                        <div className="flex items-center justify-center py-8">
                                            <div
                                                className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                            <span className="ml-3 text-gray-600">Sprawdzanie...</span>
                                        </div>
                                    )}

                                    {!isSubmitting && submitResponse && (
                                        <>
                                            {/* Podsumowanie */}
                                            <div className={`p-4 rounded-lg border-2 ${
                                                submitResponse.allPassed
                                                    ? 'bg-green-50 border-green-500'
                                                    : 'bg-red-50 border-red-500'
                                            }`}>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-bold text-lg">
                                                            {submitResponse.allPassed ? '✅ Wszystkie testy zaliczone!' : '❌ Niektóre testy nie przeszły'}
                                                        </h4>
                                                        <p className="text-sm mt-1">
                                                            Wynik: {submitResponse.passedTests}/{submitResponse.totalTests} testów
                                                            ({submitResponse.score}%)
                                                        </p>
                                                    </div>
                                                    <div className="text-right text-sm text-gray-600">
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-4 w-4"/>
                                                            {submitResponse.totalTime}s
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Database className="h-4 w-4"/>
                                                            {Math.round(submitResponse.maxMemory / 1024)}MB
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Szczegóły testów */}
                                            <div className="space-y-2">
                                                {submitResponse.testResults.map((test: any, index: number) => (
                                                    <div
                                                        key={index}
                                                        className={`p-3 rounded-lg border ${
                                                            test.passed
                                                                ? 'bg-green-50 border-green-200'
                                                                : 'bg-red-50 border-red-200'
                                                        }`}
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                {test.passed ? (
                                                                    <CheckCircle2 className="h-5 w-5 text-green-600"/>
                                                                ) : (
                                                                    <XCircle className="h-5 w-5 text-red-600"/>
                                                                )}
                                                                <span className="font-semibold">
                                                                    Test {test.testCase}
                                                                </span>
                                                            </div>
                                                            <span className={`text-xs px-2 py-1 rounded ${
                                                                test.passed
                                                                    ? 'bg-green-200 text-green-800'
                                                                    : 'bg-red-200 text-red-800'
                                                            }`}>
                                                                {test.status ==="Accepted" ? "Zaakceptowany" : "Błąd"}
                                                            </span>
                                                        </div>

                                                        <div className="text-sm space-y-1">
                                                            <div>
                                                                <span className="font-medium">Input: </span>
                                                                <code
                                                                    className="bg-gray-100 px-2 py-1 rounded">{test.input}</code>
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Oczekiwany: </span>
                                                                <code
                                                                    className="bg-gray-100 px-2 py-1 rounded">{test.expectedOutput}</code>
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Otrzymany: </span>
                                                                <code className={`px-2 py-1 rounded ${
                                                                    test.passed ? 'bg-green-100' : 'bg-red-100'
                                                                }`}>
                                                                    {test.actualOutput || '(brak output)'}
                                                                </code>
                                                            </div>

                                                            {test.stderr && (
                                                                <div className="mt-2">
                                                                    <span
                                                                        className="font-medium text-red-600">Błąd: </span>
                                                                    <pre
                                                                        className="bg-red-100 p-2 rounded text-xs overflow-auto">
                                                                        {test.stderr}
                                                                    </pre>
                                                                </div>
                                                            )}

                                                            {test.compile_output && (
                                                                <div className="mt-2">
                                                                    <span className="font-medium text-red-600">Błąd kompilacji: </span>
                                                                    <pre
                                                                        className="bg-red-100 p-2 rounded text-xs overflow-auto">
                                                                        {test.compile_output}
                                                                    </pre>
                                                                </div>
                                                            )}

                                                            <div className="flex gap-4 text-xs text-gray-600 mt-2">
                                                                <span>⏱️ {test.time}s</span>
                                                                <span>💾 {Math.round(test.memory / 1024)}KB</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {!isSubmitting && !submitResponse && (
                                        <div className="flex items-center justify-center py-8 text-gray-500">
                                            Kliknij "Uruchom testy" aby sprawdzić swoje rozwiązanie
                                        </div>
                                    )}
                                </div>
                                <div className="pt-4 border-t flex items-center gap-5">
                                    <Button
                                        className="flex-1 bg-blue-500 hover:bg-blue-600"
                                        disabled={isSubmitting}
                                        onClick={handleSubmit}
                                    >
                                        Uruchom testy <SquareArrowRight/>
                                    </Button>
                                    <Button
                                        className="flex-1 bg-green-500 hover:bg-green-600"
                                        disabled={isSubmitting}
                                        onClick={() => console.log('Zapisano rozwiązanie')}
                                    >
                                        Zapisz odpowiedź
                                    </Button>
                                </div>
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}
export default Page