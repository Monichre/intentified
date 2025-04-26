// @ts-nocheck
"use client";

import { useEffect, useState } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDocuments } from "@/features/dashboard/document-processing/actions";

type Document = any["public"]["Tables"]["doc_processor_documents"]["Row"];

type Analysis = {
  summary: string;
  keywords: string[];
};

export function AIInsights() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDocuments() {
      try {
        const docs = await getDocuments();
        setDocuments(docs.filter((doc) => doc.analysis));
      } catch (error) {
        console.error("Error loading documents:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDocuments();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-muted-foreground py-10 text-center">
        <p>No analyzed documents yet.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-8">
        {documents.map((doc) => (
          <Card key={doc.id}>
            <CardHeader>
              <CardTitle>{doc.title}</CardTitle>
              <CardDescription>
                {new Date(doc.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {doc.analysis && (
                <>
                  <div className="space-y-2">
                    <h4 className="font-medium">Summary</h4>
                    <p className="text-muted-foreground text-sm">
                      {(doc.analysis as Analysis).summary}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {(doc.analysis as Analysis).keywords.map((keyword, i) => (
                        <Badge key={i} variant="secondary">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
