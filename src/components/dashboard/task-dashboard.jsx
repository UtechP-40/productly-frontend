"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { TaskKanban } from './TaskKanban';

const mockTasks = [
  // ... same tasks as earlier (can be imported or separated if needed)
];

export default function TaskDashboard() {
  const [tasks, setTasks] = useState(mockTasks);

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <Tabs defaultValue="kanban" className="space-y-6">
        <TabsList className="flex gap-2">
          <TabsTrigger value="kanban">Kanban View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="upload">Upload Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban">
          <TaskKanban />
        </TabsContent>

        <TabsContent value="table">
          <div className="bg-white rounded-lg shadow-md overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Tags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.status}</TableCell>
                    <TableCell>{task.priority}</TableCell>
                    <TableCell>{task.assignee.name}</TableCell>
                    <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{task.location}</TableCell>
                    <TableCell>
                      {task.tags.map((tag, idx) => (
                        <span key={idx} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">
                          {tag}
                        </span>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="upload">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Upload Task CSV</h2>
            <input type="file" accept=".csv" className="mb-4" />
            <p className="text-sm text-gray-600">Only CSV files with headers: title, description, status, priority, assignee, dueDate, location, tags</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Upload</button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
