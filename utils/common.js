export const getImageUrl = (imagePath, apiUrl, imageVersion) => {
    if (!imagePath) return "https://avatar.iran.liara.run/public";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
        return imagePath;
    }
    return `${apiUrl}/o3_chat/${imagePath}`;
};
