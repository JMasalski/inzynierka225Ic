import React from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {EyeOff} from "lucide-react";
import {Editor} from "@monaco-editor/react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

interface CodePreviewCardProps {
    templates: {
        cpp: string;
        python: string;
        javascript: string;
    };
    boilerplates: {
        cpp: string;
        python: string;
        javascript: string;
    };
    onHide: () => void;
}


export const CodePreviewCard = ({
                                    templates,
                                    boilerplates,
                                    onHide
                                }: CodePreviewCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-bold flex justify-between">
                    <div>Podgląd szablonów kodu</div>
                    <Button onClick={onHide} variant="ghost">
                        <EyeOff/>
                        Ukryj
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent className="px-5 py-5 gap-4">
                <Tabs defaultValue="python" className="gap-12">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="python">Python</TabsTrigger>
                        <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                        <TabsTrigger value="cpp">C++</TabsTrigger>
                    </TabsList>

                    <TabsContent value="python" className="space-y-6">
                        <Editor
                            height="400px"
                            theme="vs-dark"
                            language="python"
                            options={{readOnly: true}}
                            value={(templates.python + "\n" + boilerplates.python) || ""}
                        />
                    </TabsContent>

                    <TabsContent value="javascript" className="space-y-6">
                        <Editor
                            height="400px"
                            theme="vs-dark"
                            language="javascript"
                            options={{readOnly: true}}
                            value={(templates.javascript + "\n" + boilerplates.javascript) || ""}
                        />
                    </TabsContent>

                    <TabsContent value="cpp">
                        <Editor
                            height="400px"
                            theme="vs-dark"
                            language="cpp"
                            options={{readOnly: true}}
                            value={(templates.cpp + "\n" + boilerplates.cpp) || ""}
                        />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default CodePreviewCard;