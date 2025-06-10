import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  User,
  MapPin,
  Paperclip,
  MoreVertical,
  Flag,
  Upload,
  Download,
  Edit,
  Trash2,
  Eye,
  FileSpreadsheet,
  X,
  Save
} from 'lucide-react';
import BulkUploadView from './bulk-upload-system'
// Mock tasks data with additional fields
const mockTasks = [
  {
    id: '1',
    serialNumber: 'TSK-001',
    title: 'Site Inspection #1247',
    description: 'Conduct safety inspection at downtown construction site',
    status: 'pending',
    priority: 'high',
    state: 'California',
    city: 'Los Angeles',
    address: '123 Downtown Ave, LA, CA 90001',
    employeeType: 'Field Inspector',
    assignedTo: 'Marcus Rodriguez',
    acceptedBy: null,
    poc: 'John Manager',
    assignee: {
      name: 'Marcus Rodriguez',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    dueDate: '2024-01-15',
    location: 'Downtown Office District',
    attachments: 2,
    tags: ['Safety', 'Inspection']
  },
  {
    id: '2',
    serialNumber: 'TSK-002',
    title: 'Equipment Check #1245',
    description: 'Routine maintenance check on industrial equipment',
    status: 'ongoing',
    priority: 'medium',
    state: 'Texas',
    city: 'Houston',
    address: '456 Industrial Blvd, Houston, TX 77001',
    employeeType: 'Maintenance Tech',
    assignedTo: 'Emily Watson',
    acceptedBy: 'Emily Watson',
    poc: 'Sarah Director',
    assignee: {
      name: 'Emily Watson',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    dueDate: '2024-01-16',
    location: 'Industrial Zone B',
    attachments: 1,
    tags: ['Maintenance', 'Equipment']
  },
  {
    id: '3',
    serialNumber: 'TSK-003',
    title: 'Quality Audit #1249',
    description: 'Quality assurance audit for production line',
    status: 'ongoing',
    priority: 'high',
    state: 'New York',
    city: 'New York',
    address: '789 Tech Campus Dr, NY, NY 10001',
    employeeType: 'QA Specialist',
    assignedTo: 'Sarah Johnson',
    acceptedBy: 'Sarah Johnson',
    poc: 'Mike Supervisor',
    assignee: {
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    dueDate: '2024-01-14',
    location: 'Tech Campus',
    attachments: 3,
    tags: ['Quality', 'Audit']
  },
  {
    id: '4',
    serialNumber: 'TSK-004',
    title: 'Maintenance Check #1243',
    description: 'Scheduled maintenance for warehouse systems',
    status: 'completed',
    priority: 'low',
    state: 'Florida',
    city: 'Miami',
    address: '321 Warehouse St, Miami, FL 33101',
    employeeType: 'Systems Tech',
    assignedTo: 'David Kim',
    acceptedBy: 'David Kim',
    poc: 'Lisa Manager',
    assignee: {
      name: 'David Kim',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    dueDate: '2024-01-13',
    location: 'Warehouse District',
    attachments: 0,
    tags: ['Maintenance', 'Systems']
  },
  {
    id: '5',
    serialNumber: 'TSK-005',
    title: 'Security Review #1251',
    description: 'Monthly security protocol review',
    status: 'escalated',
    priority: 'high',
    state: 'Illinois',
    city: 'Chicago',
    address: '654 Main Office Plaza, Chicago, IL 60601',
    employeeType: 'Security Officer',
    assignedTo: 'Marcus Rodriguez',
    acceptedBy: null,
    poc: 'Robert Head',
    assignee: {
      name: 'Marcus Rodriguez',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    dueDate: '2024-01-12',
    location: 'Main Office',
    attachments: 1,
    tags: ['Security', 'Review']
  }
];

const statusColumns = [
  { id: 'pending', title: 'Pending', color: 'bg-gray-900 border-gray-700', icon: <Clock className="h-4 w-4 text-white" /> },
  { id: 'ongoing', title: 'In Progress', color: 'bg-blue-900 border-blue-700', icon: <AlertCircle className="h-4 w-4 text-blue-200" /> },
  { id: 'completed', title: 'Completed', color: 'bg-gray-800 border-gray-600', icon: <CheckCircle className="h-4 w-4 text-white" /> },
  { id: 'escalated', title: 'Escalated', color: 'bg-black border-gray-600', icon: <Flag className="h-4 w-4 text-white" /> }
];

export default function EnhancedTaskManager() {
  const [activeTab, setActiveTab] = useState('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [tasks, setTasks] = useState(mockTasks);
  const [bulkTasks, setBulkTasks] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
    const matchesState = selectedState === 'all' || task.state === selectedState;
    return matchesSearch && matchesPriority && matchesStatus && matchesState;
  });

  const getTasksByStatus = (status) => {
    return filteredTasks.filter(task => task.status === status);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'low':
        return 'bg-green-100 text-green-800 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'escalated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Simulate reading Excel file and creating sample data
      const sampleBulkTasks = [
        {
          id: 'bulk-1',
          serialNumber: 'TSK-006',
          title: 'Network Security Audit',
          description: 'Comprehensive security audit of network infrastructure',
          status: 'pending',
          priority: 'high',
          state: 'Nevada',
          city: 'Las Vegas',
          address: '123 Security Blvd, Las Vegas, NV 89101',
          employeeType: 'Security Analyst',
          assignedTo: 'Alex Thompson',
          acceptedBy: null,
          poc: 'IT Director'
        },
        {
          id: 'bulk-2',
          serialNumber: 'TSK-007',
          title: 'Database Backup Verification',
          description: 'Verify integrity of database backup systems',
          status: 'pending',
          priority: 'medium',
          state: 'Oregon',
          city: 'Portland',
          address: '456 Data Center Way, Portland, OR 97201',
          employeeType: 'Database Admin',
          assignedTo: 'Maria Garcia',
          acceptedBy: null,
          poc: 'Operations Manager'
        }
      ];
      setBulkTasks(sampleBulkTasks);
    }
  };

  const removeBulkTask = (id) => {
    setBulkTasks(bulkTasks.filter(task => task.id !== id));
  };

  const startEditing = (taskId, field, value) => {
    setEditingCell(`${taskId}-${field}`);
    setEditValue(value);
  };

  const saveEdit = (taskId, field) => {
    setBulkTasks(bulkTasks.map(task => 
      task.id === taskId ? { ...task, [field]: editValue } : task
    ));
    setEditingCell(null);
    setEditValue('');
  };

  const uploadBulkTasks = () => {
    setTasks([...tasks, ...bulkTasks]);
    setBulkTasks([]);
    setActiveTab('table');
  };

  const TaskCard = ({ task }) => (
    <Card className="mb-4 bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
            {task.tags.map((tag, index) => (
              <Badge key={index} className="bg-blue-50 text-blue-800 border border-blue-200 text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100">
            <MoreVertical className="h-4 w-4 text-gray-600" />
          </Button>
        </div>

        <h3 className="font-semibold text-black mb-2 line-clamp-2">{task.title}</h3>
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{task.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-xs text-gray-600">
            <MapPin className="h-3 w-3 mr-1" />
            {task.location}
          </div>
          <div className="flex items-center text-xs text-gray-600">
            <Calendar className="h-3 w-3 mr-1" />
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </div>
          {task.attachments > 0 && (
            <div className="flex items-center text-xs text-gray-600">
              <Paperclip className="h-3 w-3 mr-1" />
              {task.attachments} attachment{task.attachments > 1 ? 's' : ''}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6 border border-gray-200">
              <AvatarImage src={task.assignee?.avatar} alt={task.assignee?.name} />
              <AvatarFallback className="text-xs bg-gray-100 text-gray-700">
                {task.assignee?.name?.split(' ').map(n => n[0]).join('') || 'NA'}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-700">{task.assignee?.name || task.assignedTo}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const KanbanView = () => (
    <div className="space-y-6">
      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statusColumns.map((column) => {
          const count = getTasksByStatus(column.id).length;
          return (
            <Card key={column.id} className="bg-white border border-gray-200 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{column.title}</p>
                    <p className="text-2xl font-bold text-black">{count}</p>
                  </div>
                  <div className="p-2 bg-gray-900 rounded-lg">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {statusColumns.map((column) => (
          <div key={column.id} className="space-y-4">
            <Card className={`${column.color} border-2`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-sm font-semibold text-white">
                  {column.icon}
                  <span className="ml-2">{column.title}</span>
                  <Badge className="ml-auto bg-white text-black">
                    {getTasksByStatus(column.id).length}
                  </Badge>
                </CardTitle>
              </CardHeader>
            </Card>

            <div className="space-y-3 min-h-96">
              {getTasksByStatus(column.id).map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              
              {getTasksByStatus(column.id).length === 0 && (
                <div className="text-center py-8 text-gray-600">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="h-6 w-6 text-gray-500" />
                  </div>
                  <p className="text-sm">No tasks in {column.title.toLowerCase()}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const TableView = () => (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accepted By</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">POC</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Description</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTasks.map((task, index) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{task.serialNumber}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{task.state}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{task.city}</td>
                <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate" title={task.address}>{task.address}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{task.employeeType}</td>
                <td className="px-4 py-3">
                  <Badge className={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{task.assignedTo}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{task.acceptedBy || 'Not Accepted'}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{task.poc}</td>
                <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate" title={task.description}>{task.description}</td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-100">
                      <Eye className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-green-100">
                      <Edit className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-100">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // const BulkUploadView = () => (
  //   <div className="space-y-6">
  //     <Card className="bg-white border border-gray-200 shadow-lg">
  //       <CardHeader>
  //         <CardTitle className="flex items-center">
  //           <Upload className="h-5 w-5 mr-2" />
  //           Upload Tasks in Bulk
  //         </CardTitle>
  //         <CardDescription>
  //           Choose an Excel file to upload multiple tasks at once
  //         </CardDescription>
  //       </CardHeader>
  //       <CardContent>
  //         <div className="flex items-center space-x-4">
  //           <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
  //             <FileSpreadsheet className="h-4 w-4 mr-2" />
  //             Choose Excel File
  //             <input
  //               type="file"
  //               accept=".xlsx,.xls"
  //               onChange={handleFileUpload}
  //               className="hidden"
  //             />
  //           </label>
  //           <Button variant="outline" className="border-gray-300">
  //             <Download className="h-4 w-4 mr-2" />
  //             Download Template
  //           </Button>
  //         </div>
  //       </CardContent>
  //     </Card>

  //     {bulkTasks.length > 0 && (
  //       <Card className="bg-white border border-gray-200 shadow-lg">
  //         <CardHeader>
  //           <CardTitle>Preview Uploaded Tasks</CardTitle>
  //           <CardDescription>
  //             Review and edit the tasks before uploading. You can remove or edit individual entries.
  //           </CardDescription>
  //         </CardHeader>
  //         <CardContent>
  //           <div className="overflow-x-auto">
  //             <table className="w-full border border-gray-200 rounded-lg">
  //               <thead className="bg-gray-50 border-b border-gray-200">
  //                 <tr>
  //                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
  //                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
  //                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
  //                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
  //                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Type</th>
  //                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
  //                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
  //                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
  //                 </tr>
  //               </thead>
  //               <tbody className="divide-y divide-gray-200">
  //                 {bulkTasks.map((task) => (
  //                   <tr key={task.id} className="hover:bg-gray-50">
  //                     <td className="px-4 py-3 text-sm text-gray-900">{task.serialNumber}</td>
  //                     <td className="px-4 py-3 text-sm">
  //                       {editingCell === `${task.id}-title` ? (
  //                         <div className="flex items-center space-x-2">
  //                           <Input
  //                             value={editValue}
  //                             onChange={(e) => setEditValue(e.target.value)}
  //                             className="h-8"
  //                           />
  //                           <Button
  //                             size="sm"
  //                             onClick={() => saveEdit(task.id, 'title')}
  //                             className="h-8 w-8 p-0"
  //                           >
  //                             <Save className="h-4 w-4" />
  //                           </Button>
  //                         </div>
  //                       ) : (
  //                         <span
  //                           className="cursor-pointer hover:bg-blue-50 px-2 py-1 rounded"
  //                           onClick={() => startEditing(task.id, 'title', task.title)}
  //                         >
  //                           {task.title}
  //                         </span>
  //                       )}
  //                     </td>
  //                     <td className="px-4 py-3 text-sm">
  //                       {editingCell === `${task.id}-state` ? (
  //                         <div className="flex items-center space-x-2">
  //                           <Input
  //                             value={editValue}
  //                             onChange={(e) => setEditValue(e.target.value)}
  //                             className="h-8"
  //                           />
  //                           <Button
  //                             size="sm"
  //                             onClick={() => saveEdit(task.id, 'state')}
  //                             className="h-8 w-8 p-0"
  //                           >
  //                             <Save className="h-4 w-4" />
  //                           </Button>
  //                         </div>
  //                       ) : (
  //                         <span
  //                           className="cursor-pointer hover:bg-blue-50 px-2 py-1 rounded"
  //                           onClick={() => startEditing(task.id, 'state', task.state)}
  //                         >
  //                           {task.state}
  //                         </span>
  //                       )}
  //                     </td>
  //                     <td className="px-4 py-3 text-sm">
  //                       {editingCell === `${task.id}-city` ? (
  //                         <div className="flex items-center space-x-2">
  //                           <Input
  //                             value={editValue}
  //                             onChange={(e) => setEditValue(e.target.value)}
  //                             className="h-8"
  //                           />
  //                           <Button
  //                             size="sm"
  //                             onClick={() => saveEdit(task.id, 'city')}
  //                             className="h-8 w-8 p-0"
  //                           >
  //                             <Save className="h-4 w-4" />
  //                           </Button>
  //                         </div>
  //                       ) : (
  //                         <span
  //                           className="cursor-pointer hover:bg-blue-50 px-2 py-1 rounded"
  //                           onClick={() => startEditing(task.id, 'city', task.city)}
  //                         >
  //                           {task.city}
  //                         </span>
  //                       )}
  //                     </td>
  //                     <td className="px-4 py-3 text-sm text-gray-900">{task.employeeType}</td>
  //                     <td className="px-4 py-3 text-sm text-gray-900">{task.assignedTo}</td>
  //                     <td className="px-4 py-3">
  //                       <Badge className={getPriorityColor(task.priority)}>
  //                         {task.priority}
  //                       </Badge>
  //                     </td>
  //                     <td className="px-4 py-3">
  //                       <Button
  //                         variant="ghost"
  //                         size="icon"
  //                         onClick={() => removeBulkTask(task.id)}
  //                         className="h-8 w-8 hover:bg-red-100"
  //                       >
  //                         <X className="h-4 w-4 text-red-600" />
  //                       </Button>
  //                     </td>
  //                   </tr>
  //                 ))}
  //               </tbody>
  //             </table>
  //           </div>
  //           <div className="mt-4 flex justify-end space-x-3">
  //             <Button variant="outline" onClick={() => setBulkTasks([])}>
  //               Cancel
  //             </Button>
  //             <Button onClick={uploadBulkTasks} className="bg-green-600 hover:bg-green-700 text-white">
  //               Upload {bulkTasks.length} Tasks
  //             </Button>
  //           </div>
  //         </CardContent>
  //       </Card>
  //     )}
  //   </div>
  // );

  const uniqueStates = [...new Set(tasks.map(task => task.state))];

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button className="bg-black hover:bg-gray-800 text-white border-0">
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white border-0">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="ongoing">In Progress</option>
            <option value="completed">Completed</option>
            <option value="escalated">Escalated</option>
          </select>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All States</option>
            {uniqueStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('kanban')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'kanban'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Kanban View
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'table'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setActiveTab('bulk')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bulk'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Bulk Upload
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'kanban' && <KanbanView />}
          {activeTab === 'table' && <TableView />}
          {activeTab === 'bulk' && <BulkUploadView />}
        </div>
      </div>
    </div>
  );
}