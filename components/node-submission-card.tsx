"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Send, Loader2 } from "lucide-react";
import { adminApi } from "@/lib/api/backend";

interface NodeSubmissionCardProps {
  onNodesSubmitted?: (nodes: string[]) => void;
}

export function NodeSubmissionCard({
  onNodesSubmitted,
}: NodeSubmissionCardProps) {
  const [nodes, setNodes] = useState<string[]>([]);
  const [currentNode, setCurrentNode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const addNode = () => {
    if (currentNode.trim() && !nodes.includes(currentNode.trim())) {
      setNodes([...nodes, currentNode.trim()]);
      setCurrentNode("");
    }
  };

  const removeNode = (nodeToRemove: string) => {
    setNodes(nodes.filter((node) => node !== nodeToRemove));
  };

  const handleSubmit = async () => {
    if (nodes.length === 0) {
      setMessage("Please add at least one node");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      console.log("[NODE SUBMISSION] Submitting nodes:", nodes);
      const response = await adminApi.submitNodes(nodes);

      if (response.error) {
        setMessage(`Error: ${response.error}`);
      } else {
        setMessage(
          `Success: ${response.data?.message || "Nodes submitted successfully"}`
        );
        onNodesSubmitted?.(nodes);
        // Optionally clear the form after successful submission
        // setNodes([]);
      }
    } catch (error) {
      console.error("[NODE SUBMISSION] Error:", error);
      setMessage("Failed to submit nodes. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addNode();
    }
  };

  return (
    <Card className="bg-white/5 backdrop-blur-sm border border-white/10 text-white">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Send className="h-5 w-5 text-blue-400" />
          Submit Active Nodes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Node Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter node ID (e.g., n1, n2, n3...)"
            value={currentNode}
            onChange={(e) => setCurrentNode(e.target.value)}
            onKeyPress={handleKeyPress}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
          <Button
            onClick={addNode}
            size="sm"
            className="bg-blue-400/20 hover:bg-blue-400/30 text-blue-400 border border-blue-400/30"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Current Nodes */}
        {nodes.length > 0 && (
          <div>
            <p className="text-sm text-white/70 mb-2">
              Active Nodes ({nodes.length}):
            </p>
            <div className="flex flex-wrap gap-2">
              {nodes.map((node) => (
                <Badge
                  key={node}
                  variant="secondary"
                  className="bg-purple-400/20 text-purple-400 hover:bg-purple-400/30 flex items-center gap-1"
                >
                  {node}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-400"
                    onClick={() => removeNode(node)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={nodes.length === 0 || isSubmitting}
          className="w-full bg-green-400/20 hover:bg-green-400/30 text-green-400 border border-green-400/30 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Submit Nodes for Task Distribution
            </>
          )}
        </Button>

        {/* Message */}
        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.startsWith("Success")
                ? "bg-green-400/20 text-green-400 border border-green-400/30"
                : "bg-red-400/20 text-red-400 border border-red-400/30"
            }`}
          >
            {message}
          </div>
        )}

        {/* Instructions */}
        <div className="text-xs text-white/50 space-y-1">
          <p>• Enter node IDs (e.g., n1, n2, n3) to distribute tasks across</p>
          <p>
            • Data will be split into chunks based on number of active nodes
          </p>
          <p>• Zip files will be created for each node with distributed data</p>
        </div>
      </CardContent>
    </Card>
  );
}
