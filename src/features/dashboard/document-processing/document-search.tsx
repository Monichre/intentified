"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { searchDocumentChunks } from "@/features/dashboard/document-processing/actions";

type DocumentChunk = {
  id: string;
  title: string;
  content: string;
  heading?: string | null;
  page_number?: number | null;
  combined_score: number;
};

interface SearchResult {
  matches: DocumentChunk[];
  loading: boolean;
  error?: string;
}

interface DocumentSearchProps {
  documentId?: string;
  className?: string;
}

export function DocumentSearch({ documentId, className }: DocumentSearchProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);
  const [searchResult, setSearchResult] = useState<SearchResult>({
    matches: [],
    loading: false,
  });

  // Search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setSearchResult({ matches: [], loading: false });
      return;
    }

    const search = async () => {
      setSearchResult((prev) => ({ ...prev, loading: true }));
      try {
        const result = await searchDocumentChunks(debouncedQuery, documentId);
        if (result.success) {
          setSearchResult({
            matches: result.matches,
            loading: false,
          });
        } else {
          setSearchResult({
            matches: [],
            loading: false,
            error: result.error,
          });
        }
      } catch (error) {
        setSearchResult({
          matches: [],
          loading: false,
          error: error instanceof Error ? error.message : "Search failed",
        });
      }
    };

    search();
  }, [debouncedQuery, documentId]);

  return (
    <div className={className}>
      {/* Search Input */}
      <div className="relative mx-2 -mt-12">
        <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
        <Input
          placeholder="Search document content..."
          className="rounded-xl bg-white pr-4 pl-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {searchResult.loading && (
          <Loader2 className="text-muted-foreground absolute top-2.5 right-2.5 h-4 w-4 animate-spin" />
        )}
      </div>

      {/* Search Results */}
      {searchResult.error ? (
        <p className="text-destructive mt-4 text-sm">{searchResult.error}</p>
      ) : searchResult.matches.length > 0 ? (
        <ScrollArea className="mt-4 h-[400px] rounded-md border">
          <div className="space-y-4 p-4">
            {searchResult.matches.map((chunk) => (
              <Card key={chunk.id} className="space-y-2 p-4">
                {/* Chunk Metadata */}
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  {!documentId && (
                    <span className="text-foreground font-medium">
                      {chunk.title}
                    </span>
                  )}
                  <div className="flex gap-2">
                    {chunk.heading && (
                      <Badge variant="outline">{chunk.heading}</Badge>
                    )}
                    {chunk.page_number && (
                      <Badge variant="outline">Page {chunk.page_number}</Badge>
                    )}
                  </div>
                </div>

                {/* Chunk Content */}
                <p className="text-sm">{chunk.content}</p>
              </Card>
            ))}
          </div>
        </ScrollArea>
      ) : query && !searchResult.loading ? (
        <p className="text-muted-foreground mt-4 text-sm">No results found</p>
      ) : null}
    </div>
  );
}
