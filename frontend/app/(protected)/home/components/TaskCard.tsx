import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Play} from "lucide-react";
import {useRouter} from "next/navigation";

interface TaskCardProps {
    taskId: string;
    title: string;
    description: string;
    createdBy:string
    hasSubmission?: boolean;
    submission?: {
        status: 'PASSED' | 'FAILED';
        score: number | null;
        createdAt: Date;
    } | null;
}

export const TaskCard = ({
                      taskId,
                      title,
                      description,
                      createdBy,
                      hasSubmission,
                      submission
                  }: TaskCardProps) => {

    const getStatusBadge = () => {
        if (!hasSubmission) return null;

        if (submission?.status === 'PASSED') {
            return (
                <span className="px-3 py-1.5 text-xs font-semibold rounded-full w-fit bg-green-100 text-green-800 whitespace-nowrap">
                ✓ Zaliczone {submission.score !== null && `${submission.score}%`}
            </span>
            );
        }

        return (
            <span className="px-3 py-1.5 text-xs font-semibold rounded-full w-fit bg-red-100 text-red-800 whitespace-nowrap">
            ✗ Niezaliczone {submission?.score !== null && `${submission?.score}%`}
        </span>
        );
    };
    const router = useRouter();

    return (
        <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                            {title}
                        </h3>
                        {getStatusBadge()}
                    </div>
                </CardHeader>

            <CardContent>
                <p className="text-gray-600 leading-relaxed">
                    {description}
                </p>
            </CardContent>

            <CardFooter className="flex items-center justify-between pt-4 border-t gap-4">
                <span className="text-sm text-gray-500">
                    Dodano przez: <span className="font-medium text-gray-700">{createdBy}</span>
                </span>

                <Button
                    onClick={() => router.push(`/code-page/${taskId}`)}
                    className="gap-2"
                    size="sm"
                    variant={hasSubmission ? "outline" : "default"}
                >
                    {hasSubmission ? "Zobacz rozwiązanie" : "Rozpocznij"}
                    <Play className="w-4 h-4" />
                </Button>
            </CardFooter>
        </Card>
    );
};