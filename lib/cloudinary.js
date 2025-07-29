import { v2 as cloudinary } from 'cloudinary';

// Cloudinary কনফিগারেশন
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * ফাইল আপলোড করার ফাংশন
 * @param {Buffer} fileBuffer - ফাইলের বাইনারি ডেটা বাফার হিসেবে।
 * @param {string} mimeType - ফাইলের MIME টাইপ (যেমন: 'image/jpeg', 'image/png')।
 * @returns {Promise<string>} - Cloudinary থেকে প্রাপ্ত আপলোড করা ছবির URL।
 */
export const uploadImageToCloudinary = async(fileBuffer, mimeType) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
                folder: 'products', // Cloudinary-তে একটি নির্দিষ্ট ফোল্ডারে সেভ করতে পারেন
                resource_type: 'auto', // 'auto' বা 'image' ব্যবহার করা যেতে পারে
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload stream error:', error);
                    return reject(new Error(`Cloudinary upload failed: ${error.message}`));
                }
                if (!result || !result.secure_url) {
                    return reject(new Error('Failed to upload image to Cloudinary: No secure URL received.'));
                }
                resolve(result.secure_url);
            }
        );

        uploadStream.on('error', (error) => {
            console.error('Cloudinary upload stream internal error:', error);
            reject(new Error(`Cloudinary upload failed: ${error.message}`));
        });

        uploadStream.end(fileBuffer);
    });
};

/**
 * Cloudinary থেকে ছবি মুছে ফেলার ফাংশন।
 * @param {string} imageUrl - Cloudinary ছবির URL।
 * @returns {Promise<any>} - Cloudinary API থেকে প্রাপ্ত ফলাফল।
 */
export const deleteImageFromCloudinary = async(imageUrl) => {
    try {
        // Cloudinary URL থেকে public ID বের করা হচ্ছে।
        // উদাহরণ: https://res.cloudinary.com/your_cloud_name/image/upload/v123456789/products/image_public_id.jpg
        // public ID হবে 'image_public_id' (যদি ফোল্ডার 'products' হয়)
        const parts = imageUrl.split('/');
        const publicIdWithExtension = parts[parts.length - 1]; // image_public_id.jpg
        const publicIdWithoutExtension = publicIdWithExtension.split('.')[0]; // image_public_id

        // ফোল্ডার সহ public ID তৈরি করা হচ্ছে
        const fullPublicId = `products/${publicIdWithoutExtension}`;

        const result = await cloudinary.uploader.destroy(fullPublicId);

        if (result.result !== 'ok') {
            console.warn(`Failed to delete image ${fullPublicId} from Cloudinary:`, result);
        }
        return result;
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        // ত্রুটি হলেও আপডেটের প্রক্রিয়া যেন বন্ধ না হয়, তাই এখানে ত্রুটি থ্রো না করে লগ করা হয়েছে।
        // যদি ছবি ডিলিট করা অত্যাবশ্যক হয়, তাহলে এখানে throw error; ব্যবহার করতে পারেন।
        return { result: 'error', message: error.message };
    }
};

export default cloudinary;