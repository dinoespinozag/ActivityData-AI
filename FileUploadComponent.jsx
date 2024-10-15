import React, { useCallback, useState } from 'react';
import { Box, VStack, Text, Button, useColorModeValue, HStack, Icon } from '@chakra-ui/react';
import { UploadCloud, FileText, X } from 'lucide-react';

export default function FileUploadComponent() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);

  const borderColor = useColorModeValue('gray.300', 'gray.600');
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const activeBgColor = useColorModeValue('gray.100', 'gray.600');

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === "application/json" || droppedFile.type === "text/csv")) {
      setFile(droppedFile);
    }
  }, []);

  const handleChange = useCallback((e) => {
    e.preventDefault();
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  }, []);

  const handleSubmit = useCallback(() => {
    console.log("Processing file:", file);
  }, [file]);

  const removeFile = useCallback(() => {
    setFile(null);
  }, []);

  // Function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <VStack spacing={4} align="stretch" maxW="600px" mx="auto" p={6}>
      <Text fontSize="2xl" fontWeight="bold" textAlign="center">
        Upload and harmonize your city data
      </Text>
      <Text textAlign="center" color="gray.600">
        Upload any data or document of your city's activity (e.g., from a local provider) to be
        harmonized into the required GPC emission inventory format.
      </Text>

      {!file ? (
        <Box
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          position="relative"
        >
          <input
            type="file"
            accept=".csv,.json"
            onChange={handleChange}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer',
              zIndex: 1
            }}
          />
          <Box
            borderWidth={2}
            borderStyle="dashed"
            borderColor={dragActive ? "blue.400" : borderColor}
            borderRadius="md"
            p={10}
            bg={dragActive ? activeBgColor : bgColor}
            textAlign="center"
            transition="all 0.2s"
          >
            <VStack spacing={3}>
              <UploadCloud size={48} color={dragActive ? "#4299E1" : "#718096"} />
              <Text fontWeight="medium">
                Drop files here or click to browse
              </Text>
              <Text fontSize="sm" color="gray.500">
                CSV or JSON (max 100MB)
              </Text>
            </VStack>
          </Box>
        </Box>
      ) : (
        <Box
          borderWidth={1}
          borderRadius="md"
          p={4}
          bg={bgColor}
        >
          <HStack justify="space-between">
            <HStack spacing={4}>
              <Icon as={FileText} boxSize={6} color="blue.500" />
              <VStack align="start" spacing={0}>
                <Text fontWeight="medium">{file.name}</Text>
                <Text fontSize="sm" color="gray.500">
                  {formatFileSize(file.size)}
                </Text>
              </VStack>
            </HStack>
            <Button
              size="sm"
              variant="ghost"
              colorScheme="red"
              onClick={removeFile}
            >
              <Icon as={X} />
            </Button>
          </HStack>
        </Box>
      )}

      <Button
        colorScheme="blue"
        size="lg"
        isDisabled={!file}
        onClick={handleSubmit}
        mt={4}
      >
        Upload and Process
      </Button>
    </VStack>
  );
}