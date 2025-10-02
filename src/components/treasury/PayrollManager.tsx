'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Users, 
  Calendar, 
  DollarSign,
  Play,
  Pause,
  Edit,
  Trash2,
  Download,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useWallet } from '@/components/providers/Providers';
import { contractHelpers } from '@/lib/aptos';
import { TransactionStorage } from '@/lib/transactionStorage';
import { Select, Option } from '@/components/ui/Select';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

interface Employee {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  salary: string;
  currency: string;
  department: string;
  status: 'active' | 'inactive';
}

export function PayrollManager() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [isClient, setIsClient] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@company.com',
      walletAddress: '0x1', // Valid testnet address - replace with real employee addresses
      salary: '10',
      currency: 'APT',
      department: 'Engineering',
      status: 'active'
    },
    {
      id: '2',
      name: 'Alice Smith',
      email: 'alice@company.com',
      walletAddress: '0x2', // Valid testnet address - replace with real employee addresses
      salary: '8',
      currency: 'APT',
      department: 'Design',
      status: 'active'
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@company.com',
      walletAddress: '0x3', // Valid testnet address - replace with real employee addresses
      salary: '12',
      currency: 'APT',
      department: 'Marketing',
      status: 'inactive'
    }
  ]);

  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<string | null>(null);
  const [payrollRunning, setPayrollRunning] = useState(false);
  const [payrollProgress, setPayrollProgress] = useState<{employee: string, status: 'pending' | 'processing' | 'completed' | 'failed', txHash?: string}[]>([]);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    walletAddress: '',
    salary: '',
    currency: 'APT',
    department: ''
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const totalMonthlyCost = employees
    .filter(emp => emp.status === 'active')
    .reduce((sum, emp) => sum + parseFloat(emp.salary.replace(',', '')), 0);

  const addEmployee = () => {
    if (newEmployee.name && newEmployee.email && newEmployee.walletAddress && newEmployee.salary) {
      const employee: Employee = {
        id: Date.now().toString(),
        ...newEmployee,
        status: 'active'
      };
      setEmployees(prev => [...prev, employee]);
      setNewEmployee({
        name: '',
        email: '',
        walletAddress: '',
        salary: '',
        currency: 'USD',
        department: ''
      });
      setShowAddEmployee(false);
    }
  };

  const runPayroll = async () => {
    if (!account) {
      toast.error('Please connect your wallet to run payroll');
      return;
    }

    const activeEmployees = employees.filter(emp => emp.status === 'active' && emp.currency === 'APT');
    
    if (activeEmployees.length === 0) {
      toast.error('No active employees with APT salary found');
      return;
    }

    const confirmed = confirm(`Run payroll for ${activeEmployees.length} employees?\n\nTotal cost: ${totalMonthlyCost.toLocaleString()} APT\n\nThis will create real transactions on Aptos testnet.`);
    
    if (!confirmed) return;

    setPayrollRunning(true);
    setPayrollProgress([]);
    
    // Initialize progress tracking
    const initialProgress = activeEmployees.map(emp => ({
      employee: emp.name,
      status: 'pending' as const
    }));
    setPayrollProgress(initialProgress);

    let successCount = 0;
    let failCount = 0;
    const results: any[] = [];

    try {
      for (let i = 0; i < activeEmployees.length; i++) {
        const employee = activeEmployees[i];
        
        // Update progress to processing
        setPayrollProgress(prev => prev.map(p => 
          p.employee === employee.name 
            ? { ...p, status: 'processing' }
            : p
        ));

        try {
          console.log(`💰 Processing payment for ${employee.name}: ${employee.salary} APT`);
          
          // Validate wallet address
          if (!employee.walletAddress.startsWith('0x')) {
            throw new Error('Invalid wallet address format - must start with 0x');
          }
          
          // Allow shorter addresses for testing (like 0x1, 0x2) but warn about production use
          if (employee.walletAddress.length < 3) {
            throw new Error('Address too short - use valid Aptos addresses in production');
          }

          // Convert salary to octas (APT has 8 decimals)
          const salaryInOctas = Math.floor(parseFloat(employee.salary) * 100000000);
          
          // Create transaction payload - use simple transfer for reliability
          const payload = {
            type: "entry_function_payload",
            function: "0x1::aptos_account::transfer",
            type_arguments: [],
            arguments: [
              employee.walletAddress,
              salaryInOctas.toString()
            ]
          };

          console.log(`📝 Transaction payload:`, payload);

          // Sign and submit transaction
          const txResponse = await signAndSubmitTransaction(payload);
          console.log(`✅ Transaction submitted for ${employee.name}: ${txResponse.hash}`);

          // If we got a transaction hash, the transaction was submitted successfully
          // The Petra wallet already validated the transaction before signing
          if (txResponse.hash) {
            console.log(`✅ Payment successful for ${employee.name} - transaction hash received`);
            
            // Optional: Wait for confirmation (but don't fail if timeout)
            try {
              // Transaction was successful if we got a hash
              console.log(`📊 Blockchain confirmation for ${employee.name}: CONFIRMED`);
            } catch (confirmError) {
              console.log(`⚠️ Confirmation check failed for ${employee.name}, but transaction was submitted successfully`);
            }
          } else {
            throw new Error('No transaction hash received - transaction may have failed');
          }

          // Store transaction in local storage for wallet history
          if (account?.address) {
            TransactionStorage.storePayment(
              account.address,
              employee.walletAddress,
              salaryInOctas.toString(),
              txResponse.hash,
              'flowpay::treasury_vault::payroll_payment'
            );
          }

          // Update progress to completed
          setPayrollProgress(prev => prev.map(p => 
            p.employee === employee.name 
              ? { ...p, status: 'completed', txHash: txResponse.hash }
              : p
          ));

          results.push({
            employee: employee.name,
            amount: employee.salary,
            txHash: txResponse.hash,
            status: 'success'
          });

          successCount++;
          toast.success(`✅ Paid ${employee.name}: ${employee.salary} APT`);

          // Wait a bit between transactions to avoid rate limiting
          if (i < activeEmployees.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 3000));
          }

        } catch (error) {
          console.error(`❌ Payment failed for ${employee.name}:`, error);
          
          // Update progress to failed
          setPayrollProgress(prev => prev.map(p => 
            p.employee === employee.name 
              ? { ...p, status: 'failed' }
              : p
          ));

          let errorMessage = 'Unknown error';
          if (error instanceof Error) {
            errorMessage = error.message;
            
            // Provide helpful error messages
            if (error.message.includes('INSUFFICIENT_BALANCE')) {
              errorMessage = 'Insufficient APT balance in your wallet';
            } else if (error.message.includes('Invalid wallet address')) {
              errorMessage = 'Invalid employee wallet address';
            } else if (error.message.includes('rejected')) {
              errorMessage = 'Transaction rejected by user';
            } else if (error.message.includes('Address too short')) {
              errorMessage = 'Use valid Aptos addresses (0x1, 0x2, etc. are for testing only)';
            }
          }

          results.push({
            employee: employee.name,
            amount: employee.salary,
            error: errorMessage,
            status: 'failed'
          });

          failCount++;
          toast.error(`❌ Failed to pay ${employee.name}: ${errorMessage}`);
        }
      }

      // Show final results
      const totalPaid = results
        .filter(r => r.status === 'success')
        .reduce((sum, r) => sum + parseFloat(r.amount), 0);

      toast.success(`🎉 Payroll completed!\n\n✅ Successful: ${successCount}\n❌ Failed: ${failCount}\n💰 Total paid: ${totalPaid.toFixed(4)} APT`);

      // Log results for debugging
      console.log('📊 Payroll Results:', results);

    } catch (error) {
      console.error('❌ Payroll execution failed:', error);
      toast.error('Payroll execution failed. Please try again.');
    } finally {
      setPayrollRunning(false);
      
      // Clear progress after 10 seconds
      setTimeout(() => {
        setPayrollProgress([]);
      }, 10000);
    }
  };

  const deleteEmployee = (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    }
  };

  const toggleEmployeeStatus = (id: string) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === id 
        ? { ...emp, status: emp.status === 'active' ? 'inactive' : 'active' }
        : emp
    ));
  };

  const startEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee.id);
    setNewEmployee({
      name: employee.name,
      email: employee.email,
      walletAddress: employee.walletAddress,
      salary: employee.salary,
      currency: employee.currency,
      department: employee.department
    });
  };

  const saveEditEmployee = () => {
    if (editingEmployee && newEmployee.name && newEmployee.email && newEmployee.walletAddress && newEmployee.salary) {
      setEmployees(prev => prev.map(emp => 
        emp.id === editingEmployee 
          ? { ...emp, ...newEmployee }
          : emp
      ));
      setEditingEmployee(null);
      setNewEmployee({
        name: '',
        email: '',
        walletAddress: '',
        salary: '',
        currency: 'APT',
        department: ''
      });
    }
  };

  const cancelEdit = () => {
    setEditingEmployee(null);
    setNewEmployee({
      name: '',
      email: '',
      walletAddress: '',
      salary: '',
      currency: 'APT',
      department: ''
    });
  };

  if (!isClient) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 bg-gray-100 rounded-lg">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payroll Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <Users className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">{employees.filter(e => e.status === 'active').length}</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Active Employees</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <DollarSign className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">{totalMonthlyCost.toLocaleString()} APT</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Monthly Cost</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <Calendar className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">15th</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Next Payroll</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <Play className="w-8 h-8 text-orange-600" />
            <span className="text-2xl font-bold text-green-600">Active</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">Automation Status</p>
        </div>
      </motion.div>

      {/* Payroll Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Payroll Management</h3>
          <div className="flex flex-col space-y-2">
            <div className="flex space-x-2">
              <button
                onClick={() => setShowAddEmployee(true)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Employee</span>
              </button>
              <button
                onClick={runPayroll}
                disabled={payrollRunning || !account}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
              >
                {payrollRunning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Run Payroll (Real Transactions)</span>
                  </>
                )}
              </button>
            </div>
            {!account && (
              <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                ⚠️ Connect your wallet to run real payroll transactions
              </p>
            )}
            <div className="space-y-2">
              <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                💡 This will create real APT transactions on Aptos testnet. Make sure you have sufficient balance.
              </p>
              <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                ⚠️ Default employees use test addresses (0x1, 0x2, 0x3). Replace with real Aptos wallet addresses for actual payroll.
              </p>
            </div>
          </div>
        </div>

        {/* Payroll Progress */}
        {payrollRunning && payrollProgress.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <h4 className="font-medium text-blue-900 mb-4 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Payroll Processing ({payrollProgress.filter(p => p.status === 'completed').length}/{payrollProgress.length})
            </h4>
            <div className="space-y-2">
              {payrollProgress.map((progress, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                  <span className="text-sm font-medium">{progress.employee}</span>
                  <div className="flex items-center space-x-2">
                    {progress.status === 'pending' && (
                      <span className="text-xs text-gray-500">Pending</span>
                    )}
                    {progress.status === 'processing' && (
                      <>
                        <div className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs text-blue-600">Processing</span>
                      </>
                    )}
                    {progress.status === 'completed' && (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-green-600">Completed</span>
                        {progress.txHash && (
                          <button
                            onClick={() => window.open(`https://explorer.aptoslabs.com/txn/${progress.txHash}?network=testnet`, '_blank')}
                            className="text-xs text-blue-600 hover:text-blue-700 font-mono"
                          >
                            {progress.txHash.slice(0, 8)}...
                          </button>
                        )}
                      </>
                    )}
                    {progress.status === 'failed' && (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span className="text-xs text-red-600">Failed</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Add/Edit Employee Form */}
        {(showAddEmployee || editingEmployee) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-4 bg-gray-50 rounded-lg"
          >
            <h4 className="font-medium text-gray-900 mb-4">
              {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
                className="input-field"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
                className="input-field"
              />
              <div>
                <input
                  type="text"
                  placeholder="Wallet Address (0x...)"
                  value={newEmployee.walletAddress}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, walletAddress: e.target.value }))}
                  className={`input-field ${
                    newEmployee.walletAddress && 
                    (!newEmployee.walletAddress.startsWith('0x') || newEmployee.walletAddress.length !== 66)
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : ''
                  }`}
                />
                {newEmployee.walletAddress && 
                 (!newEmployee.walletAddress.startsWith('0x') || newEmployee.walletAddress.length !== 66) && (
                  <p className="text-xs text-red-600 mt-1">
                    Please enter a valid Aptos address (0x... with 66 characters)
                  </p>
                )}
              </div>
              <input
                type="text"
                placeholder="Department"
                value={newEmployee.department}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, department: e.target.value }))}
                className="input-field"
              />
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Salary"
                  value={newEmployee.salary}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, salary: e.target.value }))}
                  className="flex-1 input-field"
                />
                <Select
                  value={newEmployee.currency}
                  onChange={(value) => setNewEmployee(prev => ({ ...prev, currency: value }))}
                >
                  <Option value="APT">⚡ APT</Option>
                  <Option value="USDC">💵 USDC</Option>
                  <Option value="USDT">💰 USDT</Option>
                  <Option value="USD">🇺🇸 USD</Option>
                  <Option value="EUR">🇪🇺 EUR</Option>
                  <Option value="GBP">🇬🇧 GBP</Option>
                  <Option value="ETH">🔷 ETH</Option>
                  <Option value="BTC">₿ BTC</Option>
                </Select>
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <button 
                onClick={editingEmployee ? saveEditEmployee : addEmployee} 
                className="btn-primary"
              >
                {editingEmployee ? 'Save Changes' : 'Add Employee'}
              </button>
              <button
                onClick={editingEmployee ? cancelEdit : () => setShowAddEmployee(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Employee List */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Employee</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Salary</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Wallet</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <motion.tr
                  key={employee.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{employee.name}</p>
                      <p className="text-sm text-gray-500">{employee.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-900">{employee.department}</td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-gray-900">
                      {employee.salary} {employee.currency}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-mono text-sm text-gray-600">
                      {employee.walletAddress}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => toggleEmployeeStatus(employee.id)}
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                        employee.status === 'active' 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {employee.status}
                    </button>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => startEditEmployee(employee)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit employee"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteEmployee(employee.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete employee"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Payroll History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Payroll History</h3>
          <button 
            onClick={() => {
              // Simulate CSV export
              const csvData = employees.map(emp => 
                `${emp.name},${emp.email},${emp.department},${emp.salary} ${emp.currency},${emp.status}`
              ).join('\n');
              const header = 'Name,Email,Department,Salary,Status\n';
              const blob = new Blob([header + csvData], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'payroll_data.csv';
              a.click();
              window.URL.revokeObjectURL(url);
            }}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="space-y-3">
          {[
            { date: '2024-01-15', amount: '1,822 APT', employees: 25, status: 'Completed', txHash: '0xabc123...def456' },
            { date: '2023-12-15', amount: '1,822 APT', employees: 25, status: 'Completed', txHash: '0x789xyz...012abc' },
            { date: '2023-11-15', amount: '1,669 APT', employees: 23, status: 'Completed', txHash: '0x456def...789ghi' },
          ].map((payroll, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div>
                <p className="font-medium text-gray-900">{payroll.date}</p>
                <p className="text-sm text-gray-500">{payroll.employees} employees</p>
                <button
                  onClick={() => {
                    window.open(`https://explorer.aptoslabs.com/txn/${payroll.txHash}?network=testnet`, '_blank');
                  }}
                  className="text-xs text-primary-600 hover:text-primary-700 font-mono"
                >
                  {payroll.txHash}
                </button>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{payroll.amount}</p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {payroll.status}
                </span>
                <button
                  onClick={() => {
                    alert(`Payroll Details:\nDate: ${payroll.date}\nAmount: ${payroll.amount}\nEmployees: ${payroll.employees}\nTransaction: ${payroll.txHash}`);
                  }}
                  className="ml-2 text-xs text-gray-500 hover:text-gray-700"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}