"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { 
  Upload, 
  FileText, 
  Brain, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Download,
  Trash2,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Database,
  MessageSquare,
  BookOpen,
  Zap
} from 'lucide-react';

// Mock training data
const trainingDocuments = [
  {
    id: '1',
    name: 'Safety_Protocols_2024.pdf',
    type: 'PDF',
    size: '2.4 MB',
    uploadDate: '2024-01-10',
    status: 'processed',
    accuracy: 95,
    chunks: 45
  },
  {
    id: '2',
    name: 'Equipment_Manual_v3.docx',
    type: 'DOCX',
    size: '1.8 MB',
    uploadDate: '2024-01-09',
    status: 'processing',
    accuracy: null,
    chunks: null
  },
  {
    id: '3',
    name: 'Quality_Standards.csv',
    type: 'CSV',
    size: '856 KB',
    uploadDate: '2024-01-08',
    status: 'failed',
    accuracy: null,
    chunks: null,
    error: 'Invalid format detected'
  },
  {
    id: '4',
    name: 'Training_Guidelines.pdf',
    type: 'PDF',
    size: '3.2 MB',
    uploadDate: '2024-01-07',
    status: 'processed',
    accuracy: 88,
    chunks: 67
  }
];

const manualFAQs = [
  {
    id: '1',
    question: 'What are the safety requirements for site inspections?',
    answer: 'All site inspections require proper PPE including hard hat, safety vest, steel-toed boots, and safety glasses. Additionally, a safety checklist must be completed before entering any work area.',
    category: 'Safety',
    lastUpdated: '2024-01-10'
  },
  {
    id: '2',
    question: 'How do I report equipment malfunctions?',
    answer: 'Equipment malfunctions should be reported immediately through the mobile app using the "Report Issue" feature. Include photos, location, and detailed description of the problem.',
    category: 'Equipment',
    lastUpdated: '2024-01-09'
  },
  {
    id: '3',
    question: 'What is the escalation process for urgent issues?',
    answer: 'For urgent issues: 1) Mark task as "Escalated" in the app, 2) Call the emergency hotline, 3) Notify your direct supervisor, 4) Document all actions taken.',
    category: 'Process',
    lastUpdated: '2024-01-08'
  }
];

export default function AITrainerModule() {
  const [activeTab, setActiveTab] = useState('documents');
  const [searchQuery, setSearchQuery] = useState('');
  const [newFAQ, setNewFAQ] = useState({ question: '', answer: '', category: '' });
  const [isRetraining, setIsRetraining] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'processed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'processing':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'failed':
        return 'bg-gray-200 text-black border-gray-400';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processed':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
        return <Clock className="h-4 w-4" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleRetrain = () => {
    setIsRetraining(true);
    // Simulate retraining process
    setTimeout(() => {
      setIsRetraining(false);
    }, 3000);
  };

  const stats = [
    {
      title: 'Total Documents',
      value: trainingDocuments.length,
      icon: <FileText className="h-5 w-5" />,
      color: 'text-blue-600'
    },
    {
      title: 'Processed Successfully',
      value: trainingDocuments.filter(doc => doc.status === 'processed').length,
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'text-blue-600'
    },
    {
      title: 'Manual FAQs',
      value: manualFAQs.length,
      icon: <MessageSquare className="h-5 w-5" />,
      color: 'text-blue-600'
    },
    {
      title: 'AI Accuracy',
      value: '92%',
      icon: <Brain className="h-5 w-5" />,
      color: 'text-blue-600'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-black">AI Assistant Trainer</h2>
            <p className="text-gray-600">Manage training data and improve AI responses</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleRetrain}
              disabled={isRetraining}
              className="bg-blue-600 hover:bg-blue-700 text-white border-0"
            >
              {isRetraining ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Retraining...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Retrain AI
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-black">{stat.value}</p>
                  </div>
                  <div className={`p-2 bg-blue-50 rounded-lg ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Training Progress */}
        {isRetraining && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-black mb-2">AI Retraining in Progress</h3>
                  <Progress value={65} className="mb-2" />
                  <p className="text-sm text-gray-600">Processing documents and updating knowledge base...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'documents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="h-4 w-4 inline mr-2" />
              Training Documents
            </button>
            <button
              onClick={() => setActiveTab('faqs')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'faqs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MessageSquare className="h-4 w-4 inline mr-2" />
              Manual FAQs
            </button>
            <button
              onClick={() => setActiveTab('dataset')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dataset'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Database className="h-4 w-4 inline mr-2" />
              Dataset Browser
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            {/* Upload Section */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-black">
                  <Upload className="h-5 w-5 mr-2 text-blue-600" />
                  Upload Training Documents
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Upload PDF, DOCX, or CSV files to train the AI assistant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-black mb-2">Drop files here or click to upload</h3>
                  <p className="text-gray-500 mb-4">Supports PDF, DOCX, CSV files up to 10MB</p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Choose Files
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Documents List */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-black">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    Training Documents
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64 border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trainingDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-black">{doc.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span>{doc.type} • {doc.size}</span>
                            <span>Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</span>
                            {doc.chunks && <span>{doc.chunks} chunks</span>}
                          </div>
                          {doc.error && (
                            <p className="text-sm text-gray-700 mt-1">{doc.error}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        {doc.accuracy && (
                          <div className="text-right">
                            <p className="text-sm font-medium text-black">{doc.accuracy}%</p>
                            <p className="text-xs text-gray-500">Accuracy</p>
                          </div>
                        )}
                        
                        <Badge className={getStatusColor(doc.status)}>
                          {getStatusIcon(doc.status)}
                          <span className="ml-1 capitalize">{doc.status}</span>
                        </Badge>
                        
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 hover:text-black hover:bg-gray-100">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'faqs' && (
          <div className="space-y-6">
            {/* Add FAQ Form */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-black">
                  <Plus className="h-5 w-5 mr-2 text-blue-600" />
                  Add Manual FAQ
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Create custom Q&A pairs to improve AI responses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Question</label>
                  <Input
                    placeholder="Enter the question..."
                    value={newFAQ.question}
                    onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
                    className="border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Answer</label>
                  <Textarea
                    placeholder="Enter the detailed answer..."
                    value={newFAQ.answer}
                    onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
                    rows={4}
                    className="border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Category</label>
                  <Input
                    placeholder="e.g., Safety, Equipment, Process..."
                    value={newFAQ.category}
                    onChange={(e) => setNewFAQ({ ...newFAQ, category: e.target.value })}
                    className="border-gray-300"
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add FAQ
                </Button>
              </CardContent>
            </Card>

            {/* FAQs List */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-black">
                  <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                  Manual FAQs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {manualFAQs.map((faq) => (
                    <div key={faq.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-black mb-2">{faq.question}</h4>
                          <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600 hover:text-black hover:bg-gray-100">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <Badge variant="outline" className="border-gray-300 text-gray-700">{faq.category}</Badge>
                        <span className="text-gray-500">Updated: {new Date(faq.lastUpdated).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'dataset' && (
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-black">
                <Database className="h-5 w-5 mr-2 text-blue-600" />
                Dataset Browser
              </CardTitle>
              <CardDescription className="text-gray-600">
                Browse and manage the AI training dataset
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center bg-blue-50 rounded-lg border-2 border-dashed border-blue-200">
                <div className="text-center">
                  <Database className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-black mb-2">Dataset Browser</h3>
                  <p className="text-gray-600 mb-4">Interactive dataset exploration will be displayed here</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-semibold text-black">1,247</p>
                      <p className="text-gray-500">Training Examples</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-black">89</p>
                      <p className="text-gray-500">Categories</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}