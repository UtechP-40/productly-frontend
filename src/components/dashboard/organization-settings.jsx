"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { 
  Settings, 
  Building, 
  Globe, 
  Shield, 
  Bell, 
  Users,
  Key,
  Database,
  Mail,
  Smartphone,
  Save,
  Upload,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';

export function OrganizationSettings() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [settings, setSettings] = useState({
    organization: {
      name: 'ACME Corporation',
      subdomain: 'acme',
      description: 'Leading provider of industrial solutions and field services',
      website: 'https://acme.com',
      industry: 'Manufacturing',
      size: '500-1000 employees'
    },
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      pushNotifications: true,
      weeklyReports: true,
      taskReminders: true,
      systemUpdates: false
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      passwordPolicy: 'strong',
      ipWhitelist: false,
      auditLogs: true
    },
    integrations: {
      apiKey: 'pk_live_51234567890abcdef...',
      webhookUrl: 'https://acme.com/webhooks/productly',
      slackIntegration: true,
      emailIntegration: true
    }
  });

  const handleSave = () => {
    // Save settings logic here
    console.log('Saving settings:', settings);
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Organization Settings</h2>
            <p className="text-gray-300">Manage your organization configuration and preferences</p>
          </div>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white border-0">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        {/* Organization Details */}
        <Card className="bg-white border border-gray-800 shadow-xl">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center text-black">
              <Building className="h-5 w-5 mr-2 text-blue-600" />
              Organization Details
            </CardTitle>
            <CardDescription className="text-gray-600">
              Basic information about your organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Organization Name</label>
                <Input
                  value={settings.organization.name}
                  onChange={(e) => setSettings({
                    ...settings,
                    organization: { ...settings.organization, name: e.target.value }
                  })}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Subdomain</label>
                <div className="flex">
                  <Input
                    value={settings.organization.subdomain}
                    onChange={(e) => setSettings({
                      ...settings,
                      organization: { ...settings.organization, subdomain: e.target.value }
                    })}
                    className="rounded-r-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <div className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-sm text-gray-600">
                    .productly.com
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">Description</label>
              <Textarea
                value={settings.organization.description}
                onChange={(e) => setSettings({
                  ...settings,
                  organization: { ...settings.organization, description: e.target.value }
                })}
                rows={3}
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Website</label>
                <Input
                  value={settings.organization.website}
                  onChange={(e) => setSettings({
                    ...settings,
                    organization: { ...settings.organization, website: e.target.value }
                  })}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Industry</label>
                <select
                  value={settings.organization.industry}
                  onChange={(e) => setSettings({
                    ...settings,
                    organization: { ...settings.organization, industry: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
                >
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Construction">Construction</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Technology">Technology</option>
                  <option value="Retail">Retail</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Company Size</label>
                <select
                  value={settings.organization.size}
                  onChange={(e) => setSettings({
                    ...settings,
                    organization: { ...settings.organization, size: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
                >
                  <option value="1-10 employees">1-10 employees</option>
                  <option value="11-50 employees">11-50 employees</option>
                  <option value="51-200 employees">51-200 employees</option>
                  <option value="201-500 employees">201-500 employees</option>
                  <option value="500-1000 employees">500-1000 employees</option>
                  <option value="1000+ employees">1000+ employees</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-white border border-gray-800 shadow-xl">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center text-black">
              <Bell className="h-5 w-5 mr-2 text-blue-600" />
              Notification Settings
            </CardTitle>
            <CardDescription className="text-gray-600">
              Configure how you receive notifications and alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-black">Email Alerts</h4>
                    <p className="text-sm text-gray-600">Receive important notifications via email</p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailAlerts}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, emailAlerts: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-black">SMS Alerts</h4>
                    <p className="text-sm text-gray-600">Get urgent notifications via SMS</p>
                  </div>
                  <Switch
                    checked={settings.notifications.smsAlerts}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, smsAlerts: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-black">Push Notifications</h4>
                    <p className="text-sm text-gray-600">Browser and mobile push notifications</p>
                  </div>
                  <Switch
                    checked={settings.notifications.pushNotifications}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, pushNotifications: checked }
                    })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-black">Weekly Reports</h4>
                    <p className="text-sm text-gray-600">Receive weekly performance summaries</p>
                  </div>
                  <Switch
                    checked={settings.notifications.weeklyReports}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, weeklyReports: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-black">Task Reminders</h4>
                    <p className="text-sm text-gray-600">Reminders for upcoming task deadlines</p>
                  </div>
                  <Switch
                    checked={settings.notifications.taskReminders}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, taskReminders: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-black">System Updates</h4>
                    <p className="text-sm text-gray-600">Notifications about system maintenance</p>
                  </div>
                  <Switch
                    checked={settings.notifications.systemUpdates}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, systemUpdates: checked }
                    })}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-white border border-gray-800 shadow-xl">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center text-black">
              <Shield className="h-5 w-5 mr-2 text-blue-600" />
              Security Settings
            </CardTitle>
            <CardDescription className="text-gray-600">
              Manage security policies and access controls
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-black">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Require 2FA for all users</p>
                  </div>
                  <Switch
                    checked={settings.security.twoFactorAuth}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      security: { ...settings.security, twoFactorAuth: checked }
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Session Timeout (minutes)</label>
                  <Input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
                    })}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Password Policy</label>
                  <select
                    value={settings.security.passwordPolicy}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, passwordPolicy: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
                  >
                    <option value="basic">Basic (8+ characters)</option>
                    <option value="strong">Strong (12+ chars, mixed case, numbers)</option>
                    <option value="enterprise">Enterprise (16+ chars, symbols required)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-black">IP Whitelist</h4>
                    <p className="text-sm text-gray-600">Restrict access to specific IP addresses</p>
                  </div>
                  <Switch
                    checked={settings.security.ipWhitelist}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      security: { ...settings.security, ipWhitelist: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-black">Audit Logs</h4>
                    <p className="text-sm text-gray-600">Keep detailed logs of user actions</p>
                  </div>
                  <Switch
                    checked={settings.security.auditLogs}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      security: { ...settings.security, auditLogs: checked }
                    })}
                  />
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-blue-600 mr-2" />
                    <h4 className="font-medium text-blue-900">Security Status</h4>
                  </div>
                  <p className="text-sm text-blue-800 mt-1">
                    Your organization has a strong security configuration
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API & Integrations */}
        <Card className="bg-white border border-gray-800 shadow-xl">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center text-black">
              <Key className="h-5 w-5 mr-2 text-blue-600" />
              API & Integrations
            </CardTitle>
            <CardDescription className="text-gray-600">
              Manage API access and third-party integrations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">API Key</label>
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Input
                    type={showApiKey ? 'text' : 'password'}
                    value={settings.integrations.apiKey}
                    readOnly
                    className="pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-600 hover:text-black"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <Button variant="outline" size="icon" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  Regenerate
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">Webhook URL</label>
              <Input
                value={settings.integrations.webhookUrl}
                onChange={(e) => setSettings({
                  ...settings,
                  integrations: { ...settings.integrations, webhookUrl: e.target.value }
                })}
                placeholder="https://your-domain.com/webhooks/productly"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-white">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-black">Slack Integration</h4>
                    <p className="text-sm text-gray-600">Send notifications to Slack</p>
                  </div>
                </div>
                <Switch
                  checked={settings.integrations.slackIntegration}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    integrations: { ...settings.integrations, slackIntegration: checked }
                  })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-white">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Smartphone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-black">Email Integration</h4>
                    <p className="text-sm text-gray-600">Email notifications and reports</p>
                  </div>
                </div>
                <Switch
                  checked={settings.integrations.emailIntegration}
                  onCheckedChange={(checked) => setSettings({
                    ...settings,
                    integrations: { ...settings.integrations, emailIntegration: checked }
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data & Storage */}
        <Card className="bg-white border border-gray-800 shadow-xl">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center text-black">
              <Database className="h-5 w-5 mr-2 text-blue-600" />
              Data & Storage
            </CardTitle>
            <CardDescription className="text-gray-600">
              Manage data retention and storage settings
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-black text-lg">2.4 GB</h4>
                <p className="text-sm text-gray-600">Storage Used</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '24%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">24% of 10 GB limit</p>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-black text-lg">1,247</h4>
                <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-xs text-gray-500 mt-1">Tasks, media, and logs</p>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-black text-lg">90 days</h4>
                <p className="text-sm text-gray-600">Data Retention</p>
                <p className="text-xs text-gray-500 mt-1">Automatic cleanup</p>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <Upload className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}