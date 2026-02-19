export const uploadToImgBB = (imageUri, onProgress) => {
    return new Promise((resolve, reject) => {
        const apiKey = process.env.EXPO_PUBLIC_IMGBB_API_KEY;

        if (!apiKey) {
            reject(new Error("ImgBB API Key is missing. Please set EXPO_PUBLIC_IMGBB_API_KEY in .env"));
            return;
        }

        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        const formData = new FormData();
        formData.append("image", {
            uri: imageUri,
            name: filename,
            type: type,
        });

        const xhr = new XMLHttpRequest();

        xhr.open("POST", `https://api.imgbb.com/1/upload?key=${apiKey}`);

        if (onProgress) {
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    onProgress(event.loaded / event.total);
                }
            };
        }

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    if (data.success) {
                        resolve(data.data.url);
                    } else {
                        reject(new Error(data.error ? data.error.message : "Failed to upload image"));
                    }
                } catch (error) {
                    reject(new Error("Failed to parse response"));
                }
            } else {
                reject(new Error(`Upload failed with status ${xhr.status}`));
            }
        };

        xhr.onerror = () => {
            reject(new Error("Network error during image upload"));
        };

        xhr.send(formData);
    });
};
