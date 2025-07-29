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
    try {
        // এখানে সরাসরি Buffer ডেটা Cloudinary-তে পাঠানো হচ্ছে।
        // Cloudinary SDK-এর জন্য এটি একটি উপযুক্ত ইনপুট হওয়া উচিত।
        // resource_type 'raw' সেট করলে Cloudinary এটিকে একটি কাঁচা বাইনারি ফাইল হিসেবে আপলোড করবে।
        // এটি বড় বাফার ডেটার জন্য উপযুক্ত।
        const result = await cloudinary.uploader.upload_stream({
                folder: 'products', // Cloudinary-তে একটি নির্দিষ্ট ফোল্ডারে সেভ করতে পারেন
                resource_type: 'auto' // 'auto' বা 'image' ব্যবহার করা যেতে পারে
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload stream error:', error);
                    throw new Error(`Cloudinary upload failed: ${error.message}`);
                }
                if (!result || !result.secure_url) {
                    throw new Error('Failed to upload image to Cloudinary: No secure URL received.');
                }
                // এখানে আমরা প্রমিজ ব্যবহার করছি, তাই এই রেজাল্টটি বাইরে পাঠাতে হবে
                // upload_stream একটি কলব্যাক-ভিত্তিক API, তাই এটিকে Promise-এ মোড়াতে হবে।
            }
        ).end(fileBuffer); // বাফার ডেটা স্ট্রিম-এ লেখা হচ্ছে

        // যেহেতু upload_stream একটি কলব্যাক-ভিত্তিক, তাই এটিকে Promise-এ মোড়াতে হবে।
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({
                    folder: 'products',
                    resource_type: 'auto'
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
            ).end(fileBuffer);
        });

    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
};

export default cloudinary;