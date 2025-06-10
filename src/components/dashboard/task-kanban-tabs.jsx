"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Plus, Search, Filter, Calendar, Clock, AlertCircle, CheckCircle, User, MapPin, Paperclip, MoreVertical, Flag } from 'lucide-react';

// Existing mockTasks and statusColumns (same as before)
// Define a reusable TaskTable component for the table view
const TaskTable = ({ tasks }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Title</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Priority</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Assignee</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Due Date</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Location</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {tasks.map((task) => (
          <tr key={task.id} className="hover:bg-gray-50">
            <td className="px-4 py-2 text-sm text-gray-900">{task.title}</td>
            <td className="px-4 py-2 text-sm text-gray-700">{task.priority}</td>
            <td className="px-4 py-2 text-sm text-gray-700">{task.assignee.name}</td>
            <td className="px-4 py-2 text-sm text-gray-700 capitalize">{task.status}</td>
            <td className="px-4 py-2 text-sm text-gray-700">{task.dueDate}</td>
            <td className="px-4 py-2 text-sm text-gray-700">{task.location}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export function TaskBoardTabs({ tasks }) {
  return (
    <Tabs defaultValue="kanban" className="w-full space-y-6">
      <TabsList className="flex space-x-2">
        <TabsTrigger value="kanban">Kanban View</TabsTrigger>
        <TabsTrigger value="table">Table View</TabsTrigger>
        <TabsTrigger value="upload">Upload Tasks</TabsTrigger>
      </TabsList>

      <TabsContent value="kanban">
        {/* Put your existing Kanban UI code here */}
        <div className="text-gray-600">[Kanban Board goes here]</div>
      </TabsContent>

      <TabsContent value="table">
        <Card>
          <CardHeader>
            <CardTitle>Task List</CardTitle>
            <CardDescription>View and manage all tasks in table format.</CardDescription>
          </CardHeader>
          <CardContent>
            <TaskTable tasks={tasks} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="upload">
        <Card>
          <CardHeader>
            <CardTitle>Upload Tasks</CardTitle>
            <CardDescription>Upload CSV or Excel to bulk import tasks.</CardDescription>
          </CardHeader>
          <CardContent>
            <Input type="file" accept=".csv,.xlsx" className="mb-4" />
            <Button className="bg-blue-600 text-white">Upload</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}