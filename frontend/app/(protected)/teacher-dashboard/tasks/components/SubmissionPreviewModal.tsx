import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import Editor from "@monaco-editor/react";
import {CheckCircle2, Clock, Database, XCircle} from "lucide-react";


export default function SubmissionPreviewModal({open, onClose, submission}: any) {
    if (!submission) return null;

    const getLanguageName = (langId: number) => {
        const langs: Record<number, string> = {
            63: 'javascript',
            71: 'python',
            54: 'cpp'
        };
        return langs[langId] || 'javascript';
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className="p-0 gap-0 border-0"
                style={{
                    maxWidth: '98vw',
                    maxHeight: '98vh',
                    width: '98vw',
                    height: '98vh'
                }}
            >
                <div className="flex flex-col h-full w-full bg-white rounded-lg overflow-hidden">
                    <DialogHeader className="flex-shrink-0 px-6 py-4 border-b bg-gray-50">
                        <DialogTitle className="text-xl">
                            {submission.user.firstName} {submission.user.lastName} — {submission.score}%
                            <span className="ml-4 text-sm font-normal text-gray-500">
                                {submission.passedTests || 0}/{submission.totalTests || 0} testów zaliczonych
                            </span>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-1 gap-4 p-4 min-h-0 overflow-hidden">
                        {/* CODE EDITOR */}
                        <div className="flex-[3] border rounded-lg overflow-hidden flex flex-col min-h-0 bg-white shadow-sm">
                            <div className="bg-gray-50 px-4 py-2 border-b flex-shrink-0">
                                <span className="font-semibold text-sm">Kod rozwiązania</span>
                            </div>
                            <div className="flex-1 min-h-0 overflow-hidden">
                                <Editor
                                    height="100%"
                                    language={getLanguageName(submission.languageId)}
                                    value={submission.code}
                                    options={{
                                        readOnly: true,
                                        fontSize: 16,
                                        minimap: {enabled: false},
                                        scrollBeyondLastLine: false,
                                        lineNumbers: 'on',
                                        renderWhitespace: 'selection',
                                        wordWrap: 'on',
                                        padding: { top: 16, bottom: 16 }
                                    }}
                                    theme="vs-light"
                                />
                            </div>
                        </div>

                        {/* TEST RESULTS */}
                        <div className="flex-[2] flex flex-col border rounded-lg overflow-hidden min-h-0 bg-white shadow-sm">
                            <div className="bg-gray-50 px-4 py-2 border-b flex-shrink-0">
                                <span className="font-semibold text-sm">Wyniki testów</span>
                            </div>

                            {/* Scrollable container */}
                            <div className="flex-1 overflow-y-auto min-h-0 p-4">
                                {/* Summary */}
                                <div className={`p-4 mb-4 rounded-lg border-2 flex-shrink-0 ${
                                    submission.allPassed
                                        ? 'bg-green-50 border-green-500'
                                        : submission.score >= 50
                                            ? 'bg-yellow-50 border-yellow-500'
                                            : 'bg-red-50 border-red-500'
                                }`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-lg">
                                                {submission.allPassed
                                                    ? '✅ Wszystkie testy zaliczone'
                                                    : submission.score >= 50
                                                        ? '⚠️ Częściowo zaliczone'
                                                        : '❌ Niezaliczone'}
                                            </p>
                                            <p className="text-sm mt-1 text-gray-700">
                                                Wynik: {submission.score}% ({submission.passedTests}/{submission.totalTests})
                                            </p>
                                        </div>
                                        <div className="text-right text-sm text-gray-600">
                                            <div className="flex items-center gap-2 justify-end">
                                                <Clock className="h-4 w-4"/>
                                                <span className="font-medium">{submission.totalTime}s</span>
                                            </div>
                                            <div className="flex items-center gap-2 justify-end mt-1">
                                                <Database className="h-4 w-4"/>
                                                <span className="font-medium">{Math.round(submission.maxMemory / 1024)}MB</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Test Cases */}
                                <div className="space-y-3">
                                    {submission.testResults && submission.testResults.length > 0 ? (
                                        submission.testResults.map((t: any, i: number) => (
                                            <div
                                                key={i}
                                                className={`p-4 rounded-lg border-2 ${
                                                    t.passed
                                                        ? "bg-green-50 border-green-300"
                                                        : "bg-red-50 border-red-300"
                                                }`}
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        {t.passed ? (
                                                            <CheckCircle2 className="h-5 w-5 text-green-600"/>
                                                        ) : (
                                                            <XCircle className="h-5 w-5 text-red-600"/>
                                                        )}
                                                        <span className="font-bold text-base">Test #{i + 1}</span>
                                                    </div>
                                                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                                                        t.passed
                                                            ? 'bg-green-200 text-green-800'
                                                            : 'bg-red-200 text-red-800'
                                                    }`}>
                                                        {t.status}
                                                    </span>
                                                </div>

                                                <div className="space-y-2">
                                                    <div>
                                                        <span className="font-semibold text-gray-700 text-sm block mb-1">Input:</span>
                                                        <code className="bg-white px-3 py-2 rounded border block text-sm font-mono">
                                                            {t.input}
                                                        </code>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-gray-700 text-sm block mb-1">Oczekiwany wynik:</span>
                                                        <code className="bg-white px-3 py-2 rounded border block text-sm font-mono">
                                                            {t.expectedOutput}
                                                        </code>
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-gray-700 text-sm block mb-1">Otrzymany wynik:</span>
                                                        <code className={`px-3 py-2 rounded border block text-sm font-mono ${
                                                            t.passed
                                                                ? 'bg-green-100 border-green-300 text-green-900'
                                                                : 'bg-red-100 border-red-300 text-red-900'
                                                        }`}>
                                                            {t.actualOutput || '(brak outputu)'}
                                                        </code>
                                                    </div>

                                                    {t.stderr && (
                                                        <div className="mt-3 pt-3 border-t border-red-200">
                                                            <span className="font-semibold text-red-700 text-sm block mb-1">Błąd wykonania:</span>
                                                            <pre className="bg-red-100 p-3 rounded text-xs overflow-auto max-h-32 border border-red-200 text-red-900 font-mono">
                                                                {t.stderr}
                                                            </pre>
                                                        </div>
                                                    )}

                                                    {t.compile_output && (
                                                        <div className="mt-3 pt-3 border-t border-red-200">
                                                            <span className="font-semibold text-red-700 text-sm block mb-1">Błąd kompilacji:</span>
                                                            <pre className="bg-red-100 p-3 rounded text-xs overflow-auto max-h-32 border border-red-200 text-red-900 font-mono">
                                                                {t.compile_output}
                                                            </pre>
                                                        </div>
                                                    )}

                                                    <div className="flex gap-4 text-sm text-gray-600 mt-3 pt-3 border-t">
                                                        <span className="flex items-center gap-1 font-medium">
                                                            ⏱️ {t.time}s
                                                        </span>
                                                        <span className="flex items-center gap-1 font-medium">
                                                            💾 {Math.round(t.memory / 1024)}KB
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-gray-500 py-12">
                                            Brak wyników testów
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}