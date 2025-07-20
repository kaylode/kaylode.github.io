'use client'

import { useState } from 'react'

export default function FileUploadManager() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setLoading(true)
    setUploadStatus('Uploading...')

    try {
      // For now, just create a file record without actual upload
      // In a real implementation, you'd upload to cloud storage first
      const fileData = {
        filename: `${Date.now()}-${file.name}`,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        path: `/uploads/${Date.now()}-${file.name}`,
        category: file.type.includes('pdf') ? 'pdf' : 
                 file.type.includes('image') ? 'image' : 'document',
        description: `Uploaded file: ${file.name}`,
        isPublic: true
      }

      const response = await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fileData)
      })

      if (response.ok) {
        const newFile = await response.json()
        setFiles(prev => [newFile, ...prev])
        setUploadStatus('Upload successful!')
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      setUploadStatus('Upload failed: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/files')
      if (response.ok) {
        const fileList = await response.json()
        setFiles(fileList)
      }
    } catch (error) {
      console.error('Error fetching files:', error)
    }
  }

  const deleteFile = async (fileId) => {
    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setFiles(prev => prev.filter(f => f.id !== fileId))
        setUploadStatus('File deleted successfully')
      }
    } catch (error) {
      setUploadStatus('Delete failed: ' + error.message)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">File Management</h2>
      
      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Upload File</h3>
        <input
          type="file"
          onChange={handleFileUpload}
          disabled={loading}
          className="mb-4 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        {uploadStatus && (
          <p className={`text-sm ${uploadStatus.includes('failed') ? 'text-red-600' : 'text-green-600'}`}>
            {uploadStatus}
          </p>
        )}
      </div>

      {/* Files List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Uploaded Files</h3>
          <button
            onClick={fetchFiles}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh
          </button>
        </div>

        {files.length === 0 ? (
          <p className="text-gray-500">No files uploaded yet.</p>
        ) : (
          <div className="space-y-3">
            {files.map(file => (
              <div key={file.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <h4 className="font-medium">{file.originalName}</h4>
                  <p className="text-sm text-gray-600">
                    {file.mimeType} • {(file.size / 1024).toFixed(1)} KB • {file.category}
                  </p>
                  {file.description && (
                    <p className="text-sm text-gray-500">{file.description}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <span className="text-sm text-gray-500">
                    Downloads: {file.downloadCount || 0}
                  </span>
                  <button
                    onClick={() => deleteFile(file.id)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
