import { useQuery } from '@tanstack/react-query'
import api from '../utils/api'
import { Link } from 'react-router-dom'
import { Trash2, Eye } from 'lucide-react'

const SavedBuildsPage = () => {
  const { data: buildsData, isLoading } = useQuery({
    queryKey: ['saved-builds'],
    queryFn: () => api.get('/pc-builder/saved')
  })

  const builds = buildsData?.data?.builds || []

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Saved PC Builds</h1>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card skeleton h-48" />
          ))}
        </div>
      ) : builds.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No saved builds yet</p>
          <Link to="/pc-builder" className="btn btn-primary">
            Start Building
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {builds.map((build: any) => (
            <div key={build._id} className="card">
              <h3 className="font-semibold mb-2 dark:text-white">{build.name}</h3>
              {build.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{build.description}</p>
              )}
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {Object.values(build.components).filter(Boolean).length} components
                </span>
                <span className="font-bold text-primary-600">${build.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex space-x-2">
                <Link
                  to={`/pc-builder`}
                  className="btn btn-outline flex-1 flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Link>
                <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded text-red-600">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              {!build.compatibility.isCompatible && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Compatibility issues detected
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SavedBuildsPage
