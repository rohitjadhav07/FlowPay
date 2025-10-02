'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  ExternalLink,
  Download,
  Rocket,
  Code,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';

export function DeploymentGuide() {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      title: 'Install Aptos CLI',
      description: 'Install the Aptos command line interface',
      commands: [
        'curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3'
      ],
      links: [
        { text: 'Official Installation Guide', url: 'https://aptos.dev/tools/aptos-cli/' }
      ]
    },
    {
      title: 'Initialize Account',
      description: 'Create and fund your Aptos testnet account',
      commands: [
        'aptos init --network testnet',
        'aptos account fund-with-faucet --account default'
      ]
    },
    {
      title: 'Deploy Contracts',
      description: 'Compile and deploy FlowPay smart contracts',
      commands: [
        'aptos move compile --named-addresses flowpay=default',
        'aptos move test --named-addresses flowpay=default',
        'aptos move publish --named-addresses flowpay=default --assume-yes'
      ]
    },
    {
      title: 'Initialize Contracts',
      description: 'Initialize the deployed smart contracts',
      commands: [
        'aptos move run --function-id default::payment_router::initialize --assume-yes',
        'aptos move run --function-id default::forex_engine::initialize --assume-yes',
        'aptos move run --function-id default::treasury_vault::initialize --assume-yes'
      ]
    },
    {
      title: 'Update Environment',
      description: 'Update your .env.local file with contract addresses',
      commands: [
        'echo "NEXT_PUBLIC_FLOWPAY_PAYMENT_ROUTER=$(aptos account list --query balance --account default | grep -o \'0x[a-fA-F0-9]*\')" >> .env.local'
      ]
    }
  ];

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    toast.success('Command copied to clipboard!');
  };

  const markStepComplete = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
      toast.success(`Step ${stepIndex + 1} marked as complete!`);
    }
  };

  const runPowerShellScript = () => {
    toast.success('Run deploy-testnet.ps1 in PowerShell as Administrator');
  };

  const runBatchScript = () => {
    toast.success('Run deploy-testnet.bat in Command Prompt as Administrator');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Rocket className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Deploy FlowPay Contracts
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Deploy your FlowPay smart contracts to Aptos Testnet
        </p>
      </div>

      {/* Quick Deploy Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card cursor-pointer border-2 border-primary-200 dark:border-primary-800"
          onClick={runPowerShellScript}
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Terminal className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">PowerShell (Windows)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Run deploy-testnet.ps1</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card cursor-pointer border-2 border-primary-200 dark:border-primary-800"
          onClick={runBatchScript}
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Code className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Command Prompt (Windows)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Run deploy-testnet.bat</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Manual Steps */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Manual Deployment Steps
        </h3>

        <div className="space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border rounded-lg p-4 ${
                completedSteps.includes(index)
                  ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                  : activeStep === index
                  ? 'border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  completedSteps.includes(index)
                    ? 'bg-green-500 text-white'
                    : activeStep === index
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {completedSteps.includes(index) ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {step.title}
                    </h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setActiveStep(index)}
                        className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                      >
                        {activeStep === index ? 'Collapse' : 'Expand'}
                      </button>
                      {!completedSteps.includes(index) && (
                        <button
                          onClick={() => markStepComplete(index)}
                          className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {step.description}
                  </p>

                  {activeStep === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-3"
                    >
                      {step.commands.map((command, cmdIndex) => (
                        <div key={cmdIndex} className="relative">
                          <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-3 pr-12">
                            <code className="text-green-400 text-sm font-mono">
                              {command}
                            </code>
                          </div>
                          <button
                            onClick={() => copyCommand(command)}
                            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-200 transition-colors"
                            title="Copy command"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      {step.links && (
                        <div className="pt-2">
                          {step.links.map((link, linkIndex) => (
                            <a
                              key={linkIndex}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                            >
                              <span>{link.text}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Progress: {completedSteps.length} of {steps.length} steps completed
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
                />
              </div>
              <span className="text-primary-600 dark:text-primary-400 font-medium">
                {Math.round((completedSteps.length / steps.length) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {completedSteps.length === steps.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
        >
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100">
                Deployment Complete! 🎉
              </h3>
              <p className="text-green-700 dark:text-green-300 text-sm">
                Your FlowPay contracts are now live on Aptos Testnet. Restart your development server to use the deployed contracts.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}