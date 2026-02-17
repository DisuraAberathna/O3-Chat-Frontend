export const getImageUrl = (imagePath, apiUrl, imageVersion) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
        return imagePath;
    }
    return `${apiUrl}/o3_chat/${imagePath}?v=${imageVersion || ""}`;
};
