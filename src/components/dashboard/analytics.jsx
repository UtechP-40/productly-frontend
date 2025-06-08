"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  MapPin,
  Target,
  Zap,
  Shield,
  Settings,
  ChevronRight
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadialBarChart, RadialBar,Pie } from 'recharts';

export function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'performance', label: 'Performance', icon: <Target className="h-4 w-4" /> },
    { id: 'locations', label: 'Locations', icon: <MapPin className="h-4 w-4" /> },
    { id: 'agents', label: 'Agents', icon: <Users className="h-4 w-4" /> }
  ];

  const metrics = [
    {
      title: 'Task Completion Rate',
      value: '94.2%',
      change: '+5.2%',
      trend: 'up',
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'text-blue-600',
      target: 95
    },
    {
      title: 'Average Response Time',
      value: '2.4m',
      change: '-12%',
      trend: 'down',
      icon: <Clock className="h-6 w-6" />,
      color: 'text-blue-600',
      target: 180
    },
    {
      title: 'Active Field Agents',
      value: '24',
      change: '+8%',
      trend: 'up',
      icon: <Users className="h-6 w-6" />,
      color: 'text-blue-600',
      target: 30
    },
    {
      title: 'SLA Violations',
      value: '3',
      change: '-25%',
      trend: 'down',
      icon: <AlertTriangle className="h-6 w-6" />,
      color: 'text-blue-600',
      target: 0
    }
  ];

  const taskTrends = [
    { month: 'Jan', completed: 145, pending: 23, escalated: 5, total: 173 },
    { month: 'Feb', completed: 167, pending: 18, escalated: 3, total: 188 },
    { month: 'Mar', completed: 189, pending: 15, escalated: 7, total: 211 },
    { month: 'Apr', completed: 203, pending: 12, escalated: 4, total: 219 },
    { month: 'May', completed: 221, pending: 19, escalated: 2, total: 242 },
    { month: 'Jun', completed: 234, pending: 16, escalated: 6, total: 256 }
  ];

  const dailyActivity = [
    { hour: '00:00', agents: 5, tasks: 2 },
    { hour: '03:00', agents: 3, tasks: 1 },
    { hour: '06:00', agents: 8, tasks: 5 },
    { hour: '09:00', agents: 18, tasks: 15 },
    { hour: '12:00', agents: 24, tasks: 22 },
    { hour: '15:00', agents: 22, tasks: 19 },
    { hour: '18:00', agents: 15, tasks: 12 },
    { hour: '21:00', agents: 8, tasks: 6 }
  ];

  const performanceData = [
    { name: 'Marcus Rodriguez', efficiency: 98, tasks: 45, rating: 4.9 },
    { name: 'Emily Watson', efficiency: 95, tasks: 38, rating: 4.8 },
    { name: 'Sarah Johnson', efficiency: 92, tasks: 29, rating: 4.7 },
    { name: 'David Kim', efficiency: 89, tasks: 32, rating: 4.6 },
    { name: 'Lisa Chen', efficiency: 87, tasks: 28, rating: 4.5 },
    { name: 'Mike Thompson', efficiency: 85, tasks: 25, rating: 4.4 }
  ];

  const locationData = [
    { region: 'North', tasks: 89, agents: 8, efficiency: 94 },
    { region: 'South', tasks: 76, agents: 6, efficiency: 91 },
    { region: 'East', tasks: 65, agents: 5, efficiency: 88 },
    { region: 'West', tasks: 58, agents: 5, efficiency: 86 },
    { region: 'Central', tasks: 45, agents: 4, efficiency: 89 }
  ];

  const taskDistribution = [
    { name: 'Completed', value: 234, color: '#3B82F6' },
    { name: 'Pending', value: 16, color: '#6B7280' },
    { name: 'In Progress', value: 12, color: '#1D4ED8' },
    { name: 'Escalated', value: 6, color: '#1F2937' }
  ];

  const priorityDistribution = [
    { name: 'High', value: 45, color: '#1F2937' },
    { name: 'Medium', value: 78, color: '#3B82F6' },
    { name: 'Low', value: 89, color: '#9CA3AF' }
  ];

  const weeklyTrends = [
    { day: 'Mon', completed: 42, pending: 5, efficiency: 89 },
    { day: 'Tue', completed: 38, pending: 3, efficiency: 92 },
    { day: 'Wed', completed: 45, pending: 4, efficiency: 91 },
    { day: 'Thu', completed: 40, pending: 6, efficiency: 87 },
    { day: 'Fri', completed: 35, pending: 2, efficiency: 94 },
    { day: 'Sat', calculated: 28, pending: 1, efficiency: 96 },
    { day: 'Sun', completed: 20, pending: 1, efficiency: 95 }
  ];

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-3xl font-bold text-black mt-2">{metric.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium flex items-center ${
                      metric.trend === 'up' ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {metric.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {metric.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <div className={metric.color}>
                    {metric.icon}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-black">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Task Completion Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={taskTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="completed" 
                  stackId="1" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.8}
                />
                <Area 
                  type="monotone" 
                  dataKey="pending" 
                  stackId="1" 
                  stroke="#6B7280" 
                  fill="#6B7280" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="escalated" 
                  stackId="1" 
                  stroke="#1F2937" 
                  fill="#1F2937" 
                  fillOpacity={0.4}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-black">
              <PieChart className="h-5 w-5 mr-2 text-blue-600" />
              Task Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={taskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-black">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Daily Activity Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Bar dataKey="agents" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="tasks" fill="#1D4ED8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-black">
              <Target className="h-5 w-5 mr-2 text-blue-600" />
              Priority Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={priorityDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                >
                  {priorityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trends */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-black">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Weekly Performance Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="efficiency" 
                stroke="#1F2937" 
                strokeWidth={3}
                dot={{ fill: '#1F2937', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-black">Agent Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={performanceData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#666" />
                <YAxis dataKey="name" type="category" stroke="#666" width={120} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Bar dataKey="efficiency" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-black">Task Completion by Agent</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <RadialBarChart data={performanceData} innerRadius="30%" outerRadius="90%">
                <RadialBar dataKey="tasks" cornerRadius={10} fill="#3B82F6" />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-black">Performance Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceData.map((agent, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-black">{agent.name}</p>
                    <p className="text-sm text-gray-600">Rating: {agent.rating}/5.0</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Tasks</p>
                    <p className="font-bold text-black">{agent.tasks}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Efficiency</p>
                    <p className="font-bold text-blue-600">{agent.efficiency}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLocationsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-black">Regional Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="region" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Bar dataKey="tasks" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="agents" fill="#1F2937" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-black">Regional Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="region" stroke="#666" />
                <YAxis stroke="#666" domain={[80, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-black">Location Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {locationData.map((location, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-black mb-2">{location.region} Region</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tasks:</span>
                    <span className="font-medium text-black">{location.tasks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Agents:</span>
                    <span className="font-medium text-black">{location.agents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Efficiency:</span>
                    <span className="font-medium text-blue-600">{location.efficiency}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAgentsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Agents</p>
                <p className="text-3xl font-bold text-black">24</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Now</p>
                <p className="text-3xl font-bold text-black">18</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Efficiency</p>
                <p className="text-3xl font-bold text-black">91%</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-black">Agent Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceData.map((agent, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {agent.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-black">{agent.name}</p>
                    <p className="text-sm text-gray-600">Field Agent</p>
                  </div>
                </div>
                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Tasks</p>
                    <p className="font-bold text-black">{agent.tasks}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Efficiency</p>
                    <p className="font-bold text-blue-600">{agent.efficiency}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="font-bold text-black">{agent.rating}/5</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                    View Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-black">Analytics & Reports</h2>
            <p className="text-gray-600">Comprehensive performance insights and operational metrics</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex space-x-1 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'performance' && renderPerformanceTab()}
        {activeTab === 'locations' && renderLocationsTab()}
        {activeTab === 'agents' && renderAgentsTab()}
      </div>
    </div>
  );
}