import React from 'react';
import WithLayout from '@/Components/WithLayout';

interface ExampleProps {
  role?: string;
}

export default function Example({ role }: ExampleProps) {
  // Determine which roles can access this page
  const allowedRoles = role ? [role] : ['admin', 'artist', 'listener'];
  
  return (
    <WithLayout 
      title="Example Page"
      allowedRoles={allowedRoles}
      renderHeader={() => (
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Example Page {role ? `for ${role}` : ''}
        </h2>
      )}
    >
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Using WithLayout Component
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This is an example page that demonstrates how to use the WithLayout component.
              The WithLayout component automatically selects the appropriate layout based on the user's role.
            </p>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Example Code:</h4>
              <pre className="bg-gray-800 text-gray-100 p-4 rounded overflow-x-auto text-sm">
{`import React from 'react';
import WithLayout from '@/Components/WithLayout';

export default function MyPage() {
  return (
    <WithLayout 
      title="My Page"
      allowedRoles={['admin', 'artist', 'listener']}
    >
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Your content here */}
        </div>
      </div>
    </WithLayout>
  );
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </WithLayout>
  );
}
