import FileUploadManager from '../../src/components/FileUploadManager'

export default function FileManagementPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">File Management</h1>
          <p className="text-gray-600 mt-2">
            Upload and manage files for your portfolio. PDFs, images, and documents.
          </p>
        </div>
        
        <FileUploadManager />
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            This page will be integrated with Google Cloud PostgreSQL once your database is set up.
          </p>
        </div>
      </div>
    </div>
  )
}
