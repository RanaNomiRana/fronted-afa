import React, { useState } from 'react';
import axios from 'axios';

type FileItem = {
    name: string;
    isDirectory: boolean;
    path: string;
};

const DirectoryFiles: React.FC = () => {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([]); // For displaying filtered files
    const [error, setError] = useState<string>('');
    const [currentPath, setCurrentPath] = useState<string>('C:\\');
    const [previewFile, setPreviewFile] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>(''); // For search input

    const fetchFiles = async (path: string) => {
        setError('');
        try {
            const response = await axios.get<{ files: FileItem[] }>('http://localhost:4000/get-files', {
                params: { path },
            });
            setFiles(response.data.files);
            setFilteredFiles(response.data.files); // Initialize the filtered files with all files
            setCurrentPath(path);
        } catch (err: unknown) {
            setError('Failed to fetch files. Please try again.');
        }
    };

    const handleFileClick = (file: FileItem) => {
        if (file.isDirectory) {
            fetchFiles(file.path);
        } else {
            setPreviewFile(file.path);
        }
    };

    const goBack = () => {
        const parentPath = currentPath.substring(0, currentPath.lastIndexOf('\\')) || 'C:\\';
        fetchFiles(parentPath);
    };

    const closePreview = () => setPreviewFile(null);

    const openModal = () => {
        setIsModalOpen(true);
        fetchFiles('C:\\');
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFiles([]);
        setPreviewFile(null);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Filter files based on the search query
        const filtered = files.filter(file =>
            file.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredFiles(filtered);
    };

    const renderPreview = () => {
        if (!previewFile) return null;

        const fileExtension = previewFile.split('.').pop()?.toLowerCase();
        const previewUrl = `http://localhost:4000/files/${encodeURIComponent(previewFile)}`;

        if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension || '')) {
            return (
                <img
                    src={previewUrl}
                    alt={decodeURIComponent(previewFile.split('\\').pop() || '')}
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                />
            );
        } else if (['mp4', 'webm'].includes(fileExtension || '')) {
            return (
                <video controls style={{ width: '100%' }}>
                    <source src={previewUrl} type={`video/${fileExtension}`} />
                    Your browser does not support the video tag.
                </video>
            );
        } else if (['mp3', 'wav'].includes(fileExtension || '')) {
            return (
                <audio controls style={{ width: '100%' }}>
                    <source src={previewUrl} type={`audio/${fileExtension}`} />
                    Your browser does not support the audio tag.
                </audio>
            );
        } else {
            return <p>Cannot preview this file type.</p>;
        }
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif' }}>
            <button
                onClick={openModal}
                style={{
                    fontSize: '16px',
                    cursor: 'pointer',
                    marginTop: '10px',
                }}
            >
                Open Drive
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: 'auto',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#fff',
                            padding: '20px',
                            borderRadius: '8px',
                            width: 'auto',
                            maxHeight: '90%',
                            overflowY: 'auto',
                            textAlign: 'center',
                        }}
                    >
                        <h2>File Explorer</h2>
                        <button
                            onClick={closeModal}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '20px',
                                padding: '5px 10px',
                                fontSize: '14px',
                                cursor: 'pointer',
                                backgroundColor: '#FF4136',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                            }}
                        >
                            Close
                        </button>

                        {/* Search Input */}
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search by file name"
                            style={{
                                margin: '10px 0',
                                padding: '10px',
                                fontSize: '14px',
                                width: '100%',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                            }}
                        />

                        {currentPath !== 'C:\\' && (
                            <button
                                onClick={goBack}
                                style={{
                                    marginBottom: '10px',
                                    padding: '10px 20px',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                }}
                            >
                                Go Back
                            </button>
                        )}

                        {error && <p style={{ color: 'red' }}>{error}</p>}

                        {/* File List */}
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {filteredFiles.map((file, index) => (
                                <li
                                    key={index}
                                    style={{
                                        margin: '5px 0',
                                        cursor: 'pointer',
                                        color: file.isDirectory ? 'blue' : 'black',
                                    }}
                                    onClick={() => handleFileClick(file)}
                                >
                                    {file.isDirectory ? `[Folder] ${file.name}` : file.name}
                                </li>
                            ))}
                        </ul>

                        {/* Preview Modal */}
                        {previewFile && (
                            <div
                                style={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    zIndex: 2000,
                                }}
                            >
                                <div
                                    style={{
                                        backgroundColor: '#fff',
                                        padding: '20px',
                                        borderRadius: '8px',
                                        width: '80%',
                                        maxHeight: '80%',
                                        overflowY: 'auto',
                                        textAlign: 'center',
                                    }}
                                >
                                    <h2>Preview: {decodeURIComponent(previewFile.split('\\').pop() || '')}</h2>
                                    {renderPreview()}
                                    <button
                                        onClick={closePreview}
                                        style={{
                                            marginTop: '20px',
                                            padding: '10px 20px',
                                            fontSize: '16px',
                                            cursor: 'pointer',
                                            backgroundColor: '#007BFF',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '4px',
                                        }}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DirectoryFiles;
