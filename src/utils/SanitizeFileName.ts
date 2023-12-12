export function sanitizeFileName(fileName) {
    // Replace special characters with underscores
    return fileName.replace(/[^\w.-]/g, '_');
}