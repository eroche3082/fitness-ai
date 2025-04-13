import React, { useState, useEffect } from 'react';
import userService from '../lib/userService';
import { LeadInfo } from '../lib/userService';

const AdminPanel: React.FC = () => {
  const [leads, setLeads] = useState<LeadInfo[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<LeadInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [showExportModal, setShowExportModal] = useState(false);

  // Fetch leads on component mount
  useEffect(() => {
    const allLeads = userService.getLeads();
    setLeads(allLeads);
    setFilteredLeads(allLeads);
  }, []);

  // Apply filters whenever filter settings or search term changes
  useEffect(() => {
    let result = [...leads];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(lead => 
        lead.name.toLowerCase().includes(term) || 
        lead.email.toLowerCase().includes(term) ||
        lead.uniqueCode.toLowerCase().includes(term)
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(lead => lead.category === categoryFilter);
    }
    
    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const daysAgo = parseInt(dateFilter);
      const cutoffDate = new Date(now.setDate(now.getDate() - daysAgo));
      
      result = result.filter(lead => {
        const leadDate = new Date(lead.date);
        return leadDate >= cutoffDate;
      });
    }
    
    setFilteredLeads(result);
  }, [searchTerm, categoryFilter, dateFilter, leads]);
  
  // Handle export to CSV
  const handleExportCSV = () => {
    // Create CSV content
    const headers = ['Name', 'Email', 'Code', 'Category', 'Date', 'Source'];
    const rows = filteredLeads.map(lead => [
      lead.name,
      lead.email,
      lead.uniqueCode,
      lead.category,
      lead.date,
      lead.source
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create a download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `fitness_ai_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    
    // Trigger download and clean up
    link.click();
    document.body.removeChild(link);
    setShowExportModal(false);
  };

  return (
    <div className="admin-panel p-4 md:p-6 max-w-6xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <h1 className="text-2xl font-bold mb-4">Admin Panel - Lead Management</h1>
        
        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by name, email, or code"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="BEG">Beginner</option>
              <option value="INT">Intermediate</option>
              <option value="ADV">Advanced</option>
              <option value="PRO">Professional</option>
              <option value="VIP">VIP</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Date Range</label>
            <select
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-sm font-medium">
              {filteredLeads.length} 
              {filteredLeads.length === 1 ? ' lead ' : ' leads '} 
              found
            </span>
          </div>
          
          <div>
            <button
              onClick={() => setShowExportModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Export Data
            </button>
          </div>
        </div>
        
        {/* Leads Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {lead.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {lead.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                      {lead.uniqueCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium 
                        ${lead.category === 'BEG' ? 'bg-green-100 text-green-800' : ''}
                        ${lead.category === 'INT' ? 'bg-blue-100 text-blue-800' : ''}
                        ${lead.category === 'ADV' ? 'bg-purple-100 text-purple-800' : ''}
                        ${lead.category === 'PRO' ? 'bg-orange-100 text-orange-800' : ''}
                        ${lead.category === 'VIP' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {lead.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(lead.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {lead.source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No leads found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Export Lead Data</h2>
            
            <p className="mb-4">
              You are about to export {filteredLeads.length} leads as a CSV file.
              This file will contain all user information including names, emails, and codes.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={handleExportCSV}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Export as CSV
              </button>
              
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;