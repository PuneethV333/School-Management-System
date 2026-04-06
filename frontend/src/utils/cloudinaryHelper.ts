import axios from "axios"

export const returnUrl = async (file:File) => {
    const cloudinary_url = `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }/image/upload`
    
    
    console.log(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
console.log(import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    
    const data = new FormData()
    data.append('file',file)
    data.append('upload_preset',import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
    const res = await axios.post(cloudinary_url,data,{
        headers:{
            "Content-Type":"multipart/form-data"
        }
    });
    
    return res?.data?.secure_url;
}