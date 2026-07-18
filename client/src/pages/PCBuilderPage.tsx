import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../utils/api'
import { Cpu, Monitor, HardDrive, Zap, Shield, Box, Fan } from 'lucide-react'

const componentIcons: Record<string, any> = {
  cpu: Cpu,
  motherboard: Box,
  gpu: Monitor,
  ram: Zap,
  ssd: HardDrive,
  hdd: HardDrive,
  psu: Shield,
  'cpu-cooler': Fan,
  case: Box,
}

const PCBuilderPage = () => {
  const [selectedComponents, setSelectedComponents] = useState<Record<string, string>>({})
  const [selectedType, setSelectedType] = useState('cpu')

  const { data: productsData } = useQuery({
    queryKey: ['components', selectedType],
    queryFn: () => api.get('/pc-builder/compatible', {
      params: { componentType: selectedType }
    }),
    enabled: !!selectedType
  })

  const components = productsData?.data?.components || []

  const componentTypes = [
    { id: 'cpu', name: 'CPU' },
    { id: 'motherboard', name: 'Motherboard' },
    { id: 'gpu', name: 'Graphics Card' },
    { id: 'ram', name: 'Memory' },
    { id: 'ssd', name: 'SSD' },
    { id: 'hdd', name: 'HDD' },
    { id: 'psu', name: 'Power Supply' },
    { id: 'cpu-cooler', name: 'CPU Cooler' },
    { id: 'case', name: 'Case' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 dark:text-white">PC Builder</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Component Selection */}
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Select Component</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {componentTypes.map((type) => {
                const Icon = componentIcons[type.id]
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      selectedType === type.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{type.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {components.map((product: any) => (
              <div
                key={product._id}
                onClick={() => setSelectedComponents({ ...selectedComponents, [selectedType]: product._id })}
                className={`card cursor-pointer transition-all ${
                  selectedComponents[selectedType] === product._id
                    ? 'ring-2 ring-primary-600'
                    : 'hover:shadow-lg'
                }`}
              >
                <div className="aspect-square bg-gray-100 dark:bg-gray-700 mb-4 flex items-center justify-center">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <div className="text-gray-400">No Image</div>
                  )}
                </div>
                <h3 className="font-semibold mb-2 dark:text-white line-clamp-2">{product.name}</h3>
                <p className="text-primary-600 font-bold">${product.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Build Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Your Build</h2>
            <div className="space-y-3 mb-6">
              {componentTypes.map((type) => {
                const selectedId = selectedComponents[type.id]
                const selectedProduct = components.find((p: any) => p._id === selectedId)
                const Icon = componentIcons[type.id]
                
                return (
                  <div key={type.id} className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{type.name}</p>
                      {selectedProduct ? (
                        <p className="font-medium dark:text-white text-sm">{selectedProduct.name}</p>
                      ) : (
                        <p className="text-sm text-gray-400">Not selected</p>
                      )}
                    </div>
                    {selectedProduct && (
                      <span className="text-sm font-bold text-primary-600">${selectedProduct.price}</span>
                    )}
                  </div>
                )
              })}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg dark:text-white">
                <span>Total</span>
                <span className="text-primary-600">
                  ${Object.values(selectedComponents).reduce((sum, id) => {
                    const product = components.find((p: any) => p._id === id)
                    return sum + (product?.price || 0)
                  }, 0).toFixed(2)}
                </span>
              </div>
            </div>

            <button className="btn btn-primary w-full mt-4">
              Save Build
            </button>
            <button className="btn btn-outline w-full mt-2">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PCBuilderPage
