import { Music } from 'lucide-react';
import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-200 dark:bg-purple-800 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="text-3xl">
                <span>240</span>
              </div>
              <div className="bg-purple-600 rounded-md h-10 w-10 flex justify-center items-center">
                <Music className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="border border-gray-300 dark:border-purple-500 -mx-4 mt-4"></div>
            <div className="text-md mt-2 font-bold">
              New Subscribers (Monthly)
            </div>
          </div>

          <div className="bg-gray-200 dark:bg-purple-800 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="text-3xl">
                <span>124</span>
              </div>
              <div className="bg-purple-600 rounded-md h-10 w-10 flex justify-center items-center">
                <Music className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="border border-gray-300 dark:border-purple-500 -mx-4 mt-4"></div>
            <div className="text-md mt-2 font-bold">
              Trending Music (Weekly)
            </div>
          </div>

          <div className="bg-gray-200 dark:bg-purple-800 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="text-3xl">
                <span>156</span>
              </div>
              <div className="bg-purple-600 rounded-md h-10 w-10 flex justify-center items-center">
                <Music className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="border border-gray-300 dark:border-purple-500 -mx-4 mt-4"></div>
            <div className="text-md mt-2 font-bold">
              Trending Artists (Weekly)
            </div>
          </div>

          <div className="bg-gray-200 dark:bg-purple-800 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="text-3xl">
                <span>1200</span>
              </div>
              <div className="bg-purple-600 rounded-md h-10 w-10 flex justify-center items-center">
                <Music className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="border border-gray-300 dark:border-purple-500 -mx-4 mt-4"></div>
            <div className="text-md mt-2 font-bold">Downloads (Weekly)</div>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-lg font-semibold dark:text-purple-500  mb-2">
            Featured Music
          </div>
          <div className="bg-gray-200 p-4 rounded-lg">
            <table>
                <thead>
                    <tr>
                         <td>Title</td>
              <td>Artist</td>
              <td>Downloads</td>
                    </tr>
                </thead>

                <tbody>
                    <tr className='flex gap-4'>
                        <td>Savage Love (Good morning america)</td>
                        <td>Jason derulo</td>
                        <td>200</td>
                    </tr>
                </tbody>
            </table>
            <div className="flex gap-6 items-center mt-2 text-md font-semibold">
             
            </div>
            <div className="border border-gray-300 dark:border-purple-500 -mx-4 mt-2" />
            <div className="flex gap-6 items-center mt-2 text-md font-semibold">
           
            </div>
          </div>        
        </div>
      </div>
    </div>
  );
}
