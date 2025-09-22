"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Search, Plus, Loader2, UserCheck } from "lucide-react";

interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
}

interface AssignTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssignTask?: (userIds: number[]) => void;
}

export function AssignTaskModal({
  isOpen,
  onClose,
  onAssignTask,
}: AssignTaskModalProps) {
  const [searchUsername, setSearchUsername] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const searchUsers = async () => {
    if (!searchUsername.trim()) {
      setMessage("Please enter a username to search");
      return;
    }

    setIsSearching(true);
    setMessage("");

    try {
      // Call the backend to search for users
      console.log("Searching for users with query:", searchUsername);
      const response = await fetch(
        `/api/flask/admin/search-users?username=${encodeURIComponent(
          searchUsername
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Search response status:", response.status);

      if (response.ok) {
        const users = await response.json();
        console.log("Search results:", users);
        console.log("Number of users found:", users.length);

        setSearchResults(users);
        if (users.length === 0) {
          setMessage("No users found with that username");
        } else {
          setMessage(`Found ${users.length} user(s)`);
        }
      } else {
        const errorText = await response.text();
        console.error("Search error response:", errorText);
        setMessage("Error searching for users");
      }
    } catch (error) {
      console.error("Search error:", error);
      setMessage("Failed to search for users. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const addUser = (user: User) => {
    // Check if user is already selected
    if (!selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
      setSearchUsername("");
      setSearchResults([]);
      setMessage("");
    } else {
      setMessage("User is already selected");
    }
  };

  const removeUser = (userId: number) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
  };

  const handleAssignTask = async () => {
    if (selectedUsers.length === 0) {
      setMessage("Please select at least one user");
      return;
    }

    if (!taskName.trim()) {
      setMessage("Please enter a task name");
      return;
    }

    setIsAssigning(true);
    setMessage("");

    try {
      const userIds = selectedUsers.map((user) => user.id);

      // Call the backend API to assign the task
      const response = await fetch("/api/flask/admin/assign-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userIds: userIds,
          taskName: taskName.trim(),
          description: taskDescription.trim(),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(
          `Task "${taskName}" assigned to ${selectedUsers.length} user(s) successfully!`
        );

        // Reset form after successful assignment
        setTimeout(() => {
          setSelectedUsers([]);
          setSearchUsername("");
          setSearchResults([]);
          setTaskName("");
          setTaskDescription("");
          setMessage("");
          onClose();
        }, 2000);
      } else {
        const error = await response.json();
        setMessage(error.error || "Failed to assign task");
      }
    } catch (error) {
      console.error("Assignment error:", error);
      setMessage("Failed to assign task. Please try again.");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchUsers();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-400/20 rounded-full flex items-center justify-center">
                <UserCheck className="h-4 w-4 text-purple-400" />
              </div>
              Assign Task to Users
            </h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search Section */}
          <div className="mb-6">
            <label className="text-sm text-white/70 mb-2 block">
              Search for Users
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter username..."
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Button
                onClick={searchUsers}
                disabled={isSearching}
                className="bg-blue-400/20 hover:bg-blue-400/30 text-blue-400 border border-blue-400/30"
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-white/70 mb-3">Search Results:</p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div>
                      <p className="text-white font-medium">{user.username}</p>
                      <p className="text-white/60 text-sm">
                        {user.name} • {user.email}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          user.role === "ADMIN"
                            ? "bg-red-400/20 text-red-400"
                            : "bg-green-400/20 text-green-400"
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                    <Button
                      onClick={() => addUser(user)}
                      size="sm"
                      className="bg-green-400/20 hover:bg-green-400/30 text-green-400 border border-green-400/30"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-white/70 mb-3">
                Selected Users ({selectedUsers.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <Badge
                    key={user.id}
                    variant="secondary"
                    className="bg-purple-400/20 text-purple-400 hover:bg-purple-400/30 flex items-center gap-2 px-3 py-2"
                  >
                    <span>{user.username}</span>
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-red-400"
                      onClick={() => removeUser(user.id)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Task Assignment Form */}
          {selectedUsers.length > 0 && (
            <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-sm text-white/70 mb-4">Task Details:</p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/70 mb-2 block">
                    Task Name *
                  </label>
                  <Input
                    placeholder="Enter task name..."
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70 mb-2 block">
                    Description (Optional)
                  </label>
                  <textarea
                    placeholder="Enter task description..."
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleAssignTask}
              disabled={
                selectedUsers.length === 0 || !taskName.trim() || isAssigning
              }
              className="flex-1 bg-purple-400/20 hover:bg-purple-400/30 text-purple-400 border border-purple-400/30 disabled:opacity-50"
            >
              {isAssigning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  {taskName.trim()
                    ? `Assign "${taskName}" to ${
                        selectedUsers.length || 0
                      } User(s)`
                    : `Assign Task to ${selectedUsers.length || 0} User(s)`}
                </>
              )}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              Cancel
            </Button>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`mt-4 p-3 rounded-lg text-sm ${
                message.includes("success") || message.includes("assigned")
                  ? "bg-green-400/20 text-green-400 border border-green-400/30"
                  : "bg-red-400/20 text-red-400 border border-red-400/30"
              }`}
            >
              {message}
            </div>
          )}

          {/* Instructions */}
          <div className="mt-6 text-xs text-white/50 space-y-1">
            <p>• Search for users by their username</p>
            <p>• Select multiple users to assign the task to all of them</p>
            <p>• The system will create nodes for each selected user</p>
          </div>
        </div>
      </div>
    </div>
  );
}
